import { NextRequest } from "next/server";
 import { ApiHelper } from "@/lib/api-helper";

export async function POST(request: NextRequest) {
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
    }

