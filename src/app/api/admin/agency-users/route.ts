import { NextRequest, NextResponse } from "next/server";
  import { ApiHelper } from "@/lib/api-helper";

export async function GET(request: NextRequest) {
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
    }

