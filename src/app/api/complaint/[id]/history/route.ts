import { NextRequest } from "next/server";
import { ApiHelper } from "@/lib/api-helper";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;
    return ApiHelper.get(request, `/History/${id}`);
}
