import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://complaint.runasp.net/api";

export async function GET(
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

    const response = await fetch(`${API_BASE_URL}/admin/agencies/${params.id}`, {
      method: "GET",
      headers: {
        "accept": "text/plain",
        "Authorization": authHeader,
      },
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
    console.error("Get Agency API Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "An error occurred",
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    if (!body.name) {
      return NextResponse.json(
        { success: false, message: "Name is required" },
        { status: 400 }
      );
    }

    const response = await fetch(`${API_BASE_URL}/admin/agencies/${params.id}`, {
      method: "PUT",
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
    console.error("Update Agency API Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "An error occurred",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    const response = await fetch(`${API_BASE_URL}/admin/agencies/${params.id}`, {
      method: "DELETE",
      headers: {
        "accept": "text/plain",
        "Authorization": authHeader,
      },
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
    console.error("Delete Agency API Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "An error occurred",
      },
      { status: 500 }
    );
  }
}

