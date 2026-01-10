import { NextRequest } from "next/server";
import { ApiHelper } from "@/lib/api-helper";

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;
    const body = await request.json().catch(() => ({}));
    return ApiHelper.post(request, `/Complaint/${id}/notes`, body);
}
