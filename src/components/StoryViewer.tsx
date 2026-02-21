"use client";

import { useEffect, useRef, useState } from "react";
import { BookOpen, Copy, Check, Loader2, Download, Volume2, Pause, Play, Eye } from "lucide-react";
import { toast } from "sonner";
import { RpgCharacterCard } from "@/components/RpgCharacterCard";
import { CodeSnippetModal } from "@/components/CodeSnippetModal";

interface RepoStats {
    name: string;
    description: string;
    language: string;
    stars: number;
    forks: number;
    size: number;
    ownerAvatar: string;
}

interface StoryViewerProps {
    storyStream: string;
    isStreaming: boolean;
    repoName: string;
    repoStats?: RepoStats | null;
    owner: string;
}

function parseChapters(text: string) {
    if (!text) return [];
    const lines = text.split("\n");
    const chunks: { type: "h1" | "h2" | "p" | "empty"; content: string }[] = [];

    for (const line of lines) {
        if (line.startsWith("# ")) {
            chunks.push({ type: "h1", content: line.slice(2) });
        } else if (line.startsWith("## ")) {
            chunks.push({ type: "h2", content: line.slice(3) });
        } else if (line.trim() === "") {
            chunks.push({ type: "empty", content: "" });
        } else {
            chunks.push({ type: "p", content: line });
        }
    }
    return chunks;
}

export default function StoryViewer({ storyStream, isStreaming, repoName, repoStats, owner }: StoryViewerProps) {
    const [copied, setCopied] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    
    const [snippetPath, setSnippetPath] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const bottomRef = useRef<HTMLDivElement>(null);
    const synthRef = useRef<SpeechSynthesis | null>(null);
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
    const voicesRef = useRef<SpeechSynthesisVoice[]>([]);
    
    const chunks = parseChapters(storyStream);

    useEffect(() => {
        if (typeof window !== "undefined") {
            synthRef.current = window.speechSynthesis;

            const loadVoices = () => {
                voicesRef.current = synthRef.current?.getVoices() ?? [];
            };

            loadVoices();
            speechSynthesis.addEventListener("voiceschanged", loadVoices);

            return () => {
                speechSynthesis.removeEventListener("voiceschanged", loadVoices);
                synthRef.current?.cancel();
            };
        }
    }, []);

    const renderText = (text: string) => {
        const regex = /(`)?(\b(?:src|app|components|lib|public|test|tests|pages|api)[\w\-\/]*\.\w+\b|\b[\w\-\/]+\.(?:tsx|ts|jsx|js|py|rs|go|java|c|cpp|h|css|html|json|md|yml|yaml)\b)(`)?/g;
        
        const parts = [];
        let lastIndex = 0;
        let match;

        regex.lastIndex = 0;

        while ((match = regex.exec(text)) !== null) {
            if (match.index > lastIndex) {
                parts.push(text.slice(lastIndex, match.index));
            }

            const filePath = match[2];
            
            parts.push(
                <button
                    key={`${match.index}-${lastIndex}`}
                    onClick={() => {
                            setSnippetPath(filePath);
                            setIsModalOpen(true);
                    }}
                    className="inline-flex items-center gap-1 mx-1 px-1.5 py-0.5 rounded text-xs font-mono bg-primary/10 text-primary hover:bg-primary/20 hover:scale-105 transition-all border border-primary/20 align-middle"
                >
                    <Eye className="w-3 h-3" />
                    {filePath}
                </button>
            );

            lastIndex = regex.lastIndex;
        }

        if (lastIndex < text.length) {
            parts.push(text.slice(lastIndex));
        }

        return parts;
    };

    useEffect(() => {
        if (isStreaming) {
            bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [storyStream, isStreaming]);

    const handleCopy = () => {
        navigator.clipboard.writeText(storyStream);
        setCopied(true);
        toast.success("Story copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        const blob = new Blob([storyStream], { type: "text/markdown" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${repoName.replace("/", "-")}-saga.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success("Saga exported to Markdown!");
    };

    const handleSpeak = () => {
        if (!synthRef.current) return;

        if (isSpeaking) {
            if (isPaused) {
                synthRef.current.resume();
                setIsPaused(false);
            } else {
                synthRef.current.pause();
                setIsPaused(true);
            }
            return;
        }

        synthRef.current.cancel();

        const textToRead = storyStream.replace(/[#*`]/g, "");

        const sentenceChunks = textToRead.match(/[^.!?]+[.!?]+[\s]*/g) || [textToRead];
        const speakChunks: string[] = [];
        let current = "";

        for (const sentence of sentenceChunks) {
            if ((current + sentence).length > 200) {
                if (current) speakChunks.push(current.trim());
                current = sentence;
            } else {
                current += sentence;
            }
        }
        if (current.trim()) speakChunks.push(current.trim());

        const voices = voicesRef.current;
        const preferredVoice = voices.find((v) =>
            v.name.includes("Google UK English Male") || v.name.includes("Male")
        ) || voices.find((v) => v.lang.startsWith("en")) || null;

        let index = 0;

        const speakNext = () => {
            if (index >= speakChunks.length) {
                setIsSpeaking(false);
                setIsPaused(false);
                return;
            }

            const utterance = new SpeechSynthesisUtterance(speakChunks[index]);
            utteranceRef.current = utterance;

            if (preferredVoice) utterance.voice = preferredVoice;
            utterance.pitch = 0.9;
            utterance.rate = 1;

            utterance.onend = () => {
                index++;
                speakNext();
            };

            utterance.onerror = () => {
                setIsSpeaking(false);
                setIsPaused(false);
            };

            synthRef.current?.speak(utterance);
        };

        setIsSpeaking(true);
        setIsPaused(false);
        speakNext();
    };

    if (!storyStream && isStreaming) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] gap-12 animate-fade-in relative overflow-hidden">
                {/* Book Loader */}
                <div className="relative group">
                    <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-50 animate-pulse" />
                    <BookOpen className="w-20 h-20 opacity-30 relative z-10 group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute -bottom-2 -right-2 p-2 bg-background rounded-full border border-primary/30 z-20 shadow-lg shadow-primary/20">
                         <Loader2 className="w-7 h-7 animate-spin text-primary" />
                    </div>
                </div>

                {/* Animated Terminal Status */}
                <div className="mt-8 relative w-full max-w-sm rounded-lg bg-black/60 border border-white/10 p-5 font-mono text-xs overflow-hidden shadow-2xl backdrop-blur-sm">
                    {/* Top Bar */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-primary/50 to-primary opacity-50" />
                    
                    {/* Content */}
                    <div className="space-y-1.5">
                        <div className="flex gap-2 text-primary/80">
                            <span className="text-muted-foreground/50">{">"}</span>
                            <span className="overflow-hidden whitespace-nowrap border-r border-primary w-fit pr-1 animate-pulse">
                                Initializing saga protocol...
                            </span>
                        </div>
                        <div className="flex gap-2 text-green-400/80 opacity-0 animate-[fade-in_0.5s_ease-out_forwards]" style={{animationDelay: '1s'}}>
                            <span className="text-muted-foreground/50">{">"}</span>
                            <span>Parsing commit history...</span>
                        </div>
                        <div className="flex gap-2 text-blue-400/80 opacity-0 animate-[fade-in_0.5s_ease-out_forwards]" style={{animationDelay: '2s'}}>
                            <span className="text-muted-foreground/50">{">"}</span>
                            <span>Weaving narrative threads...</span>
                        </div>
                        <div className="flex gap-2 text-amber-400/80 opacity-0 animate-[fade-in_0.5s_ease-out_forwards]" style={{animationDelay: '3s'}}>
                            <span className="text-muted-foreground/50">{">"}</span>
                            <span>Summoning the chronicler...</span>
                        </div>
                    </div>
                    
                    {/* Scanline effect */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent animate-scan pointer-events-none" style={{backgroundSize: '100% 3px'}} />
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto relative">
            {/* Floating Stats / Controls */}
            {storyStream && !isStreaming && (
                <div className="sticky top-24 z-10 flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 p-4 rounded-2xl glass-card backdrop-blur-xl border border-primary/20 bg-black/40 shadow-2xl animate-fade-in">
                    <div className="flex items-center gap-3 w-full sm:w-auto justify-center sm:justify-start">
                         <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                            <BookOpen className="w-5 h-5 text-primary" />
                         </div>
                         <span className="text-sm text-foreground/80 font-medium truncate max-w-[200px] sm:max-w-xs">
                            Saga of <span className="text-primary">{repoName}</span>
                         </span>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-end">
                        {/* TTS Button */}
                        <button
                            onClick={handleSpeak}
                            title={isSpeaking && !isPaused ? "Pause Bard" : "Narrate with Bard"}
                            className="p-2 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 transition-all hover:scale-105 active:scale-95"
                        >
                            {isSpeaking ? (
                                isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />
                            ) : (
                                <Volume2 className="w-5 h-5" />
                            )}
                        </button>

                        {/* Export Button */}
                        <button
                            onClick={handleDownload}
                            title="Export Saga as Markdown"
                            className="p-2 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 transition-all hover:scale-105 active:scale-95"
                        >
                            <Download className="w-5 h-5" />
                        </button>

                        {/* Copy Button */}
                        <button
                            onClick={handleCopy}
                            title="Copy to Clipboard"
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 transition-all hover:scale-105 active:scale-95"
                        >
                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            <span className="text-sm font-semibold">{copied ? "Copied!" : "Copy"}</span>
                        </button>
                    </div>
                </div>
            )}
            <div className="relative min-h-[50vh] p-4 sm:p-8 md:p-12 rounded-lg bg-[#0d1117]/80 border border-white/5 shadow-2xl backdrop-blur-md">
                
                {/* RPG Card Insert */}
                {repoStats && storyStream && !isStreaming && (
                    <div className="mb-12 sm:mb-16 flex justify-center animate-fade-in w-full">
                         <RpgCharacterCard 
                            repoName={repoName} 
                            language={repoStats.language}
                            stars={repoStats.stars}
                            forks={repoStats.forks}
                            size={repoStats.size}
                            ownerAvatar={repoStats.ownerAvatar}
                            className="w-full max-w-md transform hover:scale-[1.02] transition-transform duration-500 mx-auto"
                         />
                    </div>
                )}

                {/* Content */}
                <div className="prose prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-p:text-lg prose-p:leading-relaxed prose-p:text-muted-foreground/90">
                    {chunks.map((chunk, i) => {
                        if (chunk.type === "h1") {
                            return (
                                <div key={i} className="mb-12 text-center group">
                                    <div className="inline-block p-1 mb-4 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs font-bold uppercase tracking-widest px-4 py-1">
                                        Chapter
                                    </div>
                                    <h1
                                        className="text-4xl sm:text-5xl md:text-6xl text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 drop-shadow-sm mb-6"
                                        style={{ animation: `fade-in 0.5s ease-out forwards ${i * 0.1}s`, opacity: 0 }}
                                    >
                                        {chunk.content}
                                    </h1>
                                    <div className="h-px w-24 mx-auto bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                                </div>
                            );
                        }
                        if (chunk.type === "h2") {
                            return (
                                <h2
                                    key={i}
                                    className="text-2xl font-bold text-foreground mt-12 mb-6 flex items-center gap-3 border-l-4 border-primary pl-4"
                                    style={{ animation: `fade-in 0.5s ease-out forwards ${i * 0.05}s`, opacity: 0 }}
                                >
                                    {chunk.content}
                                </h2>
                            );
                        }
                        if (chunk.type === "empty") {
                            return <div key={i} className="h-4" />;
                        }
                        // Paragraphs
                        return (
                            <p
                                key={i}
                                className="mb-6 opacity-0 animate-fade-in"
                                style={{ animationDelay: `${i * 30}ms`, animationFillMode: 'forwards' }}
                            >
                                {renderText(chunk.content)}
                            </p>
                        );
                    })}
                    
                    {/* Streaming Indicator */}
                    {isStreaming && (
                        <div className="flex items-center gap-2 text-primary/60 mt-4 animate-pulse">
                            <span className="w-2 h-2 rounded-full bg-primary" />
                            <span className="w-2 h-2 rounded-full bg-primary delay-75" />
                            <span className="w-2 h-2 rounded-full bg-primary delay-150" />
                        </div>
                    )}
                </div>
            </div>
            
            <div ref={bottomRef} className="h-24" />

            {/* Code Snippet Modal */}
            <CodeSnippetModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                owner={owner}
                repo={repoName}
                path={snippetPath || ""}
            />
        </div>
    );
}
