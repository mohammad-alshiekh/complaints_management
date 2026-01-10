import { NextRequest } from "next/server";
import { ApiHelper } from "@/lib/api-helper";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const queryString = searchParams.toString();
  
  const endpoint = `/users/all${queryString ? `?${queryString}` : ""}`;
  
  return ApiHelper.get(request, endpoint);
}
