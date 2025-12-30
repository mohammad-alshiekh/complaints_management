import { NextRequest } from "next/server";
 import { ApiHelper } from "@/lib/api-helper";

export async function POST(request: NextRequest) {
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
    
}
