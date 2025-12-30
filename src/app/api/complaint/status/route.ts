import { NextRequest } from "next/server";
import { ApiHelper } from "@/lib/api-helper";

export async function PUT(request: NextRequest) {
    // Forward the PUT to external API /Complaint/status using ApiHelper
    try {
        const body = await request.json().catch(() => null);
        return await ApiHelper.put(request, "/Complaint/status", body, {
            requiresAuth: true,
            contentType: "application/json",
        });
    } catch (err: any) {
        console.error("/api/complaint/status proxy error:", err);
        return new Response(JSON.stringify({ success: false, message: err?.message ?? "Proxy error" }), { status: 500, headers: { "Content-Type": "application/json" } });
    }
}
