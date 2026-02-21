"use client";

import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RepoCard from "@/components/RepoCard";
import { Search, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface Repo {
    name: string;
    full_name: string;
    description: string | null;
    language: string | null;
    stars: number;
    forks: number;
    pushed_at: string;
    html_url: string;
    private: boolean;
}

export default function DashboardPage() {
    const { data: session, isPending } = useSession();
    const router = useRouter();
    const [repos, setRepos] = useState<Repo[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        if (!isPending && !session) {
            router.push("/");
        }
    }, [session, isPending, router]);

    const fetchRepos = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/github/repos");
            if (!res.ok) throw new Error("Failed to fetch repos");
            const data = await res.json();
            setRepos(data.repos);
        } catch {
            toast.error("Failed to load repositories");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (session) fetchRepos();
    }, [session, fetchRepos]);

    const filtered = repos.filter(
        (r) =>
            r.name.toLowerCase().includes(search.toLowerCase()) ||
            (r.description?.toLowerCase() ?? "").includes(search.toLowerCase())
    );

    if (isPending || (!session && isPending)) {
        return <div className="gitsaga-bg min-h-screen" />;
    }

    return (
        <div className="gitsaga-bg min-h-screen">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
                
                <div className="relative mb-12 p-8 rounded-3xl bg-gradient-to-r from-primary/10 via-transparent to-transparent border border-white/5 overflow-hidden">
                    <div className="absolute top-0 right-0 p-12 opacity-10">
                         <div className="w-64 h-64 bg-primary rounded-full blur-[100px]" />
                    </div>
                    
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                        Choose Your <span className="text-primary italic">Saga</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl">
                        Select a repository from your GitHub history to weave it into a legendary narrative.
                    </p>
                </div>

                <div className="flex flex-row items-center gap-2 sm:gap-4 mb-10">
                    <div className="relative flex-1 group">
                        <div className="absolute inset-0 bg-primary/20 rounded-xl blur-md opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="Find a repository..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="relative w-full pl-11 sm:pl-12 pr-4 py-3 sm:py-4 text-sm sm:text-base rounded-xl border border-white/10 bg-black/40 backdrop-blur-xl text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all shadow-lg"
                        />
                    </div>
                    <button
                        onClick={fetchRepos}
                        disabled={loading}
                        className="p-3 sm:p-4 rounded-xl border border-white/10 bg-card/40 hover:bg-card/60 hover:text-primary transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 shrink-0"
                        title="Refresh Repository List"
                    >
                        <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
                    </button>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Array.from({ length: 9 }).map((_, i) => (
                            <div
                                key={i}
                                className="h-36 rounded-xl bg-card/50 border border-border/30 animate-pulse"
                            />
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-20 text-muted-foreground">
                        <p className="text-lg font-medium">No repos found</p>
                        <p className="text-sm mt-1 opacity-60">
                            {search ? "Try a different search term" : "Connect more repos on GitHub"}
                        </p>
                    </div>
                ) : (
                    <>
                        <p className="text-xs text-muted-foreground/60 mb-4">
                            {filtered.length} {filtered.length === 1 ? "repository" : "repositories"}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filtered.map((repo) => (
                                <RepoCard key={repo.full_name} {...repo} />
                            ))}
                        </div>
                    </>
                )}
            </div>
            <Footer />
        </div>
    );
}
