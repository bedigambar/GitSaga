import { getSession } from "@/lib/auth";
import { NextRequest } from "next/server";
import { groq } from "@ai-sdk/groq";
import { streamText } from "ai";

interface Commit {
    sha: string;
    message: string;
    author: string;
    date: string;
}

function buildPrompt(repoName: string, commits: Commit[]): string {
    const chronological = [...commits].reverse();
    const total = chronological.length;
    const act1End = Math.floor(total * 0.33);
    const act2End = Math.floor(total * 0.66);

    const formatCommits = (cs: Commit[]) =>
        cs.map((c) => `  - [${c.sha}] ${c.message} (by ${c.author}, ${new Date(c.date).toLocaleDateString()})`).join("\n");

    return `You are an epic fantasy narrator who turns git commit histories into dramatic, compelling stories.

The repository name is: "${repoName}"

Here are the commits, split into three acts:

== ACT I — The Origin (${act1End} commits) ==
${formatCommits(chronological.slice(0, act1End))}

== ACT II — The Journey (${act2End - act1End} commits) ==
${formatCommits(chronological.slice(act1End, act2End))}

== ACT III — The Present (${total - act2End} commits) ==
${formatCommits(chronological.slice(act2End))}

Write a dramatic, epic story narrating this repository's entire history. Rules:
1. Use exactly this structure with markdown headers: "# The Saga of [RepoName]", then "## Chapter 1: [Title]", "## Chapter 2: [Title]", etc. (4-6 chapters total)
2. Each chapter maps to a set of commits — treat each commit message as a real plot event
3. Use dramatic, epic fantasy prose. Treat bugs as monsters, features as quests, refactors as great transformations
4. Reference specific commit messages creatively (e.g. "fix typo" becomes "corrected the ancient texts")
5. Developer names are heroic characters
6. IMPORTANT: FREQUENTLY mention specific filenames, BUT ONLY IF they appear in the commit messages or are standard for the language (e.g. 'package.json', 'App.tsx'). 
   - DO NOT invent file paths that don't exist in the logs. 
   - If a commit doesn't mention a file, use generic terms like "the core archives" or "the styling scrolls".
7. End with an epilogue about what the codebase looks like today
8. Keep each chapter to 3-5 paragraphs
9. Make it genuinely fun and cinematic to read
10. Do not hallucinate code snippets or specific line numbers unless explicitly provided.

Begin the saga now:`;
}

export async function POST(req: NextRequest) {
    try {
        const session = await getSession();
        if (!session) {
            return new Response("Unauthorized", { status: 401 });
        }

        const { commits, repoName } = await req.json();
        if (!commits || !Array.isArray(commits) || commits.length === 0) {
            return new Response("No commits provided", { status: 400 });
        }

        const apiKey = process.env.GROQ_API_KEY;
        if (!apiKey) {
            return new Response("Missing GROQ_API_KEY in environment", { status: 500 });
        }

        const prompt = buildPrompt(repoName, commits);

        const result = streamText({
            model: groq("llama-3.3-70b-versatile"),
            prompt,
            temperature: 0.3,
        });

        const encoder = new TextEncoder();
        const readable = new ReadableStream({
            async start(controller) {
                try {
                    for await (const chunk of result.textStream) {
                        controller.enqueue(encoder.encode(chunk));
                    }
                } catch (err) {
                    controller.error(err);
                } finally {
                    controller.close();
                }
            },
        });

        return new Response(readable, {
            headers: {
                "Content-Type": "text/plain; charset=utf-8",
                "Cache-Control": "no-cache",
                "X-Content-Type-Options": "nosniff",
            },
        });
    } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        console.error("Story generation error:", msg);
        return new Response(`Story generation failed: ${msg}`, { status: 500 });
    }
}
