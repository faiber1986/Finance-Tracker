import { NextResponse } from "next/server";

export async function GET() {
  const api = process.env.API_URL_INTERNAL ?? "(not set — defaults to http://localhost:8000)";

  let backendReachable = false;
  let backendError = "";
  try {
    const res = await fetch(
      `${process.env.API_URL_INTERNAL ?? "http://localhost:8000"}/health`,
      { cache: "no-store", signal: AbortSignal.timeout(5000) }
    );
    backendReachable = res.ok;
    if (!res.ok) backendError = `HTTP ${res.status}`;
  } catch (e) {
    backendError = String(e);
  }

  return NextResponse.json({
    API_URL_INTERNAL: api,
    backendReachable,
    backendError: backendError || null,
    nodeEnv: process.env.NODE_ENV,
  });
}
