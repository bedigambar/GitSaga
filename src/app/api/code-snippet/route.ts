import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const owner = searchParams.get("owner");
    const repo = searchParams.get("repo");
    const path = searchParams.get("path");

    if (!owner || !repo || !path) {
        return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    try {
        const session = await getSession();
        if (!session?.githubToken) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
            headers: {
                Authorization: `Bearer ${session.githubToken}`,
                Accept: "application/vnd.github+json",
                "X-GitHub-Api-Version": "2022-11-28",
            },
        });

        if (!res.ok) {
            return NextResponse.json({ error: "File not found" }, { status: 404 });
        }

        const data = await res.json();
        
        if (Array.isArray(data)) {
            return NextResponse.json({ error: "Is a directory" }, { status: 400 });
        }

        const contentRes = await fetch(data.download_url);
        const code = await contentRes.text();

        return NextResponse.json({ content: code, name: data.name, language: data.name.split('.').pop() });
    } catch (error) {
        console.error("Code fetch error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
