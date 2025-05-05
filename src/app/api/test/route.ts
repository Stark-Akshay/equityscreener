// app/api/test/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    message: "API routes are working",
    timestamp: new Date().toISOString(),
    route: "/api/test",
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json({
    message: "POST request received",
    body,
    timestamp: new Date().toISOString(),
    route: "/api/test",
  });
}
