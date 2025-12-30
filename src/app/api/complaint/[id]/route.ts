import { NextRequest } from "next/server";
import { ApiHelper } from "@/lib/api-helper";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;
    return ApiHelper.get(request, `/Complaint/${id}`);
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;
    const body = await request.json().catch(() => ({}));
    return ApiHelper.put(request, `/Complaint/${id}`, body);
}
