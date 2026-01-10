import { NextRequest } from "next/server";
import { ApiHelper } from "@/lib/api-helper";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const period = searchParams.get("period");
  
  if (period === null) {
    return ApiHelper.handleErrorResponse(
      { status: 400, ok: false } as any,
      { message: "period parameter is required" },
      "EXPORT"
    );
  }

  return ApiHelper.get(request, `/Export/complaints?period=${period}`);
}
