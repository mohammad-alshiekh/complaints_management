import { NextRequest } from "next/server";
import { ApiHelper } from "@/lib/api-helper";

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;
    return ApiHelper.put(request, `/Complaint/release-ownership/${id}`, {});
}
