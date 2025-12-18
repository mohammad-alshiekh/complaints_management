import { NextRequest } from "next/server";
import { ApiRoutes } from "@/lib/api-routes";

export async function GET(request: NextRequest) {
  return ApiRoutes.adminAgencyUsers.getAll(request);
}

