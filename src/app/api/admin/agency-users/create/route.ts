import { NextRequest } from "next/server";
import { ApiRoutes } from "@/lib/api-routes";

export async function POST(request: NextRequest) {
  return ApiRoutes.adminAgencyUsers.create(request);
}

