import { NextRequest } from "next/server";
 import { ApiHelper } from "@/lib/api-helper";

export async function GET(request: NextRequest) {
      const { searchParams } = new URL(request.url);
        const query = searchParams.toString();
        const endpoint = `/Complaint/paged${query ? `?${query}` : ""}`;
        
        return ApiHelper.get(
          request,
          endpoint,
          {
            requiresAuth: true, 
            acceptType: "*/*",
          }
        );
  }

