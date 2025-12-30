import { NextRequest } from "next/server";
 import { ApiHelper } from "@/lib/api-helper";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
      return ApiHelper.put(request, `/admin/users/${params.id}/deactivate`);
}

