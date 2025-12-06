// apiClient.ts
const config = { apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000/api", nextAuthUrl: process.env.NEXTAUTH_URL ?? "http://127.0.0.1:8000", };
 

 
// apiClient.ts
 
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
  constructor(private readonly baseUrl = config.apiBaseUrl) {}

  private buildUrl(endpoint: string) {
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

    const response = await fetch(url, {
      method: options.method ?? "GET",
      headers: finalHeaders,
      body: isFormData ? body : body ? JSON.stringify(body) : undefined,

      // ❌ Removed default credentials
      // ✔ Now it's optional
      credentials: withCredentials ? "include" : "omit",

      ...rest,
    });

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

  // --- LOGIN NOW WORKS ---
  login(body: { email: string; password: string }) {
    return this.request<ApiResult<{ user: any }>>("/login", {
      method: "POST",
      body,
      withCredentials: false, // <--- FIX FOR YOU
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
}

 
const apiClient = new ApiClient();
export default apiClient;
