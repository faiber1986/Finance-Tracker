import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const API = process.env.API_URL_INTERNAL ?? "http://localhost:8000";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const res = await fetch(`${API}/api/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ username: body.email, password: body.password }),
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  // Extract the token value from Set-Cookie header and re-set it via Next.js
  const setCookieHeader = res.headers.get("set-cookie");
  if (setCookieHeader) {
    const match = setCookieHeader.match(/access_token=([^;]+)/);
    if (match) {
      cookies().set("access_token", match[1], {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 86400,
        path: "/",
      });
    }
  }

  return NextResponse.json({ message: "Login successful" });
}
