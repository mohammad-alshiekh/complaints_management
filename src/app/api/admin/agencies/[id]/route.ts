import { NextRequest } from "next/server";
import { ApiRoutes } from "@/lib/api-routes";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return ApiRoutes.adminAgencies.getById(request, params.id);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return ApiRoutes.adminAgencies.update(request, params.id);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return ApiRoutes.adminAgencies.delete(request, params.id);
}

