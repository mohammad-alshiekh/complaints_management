import { NextResponse } from "next/server";

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://complaint.runasp.net/api";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");

  try {
    const response = await fetch(`${apiBaseUrl}/Complaint`, {
      headers: {
        accept: "application/json",
        ...(authHeader ? { authorization: authHeader } : {}),
      },
    });

    // Try to parse JSON, even on error responses
    const payload = await response
      .json()
      .catch(() => ({ message: "Invalid JSON from upstream" }));

    if (!response.ok) {
      const message =
        (payload && typeof payload === "object" && "message" in payload
          ? (payload as any).message
          : "Upstream request failed") ?? response.statusText;

      return NextResponse.json(
        {
          message,
          status: response.status,
        },
        { status: response.status }
      );
    }

    return NextResponse.json(payload, { status: 200 });
  } catch (error: any) {
    console.error("Proxy /api/complaints failed", error);
    return NextResponse.json(
      {
        message:
          "Unable to connect to the server at complaints API. This could be due to CORS, server downtime, or network issues.",
      },
      { status: 502 }
    );
  }
}

