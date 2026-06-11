import { NextRequest, NextResponse } from "next/server";

const API = process.env.API_URL_INTERNAL ?? "http://localhost:8000";

export async function POST(req: NextRequest) {
  const body = await req.json();

  let res: Response;
  try {
    res = await fetch(`${API}/api/v1/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    console.error("[register] Cannot reach backend at:", API);
    return NextResponse.json(
      { error: "Cannot connect to the server. Please try again later." },
      { status: 503 }
    );
  }

  let data: unknown;
  try {
    data = await res.json();
  } catch {
    data = {};
  }

  if (!res.ok) {
    const detail = (data as { detail?: string })?.detail ?? "Registration failed";
    return NextResponse.json({ error: detail }, { status: res.status });
  }

  return NextResponse.json(data, { status: 201 });
}
