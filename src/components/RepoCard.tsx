"use client";

import { Star, GitFork, Lock, Globe, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "@/lib/utils";

interface RepoCardProps {
    name: string;
    full_name: string;
    description: string | null;
    language: string | null;
    stars: number;
    forks: number;
    pushed_at: string;
    private: boolean;
}

const languageColors: Record<string, string> = {
    TypeScript: "#3178c6",
    JavaScript: "#f1e05a",
    Python: "#3572A5",
    Rust: "#dea584",
    Go: "#00ADD8",
    Java: "#b07219",
    "C++": "#f34b7d",
    C: "#555555",
    CSS: "#563d7c",
    HTML: "#e34c26",
    Ruby: "#701516",
    Swift: "#ffac45",
    Kotlin: "#A97BFF",
    PHP: "#4F5D95",
    Shell: "#89e051",
};

export default function RepoCard({
    name,
    full_name,
    description,
    language,
    stars,
    forks,
    pushed_at,
    private: isPrivate,
}: RepoCardProps) {
    const router = useRouter();
    const [owner, repo] = full_name.split("/");
    const langColor = language ? (languageColors[language] ?? "#8b949e") : null;

    return (
        <button
            onClick={() => router.push(`/story/${owner}/${repo}`)}
            className="group relative w-full text-left p-6 rounded-2xl border border-white/5 bg-card/30 hover:bg-card/50 backdrop-blur-sm transition-all duration-300 cursor-pointer overflow-hidden hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Header */}
            <div className="relative flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3 min-w-0">
                    <div className={`p-2 rounded-lg ${isPrivate ? "bg-amber-500/10 text-amber-500" : "bg-primary/10 text-primary"}`}>
                        {isPrivate ? (
                            <Lock className="w-4 h-4 shrink-0" />
                        ) : (
                            <Globe className="w-4 h-4 shrink-0" />
                        )}
                    </div>
                    <div className="min-w-0">
                        <h3 className="font-bold text-lg text-foreground truncate group-hover:text-primary transition-colors">
                            {name}
                        </h3>
                    </div>
                </div>
                <div className="p-2 rounded-full hover:bg-white/5 text-muted-foreground group-hover:text-primary transition-colors">
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
            </div>

            {/* Description */}
            <p className="relative text-sm text-muted-foreground/80 mb-6 line-clamp-2 min-h-[2.5rem] leading-relaxed">
                {description || <span className="italic opacity-50">No description provided for this repository.</span>}
            </p>

            {/* Footer */}
            <div className="relative flex items-center gap-4 text-xs font-medium text-muted-foreground">
                {language && (
                    <span className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-white/5 border border-white/5">
                        <span
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ 
                                backgroundColor: langColor ?? "#8b949e",
                                boxShadow: `0 0 8px ${langColor ?? "#8b949e"}`
                            }}
                        />
                        {language}
                    </span>
                )}
                {stars > 0 && (
                    <span className="flex items-center gap-1.5 hover:text-yellow-400 transition-colors">
                        <Star className="w-3.5 h-3.5 text-yellow-500/80" />
                        {stars.toLocaleString()}
                    </span>
                )}
                {forks > 0 && (
                    <span className="flex items-center gap-1.5 hover:text-blue-400 transition-colors">
                        <GitFork className="w-3.5 h-3.5 text-blue-500/80" />
                        {forks}
                    </span>
                )}
                <span className="ml-auto text-xs opacity-60">
                    Updated {formatDistanceToNow(pushed_at)}
                </span>
            </div>
        </button>
    );

}
