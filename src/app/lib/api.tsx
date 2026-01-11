import { ComplaintApiResponse } from "@/models/complaint";

const config = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://complaint.runasp.net/api",
  nextAuthUrl: process.env.NEXTAUTH_URL ?? "http://127.0.0.1:8000",
};




type JsonBody = Record<string, unknown>;
type ApiResult<T> = { data: T; message?: string };

class ApiError extends Error {
  status: number;
  details: unknown;
  constructor(message: string, status: number, details: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: JsonBody | FormData;
  withCredentials?: boolean;
};

class ApiClient {
  constructor(private readonly baseUrl = config.apiBaseUrl) {
    // Log API base URL in development for debugging
    if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
      console.log("API Base URL:", this.baseUrl);
    }
  }

  private buildUrl(endpoint: string) {
    // If endpoint starts with /api/, use relative URL (same origin)
    // This allows using Next.js API routes as proxy to bypass CORS
    if (endpoint.startsWith("/api/")) {
      return endpoint;
    }
    return `${this.baseUrl}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
  }

  async request<T = unknown>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { body, headers, withCredentials = false, ...rest } = options;

    const url = this.buildUrl(endpoint);

    const isFormData = body instanceof FormData;
    const finalHeaders = new Headers(headers ?? {});

    // Automatically add Authorization header if token exists in localStorage
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token && !finalHeaders.has("Authorization")) {
        finalHeaders.set("Authorization", `Bearer ${token}`);
      }
    }

    if (!isFormData && !finalHeaders.has("Content-Type")) {
      finalHeaders.set("Content-Type", "application/json");
    }

    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    let response: Response;
    try {
      response = await fetch(url, {
        method: options.method ?? "GET",
        headers: finalHeaders,
        body: isFormData ? body : body ? JSON.stringify(body) : undefined,
        credentials: withCredentials ? "include" : "omit",
        signal: controller.signal,
        ...rest,
      });
      clearTimeout(timeoutId);
    } catch (fetchError: any) {
      clearTimeout(timeoutId);

      // Handle network errors (CORS, connection refused, timeout, etc.)
      const errorMessage = fetchError.message || "Network error";
      const errorName = fetchError.name || "";

      if (errorName === "AbortError" || errorMessage.includes("timeout")) {
        throw new ApiError(
          "Request timed out. The server is taking too long to respond. Please try again.",
          0,
          { originalError: fetchError, url }
        );
      }

      if (
        errorMessage.includes("Failed to fetch") ||
        errorMessage.includes("NetworkError") ||
        errorMessage.includes("Network request failed") ||
        errorMessage.includes("ERR_INTERNET_DISCONNECTED") ||
        errorMessage.includes("ERR_CONNECTION_REFUSED")
      ) {
        // Log the actual URL for debugging
        console.error("API Request Failed:", {
          url,
          endpoint,
          baseUrl: this.baseUrl,
          error: fetchError.message,
        });

        throw new ApiError(
          `Unable to connect to the server at ${this.baseUrl}. This could be due to:\n- CORS policy restrictions\n- Server is down or unreachable\n- Network connectivity issues\n\nPlease check your internet connection or contact support.`,
          0,
          { originalError: fetchError, url, baseUrl: this.baseUrl }
        );
      }

      throw new ApiError(
        `Network request failed: ${errorMessage}`,
        0,
        { originalError: fetchError, url }
      );
    }

    if (response.status === 204) {
      return {} as T;
    }

    const contentType = response.headers.get("content-type") ?? "";
    const payload =
      contentType.includes("application/json")
        ? await response.json().catch(() => ({}))
        : await response.text();

    if (!response.ok) {
      let message = "Request failed";
      
      if (payload && typeof payload === "object") {
        // Try to find a message in common locations
        const potentialMessage = 
          (payload as any).message || 
          (payload as any).error?.message || 
          (payload as any).error || 
          (payload as any).errorMessage;
          
        if (typeof potentialMessage === "string" && potentialMessage.trim() !== "") {
          message = potentialMessage;
        } else if (typeof potentialMessage === "object" && potentialMessage !== null) {
           // Handle case where error might be an object with its own message
           message = (potentialMessage as any).message || JSON.stringify(potentialMessage);
        } else if (response.status === 403) {
          message = "Forbidden: You do not have permission to perform this action.";
        } else if (response.status === 401) {
          message = "Unauthorized: Please log in to continue.";
        } else if (response.status === 404) {
          message = "Not Found: The requested resource could not be found.";
        } else {
          message = response.statusText || `Error ${response.status}`;
        }
      } else if (typeof payload === "string" && payload.trim() !== "") {
        message = payload;
      } else {
        // Fallback for empty payloads or non-JSON payloads
        if (response.status === 403) {
          message = "Forbidden: You do not have permission to perform this action.";
        } else if (response.status === 401) {
          message = "Unauthorized: Please log in to continue.";
        } else {
          message = response.statusText || `Error ${response.status}`;
        }
      }

      throw new ApiError(message, response.status, payload);
    }

    // If the request was to our own Next.js API routes (starts with /api/),
    // we need to unwrap the standard ApiResponse envelope
    if (url.startsWith("/api/") && payload && typeof payload === "object") {
      // Check if it matches our ApiResponse structure
      if ("success" in payload && "data" in payload) {
         if (payload.success) {
           return payload.data as T;
         } else {
           // This case should be handled by response.ok check above usually,
           // but if we return 200 OK with success: false (which we shouldn't based on ApiHelper),
           // we handle it here.
           // However, ApiHelper uses appropriate status codes.
           // So if we are here, success is likely true.
           return payload.data as T;
         }
      }
    }

    return payload as T;
  }

  login(body: { email: string; password: string }) {
    return this.request<{
      token: string;
      userId: string;
      email: string;
      userRole: number;
      success: boolean;
      message: string;
    }>("/api/auth/login", {
      method: "POST",
      body,
      withCredentials: false,
    });
  }

  // Validate token by making a login request
  validateToken(body: { email: string; password: string }) {
    // Use Next.js API route proxy to bypass CORS
    return this.request<{
      token: string;
      userId: string;
      email: string;
      success: boolean;
      message: string;
    }>("/api/auth/login", {
      method: "POST",
      body,
      withCredentials: false,
    });
  }
  // --- LOGIN NOW WORKS ---
  register(body: { name: string; email: string; password: string }) {
    return this.request<ApiResult<{ user: any }>>("/register", {
      method: "POST",
      body,
      withCredentials: false,
    });
  }

  // Helper method to add authorization header
  private getAuthHeaders(token: string | null): Record<string, string> {
    const headers: Record<string, string> = {
      "accept": "application/json",
            "content-type": "application/json"
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
  }

  // Admin User Methods - Using Next.js API routes to bypass CORS
  async activateUser(userId: string, token: string | null) {
    return this.request<void>(`/api/admin/users/${userId}/activate`, {
      method: "PUT",
      headers: this.getAuthHeaders(token),
    });
  }

  async deactivateUser(userId: string, token: string | null) {
    return this.request<void>(`/api/admin/users/${userId}/deactivate`, {
      method: "PUT",
      headers: this.getAuthHeaders(token),
    });
  }

  async createAgencyUser(body: {
    fullName: string;
    email: string;
    password: string;
    governmentEntityId: string;
  }, token: string | null) {
    return this.request("/api/admin/agency-users/create", {
      method: "POST",
      body,
      headers: {
        ...this.getAuthHeaders(token),
        "Content-Type": "application/json",
      },
    });
  }

  async getAgencyUsers(governmentEntityId: string, token: string | null) {
    return this.request<any[]>(`/api/admin/agency-users?governmentEntityId=${governmentEntityId}`, {
      method: "GET",
      headers: this.getAuthHeaders(token),
    });
  }

  async getAllAgencyUsers(token: string | null) {
    return this.request<any[]>("/api/admin/agency-users", {
      method: "GET",
      headers: this.getAuthHeaders(token),
    });
  }

  async getAllUsers(token: string | null, params?: { page?: number; size?: number; searchQuery?: string }) {
    const query = new URLSearchParams();
    if (params?.page) query.append("page", params.page.toString());
    if (params?.size) query.append("size", params.size.toString());
    if (params?.searchQuery) query.append("searchQuery", params.searchQuery);

    const queryString = query.toString();
    const url = `/api/users/all${queryString ? `?${queryString}` : ""}`;
    
    return this.request<{ data: any[]; count: number }>(url, {
      method: "GET",
      headers: this.getAuthHeaders(token),
    });
  }

  async exportComplaints(token: string | null, period: number) {
    return this.request<string>(`/api/export/complaints?period=${period}`, {
      method: "GET",
      headers: this.getAuthHeaders(token),
    });
  }

  async getComplaint(complaintId: string, token: string | null) {
    return this.request<{
      id: string;
      title: string;
      description: string;
      severity?: number;
      status?: number;
      citizenId?: string;
      referenceNumber?: string;
      type?: number;
      governmentEntityId?: string;
      locationLong?: number;
      locationLat?: number;
      governorate?: number;
      agencyNotes?: Array<{ note: string; createdAt: string }> | null;
      additionalInfoRequests?: Array<{ requestMessage: string; createdAt: string }> | null;
      attachments?: Array<{ fileName: string; fileUrl: string; contentType: string; fileSize: number }>;
      lockedBy?: string | null;
      rowVersion?: string;
      createdAt?: string;
      updatedAt?: string;
      studentName?: string;
      email?: string;
      timeline?: any[];
    }>(`/api/complaint/${complaintId}`, {
      method: "GET",
      headers: this.getAuthHeaders(token),
    });
  }

  async getComplaintHistory(complaintId: string, token: string | null) {
    return this.request<any[]>(`/api/complaint/${complaintId}/history`, {
      method: "GET",
      headers: this.getAuthHeaders(token),
    });
  }

  async getComplaintVersions(complaintId: string, token: string | null) {
    return this.request<any[]>(`/api/complaint/${complaintId}/versions`, {
      method: "GET",
      headers: this.getAuthHeaders(token),
    });
  }

  async updateComplaint(complaintId: string, body: any, token: string | null) {
    return this.request<any>(`/api/complaint/${complaintId}`, {
      method: "PUT",
      headers: this.getAuthHeaders(token),
      body,
    });
  }

  /**
   * Update complaint status (proxy to /Complaint/status)
   * Body should include: { id: string, status: number, agencyNotes?: string|null, additionalInfoRequest?: string|null }
   */
  async updateComplaintStatus(body: { id: string; status: number; agencyNotes?: string | null; additionalInfoRequest?: string | null }, token: string | null) {
    return this.request<any>(`/api/complaint/status`, {
      method: "PUT",
      headers: this.getAuthHeaders(token),
      body,
    });
  }

  async addComplaintNote(complaintId: string, note: string, token: string | null) {
    return this.request<any>(`/api/complaint/${complaintId}/notes`, {
      method: "POST",
      headers: this.getAuthHeaders(token),
      body: { note },
    });
  }

  async requestInfo(complaintId: string, requestMessage: string, token: string | null) {
    return this.request<any>(`/api/complaint/${complaintId}/request-info`, {
      method: "POST",
      headers: this.getAuthHeaders(token),
      body: { requestMessage },
    });
  }

  async takeOwnership(complaintId: string, token: string | null) {
    return this.request<any>(`/api/complaint/take-ownership/${complaintId}`, {
      method: "PUT",
      headers: this.getAuthHeaders(token),
    });
  }

  async releaseOwnership(complaintId: string, token: string | null) {
    return this.request<any>(`/api/complaint/release-ownership/${complaintId}`, {
      method: "PUT",
      headers: this.getAuthHeaders(token),
    });
  }

  // Agency Methods - Using Next.js API routes to bypass CORS
  async getAgencies(token: string | null) {
    return this.request<Array<{ id: string; name: string; logoUrl: string | null }>>("/api/agencies", {
      method: "GET",
      headers: this.getAuthHeaders(token),
    });
  }

  /**
   * Get complaints count grouped by governorate
   */
  async getComplaintsByGovernorate(token: string | null) {
    // Use Next.js API route proxy to avoid CORS (server-side will call external API)
    return this.request<Array<{ governorate: number; count: number }>>(
      "/api/analytics/by-governorate",
      {
        method: "GET",
        headers: this.getAuthHeaders(token),
      }
    );
  }

  /**
   * Get complaints count grouped by status
   */
  async getComplaintStatusCounts(token: string | null) {
    return this.request<Array<{ status: number; count: number }>>(
      "/api/analytics/status-counts",
      {
        method: "GET",
        headers: this.getAuthHeaders(token),
      }
    );
  }

  /**
   * Get complaints count grouped by agency/government entity
   */
  async getComplaintsByAgency(token: string | null) {
    // Call internal Next.js proxy route to avoid CORS
    return this.request<Array<{ governmentEntityId: string; governmentEntityName: string; count: number }>>(
      "/api/analytics/by-agency",
      {
        method: "GET",
        headers: this.getAuthHeaders(token),
      }
    );
  }

  async createAgency(formData: FormData, token: string | null) {
    return this.request<{ id: string; name: string }>("/api/admin/agencies", {
      method: "POST",
      headers: {
        ...this.getAuthHeaders(token),
        "accept": "*/*",
      },
      body: formData,
    });
  }

  async getAgency(agencyId: string, token: string | null) {
    return this.request<{ id: string; name: string }>(`/api/admin/agencies/${agencyId}`, {
      method: "GET",
      headers: this.getAuthHeaders(token),
    });
  }

  async updateAgency(agencyId: string, formData: FormData, token: string | null) {
    return this.request<{ id: string; name: string }>(`/api/admin/agencies/${agencyId}`, {
      method: "PUT",
      headers: {
        ...this.getAuthHeaders(token),
        "accept": "*/*",
      },
      body: formData,
    });
  }

  async deleteAgency(agencyId: string, token: string | null) {
    return this.request<boolean>(`/api/admin/agencies/${agencyId}`, {
      method: "DELETE",
      headers: this.getAuthHeaders(token),
    });
  }

  /**
   * Get complaints with pagination, optional agencyId and status
   * @param token Auth token
   * @param params { page, size, agencyId, complaintStatus }
   */
  async getComplaints(
    token: string | null,
    params?: {
      page?: number;
      size?: number;
      agencyId?: string;
      complaintStatus?: number;
      searchTerm?: string;
    }
  ) {
     const query = new URLSearchParams();
    if (params?.page) query.append("page", params.page.toString());
    if (params?.size) query.append("size", params.size.toString());
    if (params?.agencyId) query.append("agencyId", params.agencyId);
    if (params?.searchTerm) query.append("searchQuery", params.searchTerm);
    if (
      params?.complaintStatus !== undefined &&
      params.complaintStatus !== null
    ) {
      query.append("complaintStatus", params.complaintStatus.toString());
    }
    const url = `/api/complaints${query.toString() ? `?${query}` : ""}`;
    return this.request<ComplaintApiResponse[]>(url, {
      method: "GET",
      headers: {
        ...this.getAuthHeaders(token),
        "accept": "*/*",
      },
    });
  }
}


const apiClient = new ApiClient();
export default apiClient;
