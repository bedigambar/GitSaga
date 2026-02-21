
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Code, Copy, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface CodeSnippetModalProps {
    isOpen: boolean;
    onClose: () => void;
    owner: string;
    repo: string;
    path: string;
}

export function CodeSnippetModal({ isOpen, onClose, owner, repo, path }: CodeSnippetModalProps) {
    const [content, setContent] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (isOpen && path) {
            const fetchContent = async () => {
                setLoading(true);
                setContent(null);
                try {
                    const res = await fetch(`/api/code-snippet?owner=${owner}&repo=${repo}&path=${path}`);
                    if (!res.ok) {
                        if (res.status === 404) {
                            setContent("File not found in the repository. It might have been deleted or moved.");
                        } else {
                            throw new Error("Failed to fetch code");
                        }
                        return;
                    }
                    const data = await res.json();
                    setContent(data.content);
                } catch {
                    toast.error("Could not load code snippet");
                    setContent("Error loading snippet.");
                } finally {
                    setLoading(false);
                }
            };
            fetchContent();
        } else {
            setContent(null);
        }
    }, [isOpen, path, owner, repo]);

    const handleCopy = () => {
        if (content) {
            navigator.clipboard.writeText(content);
            setCopied(true);
            toast.success("Code copied!");
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl h-[80vh] flex flex-col bg-[#0d1117] border-white/10 text-white">
                <DialogHeader className="border-b border-white/10 pb-4">
                    <DialogTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2 font-mono text-sm">
                            <Code className="w-4 h-4 text-primary" />
                            <span className="text-primary/80">{path}</span>
                        </div>
                        {!loading && content && (
                             <button
                                onClick={handleCopy}
                                className="p-2 rounded-md hover:bg-white/10 transition-colors"
                            >
                                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
                            </button>
                        )}
                    </DialogTitle>
                </DialogHeader>
                
                <div className="flex-1 overflow-hidden relative">
                    {loading ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        </div>
                    ) : (
                        <ScrollArea className="h-full w-full">
                            <pre className="p-4 text-sm font-mono leading-relaxed text-gray-300">
                                <code>{content}</code>
                            </pre>
                        </ScrollArea>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
