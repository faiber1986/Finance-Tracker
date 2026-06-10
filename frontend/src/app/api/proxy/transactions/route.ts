import { type NextRequest, NextResponse } from "next/server";
import { apiFetch } from "@/lib/api-client";
import type { TransactionListResponse } from "@/features/transactions/types/transaction.types";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams.toString();
  try {
    const data = await apiFetch<TransactionListResponse>(
      `/api/v1/transactions${params ? `?${params}` : ""}`
    );
    return NextResponse.json(data);
  } catch (e) {
    const msg = String(e);
    if (msg.includes("UNAUTHORIZED")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
