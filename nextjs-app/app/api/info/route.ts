import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  return NextResponse.json({
    hostname: process.env.HOSTNAME || "localhost",
    version: process.env.APP_VERSION || "1.0.0",
    timestamp: new Date().toISOString(),
    nodeEnv: process.env.NODE_ENV as "development" | "production" | "test",
  });
}
