import { NextRequest, NextResponse } from "next/server";

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
    const headers: HeadersInit = {
      Accept: config.acceptType ?? "text/plain",
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
  private static handleErrorResponse(
    response: Response,
    data: any,
    errorContext: string
  ): NextResponse {
    const message =
      typeof data === "string"
        ? data
        : data?.message || data?.error || "Request failed";

    console.error(`${errorContext} API Error:`, {
      status: response.status,
      message,
    });

    return NextResponse.json(
      {
        success: false,
        message,
        ...(data && typeof data === "object" && !data.message && !data.error
          ? data
          : {}),
      },
      { status: response.status }
    );
  }

  /**
   * Handle success responses
   */
  private static handleSuccessResponse(
    response: Response,
    data: any
  ): NextResponse {
    return NextResponse.json(data, { status: response.status });
  }

  /**
   * Check if authorization is required and valid
   */
  private static validateAuth(
    request: NextRequest,
    requiresAuth: boolean = true
  ): NextResponse | null {
    if (requiresAuth) {
      const authHeader = request.headers.get("Authorization");
      if (!authHeader) {
        return NextResponse.json(
          { success: false, message: "Authorization header is required" },
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

      // Build headers with JSON content type by default only if body exists
      const headers = this.buildHeaders(request, {
        ...config,
        contentType: config.contentType ?? (body ? "application/json" : undefined),
      });

      // Make request
      const response = await fetch(`${this.API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers,
        body: body ? JSON.stringify(body) : undefined,
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

      // Build headers with JSON content type by default only if body exists
      const headers = this.buildHeaders(request, {
        ...config,
        contentType: config.contentType ?? (body ? "application/json" : undefined),
      });

      // Make request
      const response = await fetch(`${this.API_BASE_URL}${endpoint}`, {
        method: "PUT",
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });

      // Parse response
      const { data } = await this.parseResponse(response);

      // Handle response
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
      // Validate auth if required
      const authError = this.validateAuth(request, config.requiresAuth);
      if (authError) return authError;

      // Build headers
      const headers = this.buildHeaders(request, config);

      // Make request
      const response = await fetch(`${this.API_BASE_URL}${endpoint}`, {
        method: "DELETE",
        headers,
      });

      // Parse response
      const { data } = await this.parseResponse(response);

      // Handle response
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
        },
        { status: 500 }
      );
    }
  }

  /**
   * PATCH request
   */
  static async patch(
    request: NextRequest,
    endpoint: string,
    body?: any,
    config: ApiRequestConfig = {}
  ): Promise<NextResponse> {
    try {
      // Validate auth if required
      const authError = this.validateAuth(request, config.requiresAuth);
      if (authError) return authError;

      // Build headers with JSON content type by default
      const headers = this.buildHeaders(request, {
        ...config,
        contentType: config.contentType ?? "application/json",
      });

      // Make request
      const response = await fetch(`${this.API_BASE_URL}${endpoint}`, {
        method: "PATCH",
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });

      // Parse response
      const { data } = await this.parseResponse(response);

      // Handle response
      if (!response.ok) {
        return this.handleErrorResponse(response, data, "PATCH");
      }

      return this.handleSuccessResponse(response, data);
    } catch (error: any) {
      console.error(`PATCH ${endpoint} Error:`, error);
      return NextResponse.json(
        {
          success: false,
          message: error.message || "An error occurred",
        },
        { status: 500 }
      );
    }
  }

  /**
   * Validate request body (helper method)
   */
  static validateBody(
    body: any,
    requiredFields: string[]
  ): NextResponse | null {
    for (const field of requiredFields) {
      if (!body || body[field] === undefined || body[field] === null) {
        return NextResponse.json(
          { success: false, message: `${field} is required` },
          { status: 400 }
        );
      }
    }
    return null;
  }
}

