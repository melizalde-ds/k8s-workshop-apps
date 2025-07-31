import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const start = Date.now();
  while (Date.now() - start < 1000) {
    Math.random() * Math.random();
  }
  return NextResponse.json({
    message: "CPU work completed",
    duration: Date.now() - start,
  });
}
