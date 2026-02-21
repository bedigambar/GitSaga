import Link from "next/link";
import type { Metadata } from "next";
import { BookOpen, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
    title: "Page Not Found",
    description: "The page you are looking for does not exist.",
};

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center bg-background">
            {/* Decorative glow */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 flex flex-col items-center">
                {/* Icon */}
                <div className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-8 shadow-[0_0_30px_-5px_rgba(var(--primary),0.3)]">
                    <BookOpen className="w-10 h-10 text-primary" />
                </div>

                {/* 404 */}
                <h1 className="text-8xl sm:text-9xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-white via-white to-primary/50 mb-4">
                    404
                </h1>

                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
                    Chapter Not Found
                </h2>

                <p className="text-muted-foreground/60 text-lg max-w-md mb-10 leading-relaxed">
                    This page has been lost to the annals of history. The saga you seek lies elsewhere.
                </p>

                <Link
                    href="/"
                    className="group flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all duration-300 shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Return to the Saga
                </Link>
            </div>
        </div>
    );
}
