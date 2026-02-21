import { NextResponse } from "next/server";

// All auth is handled by specific routes:
// /api/auth/github         - initiate OAuth
// /api/auth/callback/github - OAuth callback
// /api/auth/session        - get current session
// /api/auth/sign-out       - sign out
export async function GET() {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
}

export async function POST() {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
}
