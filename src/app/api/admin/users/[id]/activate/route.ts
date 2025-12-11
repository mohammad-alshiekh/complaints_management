import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://complaint.runasp.net/api";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get("Authorization");
    
    if (!authHeader) {
      return NextResponse.json(
        { success: false, message: "Authorization header is required" },
        { status: 401 }
      );
    }

    const response = await fetch(`${API_BASE_URL}/admin/users/${params.id}/activate`, {
      method: "PUT",
      headers: {
        "accept": "text/plain",
        "Authorization": authHeader,
      },
    });

    const contentType = response.headers.get("content-type");
    let data: any;
    
    if (contentType?.includes("application/json")) {
      data = await response.json();
    } else {
      const textData = await response.text();
      // If response is "true" or "false", convert to boolean
      if (textData === "true") {
        data = true;
      } else if (textData === "false") {
        data = false;
      } else {
        data = textData;
      }
    }

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: typeof data === "string" ? data : data.message || "Request failed" },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("Activate User API Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "An error occurred",
      },
      { status: 500 }
    );
  }
}

