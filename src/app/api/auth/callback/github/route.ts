import { NextRequest, NextResponse } from "next/server";
import { createSessionCookie } from "@/lib/auth";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const next = state ? decodeURIComponent(state) : "/dashboard";
    const baseURL = process.env.BETTER_AUTH_URL || "http://localhost:3000";

    if (!code) {
        return NextResponse.redirect(new URL("/", req.url));
    }

    try {
        const tokenRes = await fetch(
            "https://github.com/login/oauth/access_token",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    client_id: process.env.GITHUB_CLIENT_ID,
                    client_secret: process.env.GITHUB_CLIENT_SECRET,
                    code,
                    redirect_uri: `${baseURL}/api/auth/callback/github`,
                }),
            }
        );

        const tokenData = await tokenRes.json();
        const accessToken = tokenData.access_token;

        if (!accessToken) {
            console.error("No access token returned:", tokenData);
            return NextResponse.redirect(new URL("/", req.url));
        }

        const userRes = await fetch("https://api.github.com/user", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: "application/vnd.github+json",
            },
        });
        const user = await userRes.json();

        const sessionValue = createSessionCookie({
            userId: String(user.id),
            name: user.name || user.login,
            email: user.email ?? null,
            image: user.avatar_url ?? null,
            login: user.login,
            githubToken: accessToken,
        });

        const cookieStore = await cookies();
        cookieStore.set("gitsaga_session", sessionValue, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 7 * 24 * 60 * 60, // 7 days
            path: "/",
            sameSite: "lax",
        });

        return NextResponse.redirect(new URL(next, req.url));
    } catch (err) {
        console.error("OAuth callback error:", err);
        return NextResponse.redirect(new URL("/", req.url));
    }
}
