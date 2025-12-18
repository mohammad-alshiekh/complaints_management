import { NextRequest } from "next/server";
import { ApiRoutes } from "@/lib/api-routes";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return ApiRoutes.adminUsers.activate(request, params.id);
}

