import { NextRequest } from "next/server";
import { ApiHelper } from "@/lib/api-helper";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return ApiHelper.get(request, `/admin/agencies/${params.id}`);

}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json();

  // Validate request body
  const validationError = ApiHelper.validateBody(body, ["name"]);
  if (validationError) {
    return validationError;
  }

  return ApiHelper.put(request, `/admin/agencies/${params.id}`, body);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return ApiHelper.delete(request, `/admin/agencies/${params.id}`);

}

