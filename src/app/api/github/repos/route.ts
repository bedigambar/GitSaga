import { getSession } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const session = await getSession();

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const perPage = searchParams.get("per_page") || "50";
        const page = searchParams.get("page") || "1";

        const response = await fetch(
            `https://api.github.com/user/repos?sort=pushed&direction=desc&per_page=${perPage}&page=${page}&affiliation=owner,collaborator`,
            {
                headers: {
                    Authorization: `Bearer ${session.githubToken}`,
                    Accept: "application/vnd.github+json",
                    "X-GitHub-Api-Version": "2022-11-28",
                },
            }
        );

        if (!response.ok) {
            const err = await response.text();
            return NextResponse.json({ error: err }, { status: response.status });
        }

        const repos = await response.json();

        const mapped = repos.map((r: {
            name: string;
            full_name: string;
            description: string | null;
            language: string | null;
            stargazers_count: number;
            forks_count: number;
            pushed_at: string;
            html_url: string;
            private: boolean;
        }) => ({
            name: r.name,
            full_name: r.full_name,
            description: r.description,
            language: r.language,
            stars: r.stargazers_count,
            forks: r.forks_count,
            pushed_at: r.pushed_at,
            html_url: r.html_url,
            private: r.private,
        }));

        return NextResponse.json({ repos: mapped });
    } catch (error) {
        console.error("Error fetching repos:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
