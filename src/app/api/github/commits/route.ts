import { getSession } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const session = await getSession();

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const owner = searchParams.get("owner");
        const repo = searchParams.get("repo");

        if (!owner || !repo) {
            return NextResponse.json({ error: "owner and repo are required" }, { status: 400 });
        }

        const response = await fetch(
            `https://api.github.com/repos/${owner}/${repo}/commits?per_page=100`,
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

        const commits = await response.json();

        const mapped = commits.map((c: {
            sha: string;
            commit: {
                message: string;
                author: { name: string; date: string };
            };
        }) => ({
            sha: c.sha.slice(0, 7),
            message: c.commit.message.split("\n")[0],
            author: c.commit.author.name,
            date: c.commit.author.date,
        }));

        return NextResponse.json({ commits: mapped });
    } catch (error) {
        console.error("Error fetching commits:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
