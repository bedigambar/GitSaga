"use client";

import { useSession, signIn } from "@/lib/auth-client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Github, ShieldCheck, Zap } from "lucide-react";

export default function HeroCTA() {
    const { data: session, isPending } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (session && !isPending) {
            router.push("/dashboard");
        }
    }, [session, isPending, router]);

    return (
        <div className="flex flex-col items-center gap-6">
            <button
                onClick={() =>
                    signIn.social({ provider: "github", callbackURL: "/dashboard" })
                }
                className="group relative flex items-center gap-3 px-8 py-4 rounded-2xl bg-primary text-primary-foreground text-xl font-bold hover:bg-primary/90 transition-all duration-300 shadow-2xl shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-1"
            >
                <Github className="w-6 h-6" />
                Connect with GitHub
                <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground/40">
                <span className="flex items-center gap-1.5"><ShieldCheck className="w-3 h-3" /> Secure Access</span>
                <span className="w-1 h-1 rounded-full bg-muted-foreground/20" />
                <span className="flex items-center gap-1.5"><Zap className="w-3 h-3" /> Instant Generation</span>
            </div>
        </div>
    );
}
