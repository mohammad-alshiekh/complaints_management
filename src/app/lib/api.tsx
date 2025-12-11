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

    // Auto-apply JSON header only if NOT formdata
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
      
      // Check for specific error types
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

    const contentType = response.headers.get("content-type") ?? "";
    const payload =
      contentType.includes("application/json")
        ? await response.json().catch(() => ({}))
        : await response.text();

    if (!response.ok) {
      const message =
        (payload &&
        typeof payload === "object" &&
        "message" in payload &&
        typeof payload.message === "string"
          ? payload.message
          : "Request failed") ?? response.statusText;

      throw new ApiError(message, response.status, payload);
    }

    return payload as T;
  }

   login(body: { email: string; password: string }) {
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
  private getAuthHeaders(token: string | null): HeadersInit {
    const headers: HeadersInit = {
      "accept": "text/plain",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
  }

  // Admin User Methods - Using Next.js API routes to bypass CORS
  async activateUser(userId: string, token: string | null) {
    return this.request<boolean>(`/api/admin/users/${userId}/activate`, {
      method: "PUT",
      headers: this.getAuthHeaders(token),
    });
  }

  async deactivateUser(userId: string, token: string | null) {
    return this.request<boolean>(`/api/admin/users/${userId}/deactivate`, {
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
    return this.request<{ id: string; fullName: string; email: string; governmentEntityId: string }>(
      "/api/admin/agency-users/create",
      {
        method: "POST",
        headers: this.getAuthHeaders(token),
        body,
      }
    );
  }

  async getAgencyUsers(governmentEntityId: string, token: string | null) {
    return this.request<Array<{
      id: string;
      fullName: string;
      email: string;
      governmentEntityId: string;
    }>>(`/api/admin/agency-users?governmentEntityId=${governmentEntityId}`, {
      method: "GET",
      headers: this.getAuthHeaders(token),
    });
  }

  // Agency Methods - Using Next.js API routes to bypass CORS
  async getAgencies(token: string | null) {
    return this.request<Array<{
      id: string;
      name: string;
    }>>("/api/admin/agencies", {
      method: "GET",
      headers: this.getAuthHeaders(token),
    });
  }

  async createAgency(body: { name: string }, token: string | null) {
    return this.request<{ id: string; name: string }>("/api/admin/agencies", {
      method: "POST",
      headers: this.getAuthHeaders(token),
      body,
    });
  }

  async getAgency(agencyId: string, token: string | null) {
    return this.request<{ id: string; name: string }>(`/api/admin/agencies/${agencyId}`, {
      method: "GET",
      headers: this.getAuthHeaders(token),
    });
  }

  async updateAgency(agencyId: string, body: { name: string }, token: string | null) {
    return this.request<{ id: string; name: string }>(`/api/admin/agencies/${agencyId}`, {
      method: "PUT",
      headers: this.getAuthHeaders(token),
      body,
    });
  }

  async deleteAgency(agencyId: string, token: string | null) {
    return this.request<boolean>(`/api/admin/agencies/${agencyId}`, {
      method: "DELETE",
      headers: this.getAuthHeaders(token),
    });
  }
}

 
const apiClient = new ApiClient();
export default apiClient;
