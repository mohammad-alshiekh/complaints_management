import { NextRequest } from "next/server";
import { ApiHelper } from "@/lib/api-helper";

export async function GET(request: NextRequest) {
     return ApiHelper.get(request, "/Analytics/by-governorate");
}
