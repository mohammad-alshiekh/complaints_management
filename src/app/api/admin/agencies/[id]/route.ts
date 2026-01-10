import { NextRequest } from "next/server";
import { ApiHelper } from "@/lib/api-helper";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  return ApiHelper.get(request, `/admin/agencies/${id}`);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    return ApiHelper.put(request, `/admin/agencies/${id}`, formData);
  }

  const body = await request.json();
  return ApiHelper.put(request, `/admin/agencies/${id}`, body);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  return ApiHelper.delete(request, `/admin/agencies/${id}`);
}
