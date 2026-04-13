import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(_request: Request) {
  return NextResponse.json(
    { error: "Voice transcription is not available." },
    { status: 501 },
  );
}
