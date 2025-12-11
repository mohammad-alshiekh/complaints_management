import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://complaint.runasp.net/api";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization");
    const { searchParams } = new URL(request.url);
    const governmentEntityId = searchParams.get("governmentEntityId");
    
    if (!authHeader) {
      return NextResponse.json(
        { success: false, message: "Authorization header is required" },
        { status: 401 }
      );
    }

    if (!governmentEntityId) {
      return NextResponse.json(
        { success: false, message: "governmentEntityId is required" },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${API_BASE_URL}/admin/agency-users?governmentEntityId=${governmentEntityId}`,
      {
        method: "GET",
        headers: {
          "accept": "text/plain",
          "Authorization": authHeader,
        },
      }
    );

    const contentType = response.headers.get("content-type");
    const data = contentType?.includes("application/json")
      ? await response.json()
      : await response.text();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: typeof data === "string" ? data : data.message || "Request failed" },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("Get Agency Users API Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "An error occurred",
      },
      { status: 500 }
    );
  }
}

