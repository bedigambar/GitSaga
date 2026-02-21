"use client";

import { useSession } from "@/lib/auth-client";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StoryViewer from "@/components/StoryViewer";
import { ArrowLeft, ArrowRight, BookOpen, GitCommit, Loader2, Sparkles } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface Commit {
    sha: string;
    message: string;
    author: string;
    date: string;
}

interface RepoStats {
    name: string;
    description: string;
    language: string;
    stars: number;
    forks: number;
    size: number;
    ownerAvatar: string;
}

export default function StoryPage() {
    const { data: session, isPending } = useSession();
    const router = useRouter();
    const params = useParams();
    const owner = params.owner as string;
    const repo = params.repo as string;

    const [commits, setCommits] = useState<Commit[]>([]);
    const [repoStats, setRepoStats] = useState<RepoStats | null>(null);
    const [storyText, setStoryText] = useState("");
    const [isStreaming, setIsStreaming] = useState(false);
    const [loadingCommits, setLoadingCommits] = useState(true);
    const [storyStarted, setStoryStarted] = useState(false);

    useEffect(() => {
        if (!isPending && !session) {
            router.push("/");
        }
    }, [session, isPending, router]);

    const fetchRepoStats = useCallback(async () => {
        if (!owner || !repo) return;
        try {
            const res = await fetch(`/api/github/repo?owner=${owner}&repo=${repo}`);
            if (res.ok) {
                const data = await res.json();
                setRepoStats(data);
            }
        } catch (e) {
            console.error(e);
        }
    }, [owner, repo]);

    const fetchCommits = useCallback(async () => {
        if (!owner || !repo) return;
        setLoadingCommits(true);
        try {
            const res = await fetch(`/api/github/commits?owner=${owner}&repo=${repo}`);
            if (!res.ok) throw new Error("Failed to fetch commits");
            const data = await res.json();
            setCommits(data.commits);
        } catch {
            toast.error("Failed to load commits for this repo");
        } finally {
            setLoadingCommits(false);
        }
    }, [owner, repo]);

    useEffect(() => {
        if (session) {
            fetchRepoStats();
            fetchCommits();
        }
    }, [session, fetchRepoStats, fetchCommits]);

    const generateStory = useCallback(async () => {
        if (commits.length === 0) return;
        setStoryText("");
        setStoryStarted(true);
        setIsStreaming(true);

        try {
            const res = await fetch("/api/generate-story", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ commits, repoName: repo }),
            });

            if (!res.ok) {
                throw new Error("Story generation failed");
            }

            const reader = res.body?.getReader();
            if (!reader) throw new Error("No readable stream");

            const decoder = new TextDecoder();
            let done = false;

            while (!done) {
                const { value, done: doneReading } = await reader.read();
                done = doneReading;
                if (value) {
                    const chunk = decoder.decode(value, { stream: !doneReading });
                    setStoryText((prev) => prev + chunk);
                }
            }
        } catch {
            toast.error("Failed to generate story. Please try again.");
            setStoryStarted(false);
        } finally {
            setIsStreaming(false);
        }
    }, [commits, repo]);

    if (isPending) {
        return <div className="gitsaga-bg min-h-screen" />;
    }

    return (
        <div className="gitsaga-bg min-h-screen flex flex-col">
            <Navbar />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 flex-1 w-full">
                <div className="mb-8">
                    <Link
                        href="/dashboard"
                        className="group inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-primary/30 text-sm text-muted-foreground hover:text-foreground transition-all duration-300 mb-8 backdrop-blur-sm isolate hover:bg-white/10 shadow-lg shadow-black/20"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-primary/70 group-hover:text-primary" />
                        <span className="font-medium">Return to Library</span>
                    </Link>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-foreground">
                                <span className="text-muted-foreground font-normal">{owner} / </span>
                                {repo}
                            </h1>
                            {!loadingCommits && (
                                <p className="text-sm text-muted-foreground mt-0.5 flex items-center gap-1.5">
                                    <GitCommit className="w-3.5 h-3.5" />
                                    {commits.length} commits ready to become legend
                                </p>
                            )}
                        </div>

                        {!storyStarted && (
                            <button
                                onClick={generateStory}
                                disabled={loadingCommits || commits.length === 0}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:scale-[1.02] whitespace-nowrap"
                            >
                                <BookOpen className="w-4 h-4" />
                                {loadingCommits ? "Loading commits..." : "Generate Saga"}
                            </button>
                        )}
                    </div>
                </div>

                {!storyStarted ? (
                    <div className="group relative flex flex-col items-center justify-center py-32 text-center gap-6 border border-white/5 rounded-3xl bg-black/20 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02] mix-blend-overlay pointer-events-none" />
                        
                        <div className="relative z-10 w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center shadow-[0_0_30px_-10px_var(--primary)] group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                            <BookOpen className="w-8 h-8 text-primary drop-shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
                        </div>
                        
                        <div className="relative z-10 max-w-md px-4">
                            <h3 className="text-2xl font-bold text-foreground mb-2 tracking-tight">
                                Ready to forge your legend?
                            </h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {loadingCommits ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin text-primary" />
                                        Reviewing {commits.length > 0 ? commits.length : ''} historical records...
                                    </span>
                                ) : (
                                    <>
                                        This repository contains <span className="text-primary font-semibold">{commits.length} commits</span> waiting to be told. 
                                        Click <span className="text-foreground font-medium">Generate Saga</span> to begin.
                                    </>
                                )}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="rounded-2xl border border-border/40 bg-card/40 backdrop-blur-sm p-6 sm:p-10">
                        <StoryViewer
                            storyStream={storyText}
                            isStreaming={isStreaming}
                            repoName={repo}
                            repoStats={repoStats}
                            owner={owner}
                        />
                        {!isStreaming && storyText && (
                            <div className="mt-10 pt-6 border-t border-border/30 flex gap-3">
                                <button
                                    onClick={generateStory}
                                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary border border-white/10 hover:border-primary/30 hover:bg-primary/5 px-4 py-2 rounded-lg transition-all"
                                >
                                    <Sparkles className="w-4 h-4" />
                                    Re-generate Saga
                                </button>
                                <Link
                                    href="/dashboard"
                                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground border border-white/10 hover:bg-white/5 px-4 py-2 rounded-lg transition-all"
                                >
                                    Choose Another Repo
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}
