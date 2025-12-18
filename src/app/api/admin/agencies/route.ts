import { NextRequest } from "next/server";
import { ApiRoutes } from "@/lib/api-routes";

export async function GET(request: NextRequest) {
  return ApiRoutes.adminAgencies.getAll(request);
}

export async function POST(request: NextRequest) {
  return ApiRoutes.adminAgencies.create(request);
}

