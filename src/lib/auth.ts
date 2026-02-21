import { cookies } from "next/headers";
import { createHmac } from "crypto";

const SECRET = process.env.BETTER_AUTH_SECRET || "gitsaga-secret-key";

export interface GitHubSession {
    userId: string;
    name: string;
    email: string | null;
    image: string | null;
    login: string;
    githubToken: string;
    exp: number;
}

function sign(encoded: string): string {
    return createHmac("sha256", SECRET).update(encoded).digest("base64url");
}

export function createSessionCookie(session: Omit<GitHubSession, "exp">): string {
    const payload: GitHubSession = {
        ...session,
        exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
    };
    const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
    const sig = sign(encoded);
    return `${encoded}.${sig}`;
}

export function parseSessionCookie(value: string): GitHubSession | null {
    try {
        const dotIndex = value.lastIndexOf(".");
        if (dotIndex === -1) return null;
        const encoded = value.slice(0, dotIndex);
        const sig = value.slice(dotIndex + 1);
        if (sign(encoded) !== sig) return null;
        const payload = JSON.parse(Buffer.from(encoded, "base64url").toString()) as GitHubSession;
        if (payload.exp < Date.now()) return null;
        return payload;
    } catch {
        return null;
    }
}

export async function getSession(): Promise<GitHubSession | null> {
    const cookieStore = await cookies();
    const cookie = cookieStore.get("gitsaga_session");
    if (!cookie) return null;
    return parseSessionCookie(cookie.value);
}
