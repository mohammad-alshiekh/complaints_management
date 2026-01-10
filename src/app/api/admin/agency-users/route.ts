import { NextRequest, NextResponse } from "next/server";
  import { ApiHelper } from "@/lib/api-helper";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const governmentEntityId = searchParams.get("governmentEntityId");

  const endpoint = governmentEntityId 
    ? `/admin/agency-users?governmentEntityId=${governmentEntityId}`
    : "/admin/agency-users";

  return ApiHelper.get(request, endpoint);
}

