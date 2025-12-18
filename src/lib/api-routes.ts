import { NextRequest, NextResponse } from "next/server";
import { ApiHelper } from "./api-helper";

/**
 * Centralized API Routes Handler
 * All API route handlers are defined here for better organization
 */
export class ApiRoutes {
  /**
   * Auth Routes
   */
  static auth = {
    /**
     * POST /api/auth/login
     */
    login: async (request: NextRequest) => {
      const body = await request.json();

      // Validate request body
      const validationError = ApiHelper.validateBody(body, ["email", "password"]);
      if (validationError) {
        return validationError;
      }

      return ApiHelper.post(
        request,
        "/Auth/login",
        {
          email: body.email,
          password: body.password,
        },
        {
          requiresAuth: false,
          acceptType: "*/*",
        }
      );
    },
  };

  /**
   * Complaints Routes
   */
  static complaints = {
    /**
     * GET /api/complaints
     */
    getAll: async (request: NextRequest) => {
      return ApiHelper.get(request, "/Complaint", {
        requiresAuth: false, // Auth is optional for complaints
        acceptType: "application/json",
      });
    },
  };

  /**
   * Admin Agencies Routes
   */
  static adminAgencies = {
    /**
     * GET /api/admin/agencies
     */
    getAll: async (request: NextRequest) => {
      return ApiHelper.get(request, "/admin/agencies");
    },

    /**
     * POST /api/admin/agencies
     */
    create: async (request: NextRequest) => {
      const body = await request.json();

      // Validate request body
      const validationError = ApiHelper.validateBody(body, ["name"]);
      if (validationError) {
        return validationError;
      }

      return ApiHelper.post(request, "/admin/agencies", body);
    },

    /**
     * GET /api/admin/agencies/[id]
     */
    getById: async (request: NextRequest, id: string) => {
      return ApiHelper.get(request, `/admin/agencies/${id}`);
    },

    /**
     * PUT /api/admin/agencies/[id]
     */
    update: async (request: NextRequest, id: string) => {
      const body = await request.json();

      // Validate request body
      const validationError = ApiHelper.validateBody(body, ["name"]);
      if (validationError) {
        return validationError;
      }

      return ApiHelper.put(request, `/admin/agencies/${id}`, body);
    },

    /**
     * DELETE /api/admin/agencies/[id]
     */
    delete: async (request: NextRequest, id: string) => {
      return ApiHelper.delete(request, `/admin/agencies/${id}`);
    },
  };

  /**
   * Admin Agency Users Routes
   */
  static adminAgencyUsers = {
    /**
     * GET /api/admin/agency-users
     */
    getAll: async (request: NextRequest) => {
      const { searchParams } = new URL(request.url);
      const governmentEntityId = searchParams.get("governmentEntityId");

      if (!governmentEntityId) {
        return NextResponse.json(
          { success: false, message: "governmentEntityId is required" },
          { status: 400 }
        );
      }

      return ApiHelper.get(
        request,
        `/admin/agency-users?governmentEntityId=${governmentEntityId}`
      );
    },

    /**
     * POST /api/admin/agency-users/create
     */
    create: async (request: NextRequest) => {
      const body = await request.json();

      // Validate request body
      const validationError = ApiHelper.validateBody(body, [
        "fullName",
        "email",
        "password",
        "governmentEntityId",
      ]);
      if (validationError) {
        return validationError;
      }

      return ApiHelper.post(request, "/admin/agency-users/create", body);
    },
  };

  /**
   * Admin Users Routes
   */
  static adminUsers = {
    /**
     * PUT /api/admin/users/[id]/activate
     */
    activate: async (request: NextRequest, id: string) => {
      return ApiHelper.put(request, `/admin/users/${id}/activate`);
    },

    /**
     * PUT /api/admin/users/[id]/deactivate
     */
    deactivate: async (request: NextRequest, id: string) => {
      return ApiHelper.put(request, `/admin/users/${id}/deactivate`);
    },
  };
}

