import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const next = searchParams.get("next") || "/dashboard";

    const baseURL = process.env.BETTER_AUTH_URL || "http://localhost:3000";
    const params = new URLSearchParams({
        client_id: process.env.GITHUB_CLIENT_ID!,
        redirect_uri: `${baseURL}/api/auth/callback/github`,
        scope: "read:user repo",
        state: encodeURIComponent(next),
    });

    return NextResponse.redirect(
        `https://github.com/login/oauth/authorize?${params}`
    );
}
