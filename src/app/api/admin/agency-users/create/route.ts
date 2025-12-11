import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://complaint.runasp.net/api";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const authHeader = request.headers.get("Authorization");
    
    if (!authHeader) {
      return NextResponse.json(
        { success: false, message: "Authorization header is required" },
        { status: 401 }
      );
    }

    // Validate request body
    if (!body.fullName || !body.email || !body.password || !body.governmentEntityId) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    const response = await fetch(`${API_BASE_URL}/admin/agency-users/create`, {
      method: "POST",
      headers: {
        "accept": "text/plain",
        "Authorization": authHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

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
    console.error("Create Agency User API Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "An error occurred",
      },
      { status: 500 }
    );
  }
}

