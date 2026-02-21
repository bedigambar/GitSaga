import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const owner = searchParams.get("owner");
    const repo = searchParams.get("repo");

    if (!owner || !repo) {
        return NextResponse.json({ error: "Missing owner or repo" }, { status: 400 });
    }

    try {
        const session = await getSession();

        if (!session?.githubToken) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
            headers: {
                Authorization: `Bearer ${session.githubToken}`,
                Accept: "application/vnd.github+json",
                "X-GitHub-Api-Version": "2022-11-28",
            },
        });

        if (!response.ok) {
            return NextResponse.json({ error: "Failed to fetch repo" }, { status: response.status });
        }

        const data = await response.json();
        
        const rpgData = {
            name: data.name,
            full_name: data.full_name,
            description: data.description,
            language: data.language,
            stars: data.stargazers_count,
            forks: data.forks_count,
            size: data.size,
            ownerAvatar: data.owner.avatar_url,
            default_branch: data.default_branch,
        };

        return NextResponse.json(rpgData);
    } catch (error) {
        console.error("Repo fetch error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
