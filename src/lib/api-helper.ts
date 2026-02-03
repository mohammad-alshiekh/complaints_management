  import { NextRequest, NextResponse } from "next/server";
 
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: any;
  meta?: any;
}

/**
 * Request configuration interface
 */
export interface ApiRequestConfig {
  requiresAuth?: boolean;
  customHeaders?: Record<string, string>;
  acceptType?: string;
  contentType?: string;
}

/**
 * API Helper Class - Centralized API request handling
 * Provides static methods for making HTTP requests with consistent error handling
 */
export class ApiHelper {
  private static readonly API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://complaint.runasp.net/api";

  /**
   * Build headers for API requests
   */
  private static buildHeaders(
    request: NextRequest,
    config: ApiRequestConfig = {}
  ): HeadersInit {
    const headers: Record<string, string> = {
      "accept": config.acceptType ?? "text/plain",
    };

    // Add authorization header if required
    if (config.requiresAuth !== false) {
      const authHeader = request.headers.get("Authorization");
      if (authHeader) {
        headers["Authorization"] = authHeader;
      }
    }

    // Add content type for requests with body
    if (config.contentType) {
      headers["Content-Type"] = config.contentType;
    }

    // Add custom headers
    if (config.customHeaders) {
      Object.assign(headers, config.customHeaders);
    }

    return headers;
  }

  /**
   * Parse response data (handles JSON and text)
   */
  private static async parseResponse(
    response: Response
  ): Promise<{ data: any; isJson: boolean }> {
    const contentType = response.headers.get("content-type");
    const isJson = contentType?.includes("application/json") ?? false;

    let data: any;
    if (isJson) {
      try {
        data = await response.json();
      } catch {
        data = await response.text();
      }
    } else {
      const textData = await response.text();
      // Handle boolean strings
      if (textData === "true") {
        data = true;
      } else if (textData === "false") {
        data = false;
      } else {
        data = textData;
      }
    }

    return { data, isJson };
  }

  /**
   * Handle error responses
   */
  public static handleErrorResponse(
    response: Response,
    data: any,
    errorContext: string
  ): NextResponse<ApiResponse> {
    let message = "Request failed";

    if (typeof data === "string" && data.trim() !== "") {
      message = data;
    } else if (data?.message) {
      message = data.message;
    } else if (data?.error) {
      message = typeof data.error === "string" ? data.error : (data.error.message || "Request failed");
    } else {
      // Fallback to standard HTTP messages if no custom message in body
      switch (response.status) {
        case 401:
          message = "Unauthorized: Please log in to continue.";
          break;
        case 403:
          message = "Forbidden: You do not have permission to perform this action.";
          break;
        case 404:
          message = "Not Found: The requested resource could not be found.";
          break;
        case 500:
          message = "Internal Server Error: Something went wrong on the server.";
          break;
        default:
          message = response.statusText || `Error ${response.status}`;
      }
    }

    console.error(`${errorContext} API Error:`, {
      status: response.status,
      message,
      data,
    });

    return NextResponse.json(
      {
        success: false,
        message,
        error: data,
      },
      { status: response.status }
    );
  }

  /**
   * Handle success responses
   */
  private static handleSuccessResponse(
    response: Response,
    data: any,
    message: string = "Operation successful"
  ): NextResponse<ApiResponse> {
    // If response is 204 No Content or 201 Created, we normalize to 200
    // to ensure consistent handling and avoid potential NextResponse issues
    // with certain status codes in some environments.
    const status = (response.status === 204 || response.status === 201) ? 200 : response.status;
    
    return NextResponse.json(
      {
        success: true,
        message,
        data: data || {},
      },
      { status }
    );
  }

  /**
   * Check if authorization is required and valid
   */
  private static validateAuth(
    request: NextRequest,
    requiresAuth: boolean = true
  ): NextResponse<ApiResponse> | null {
    if (requiresAuth) {
      const authHeader = request.headers.get("Authorization");
      if (!authHeader) {
        return NextResponse.json(
          {
            success: false,
            message: "Authorization header is required",
            error: "Unauthorized",
          },
          { status: 401 }
        );
      }
    }
    return null;
  }

  /**
   * GET request
   */
  static async get(
    request: NextRequest,
    endpoint: string,
    config: ApiRequestConfig = {}
  ): Promise<NextResponse> {
    try {
      // Validate auth if required
      const authError = this.validateAuth(request, config.requiresAuth);
      if (authError) return authError;

      // Build headers
      const headers = this.buildHeaders(request, config);

      // Make request
      const response = await fetch(`${this.API_BASE_URL}${endpoint}`, {
        method: "GET",
        headers,
      });

      // Parse response
      const { data } = await this.parseResponse(response);

      // Handle response
      if (!response.ok) {
        return this.handleErrorResponse(response, data, "GET");
      }

      return this.handleSuccessResponse(response, data);
    } catch (error: any) {
      console.error(`GET ${endpoint} Error:`, error);
      return NextResponse.json(
        {
          success: false,
          message: error.message || "An error occurred",
          error,
        },
        { status: 500 }
      );
    }
  }

  /**
   * POST request
   */
  static async post(
    request: NextRequest,
    endpoint: string,
    body?: any,
    config: ApiRequestConfig = {}
  ): Promise<NextResponse> {
    try {
      // Validate auth if required
      const authError = this.validateAuth(request, config.requiresAuth);
      if (authError) return authError;

      const isFormData = body instanceof FormData;

      // Build headers with JSON content type by default only if body exists and is not FormData
      if (body && !config.contentType && !isFormData) {
        config.contentType = "application/json";
      }

      const headers = this.buildHeaders(request, config);

      // Make request
      const response = await fetch(`${this.API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers,
        body: isFormData ? body : body ? JSON.stringify(body) : undefined,
      });

      // Parse response
      const { data } = await this.parseResponse(response);

      // Handle response
      if (!response.ok) {
        return this.handleErrorResponse(response, data, "POST");
      }

      return this.handleSuccessResponse(response, data);
    } catch (error: any) {
      console.error(`POST ${endpoint} Error:`, error);
      return NextResponse.json(
        {
          success: false,
          message: error.message || "An error occurred",
          error,
        },
        { status: 500 }
      );
    }
  }

  /**
   * PUT request
   */
  static async put(
    request: NextRequest,
    endpoint: string,
    body?: any,
    config: ApiRequestConfig = {}
  ): Promise<NextResponse> {
    try {
      // Validate auth if required
      const authError = this.validateAuth(request, config.requiresAuth);
      if (authError) return authError;

      const isFormData = body instanceof FormData;

      if (body && !config.contentType && !isFormData) {
        config.contentType = "application/json";
      }

      const headers = this.buildHeaders(request, config);

      const response = await fetch(`${this.API_BASE_URL}${endpoint}`, {
        method: "PUT",
        headers,
        body: isFormData ? body : body ? JSON.stringify(body) : undefined,
      });

      const { data } = await this.parseResponse(response);

      if (!response.ok) {
        return this.handleErrorResponse(response, data, "PUT");
      }

      return this.handleSuccessResponse(response, data);
    } catch (error: any) {
      console.error(`PUT ${endpoint} Error:`, error);
      return NextResponse.json(
        {
          success: false,
          message: error.message || "An error occurred",
          error,
        },
        { status: 500 }
      );
    }
  }

  /**
   * DELETE request
   */
  static async delete(
    request: NextRequest,
    endpoint: string,
    config: ApiRequestConfig = {}
  ): Promise<NextResponse> {
    try {
      const authError = this.validateAuth(request, config.requiresAuth);
      if (authError) return authError;

      const headers = this.buildHeaders(request, config);

      const response = await fetch(`${this.API_BASE_URL}${endpoint}`, {
        method: "DELETE",
        headers,
      });

      const { data } = await this.parseResponse(response);

      if (!response.ok) {
        return this.handleErrorResponse(response, data, "DELETE");
      }

      return this.handleSuccessResponse(response, data);
    } catch (error: any) {
      console.error(`DELETE ${endpoint} Error:`, error);
      return NextResponse.json(
        {
          success: false,
          message: error.message || "An error occurred",
          error,
        },
        { status: 500 }
      );
    }
  }

  /**
   * Helper to validate request body
   */
  static validateBody(body: any, requiredFields: string[]): NextResponse<ApiResponse> | null {
    if (!body) {
      return NextResponse.json(
        {
          success: false,
          message: "Request body is required",
          error: "Missing Body",
        },
        { status: 400 }
      );
    }

    const missingFields = requiredFields.filter((field) => !body[field]);
    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: `Missing required fields: ${missingFields.join(", ")}`,
          error: { missingFields },
        },
        { status: 400 }
      );
    }

    return null;
  }
}
