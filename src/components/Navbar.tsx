"use client";

import { useSession, signIn, signOut } from "@/lib/auth-client";
import { GitBranch, LogOut, LogIn, BookOpen, ExternalLink } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { data: session, isPending } = useSession();
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/60 backdrop-blur-xl supports-[backdrop-filter]:bg-background/20 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        <Link
          href={session ? "/dashboard" : "/"}
          className="flex items-center gap-2 sm:gap-3 text-lg sm:text-xl font-bold group shrink-0"
        >
          <div className="relative p-1.5 sm:p-2 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 group-hover:scale-105 group-hover:shadow-[0_0_20px_-5px_var(--primary)] transition-all duration-300">
            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
          </div>
          <span className="text-foreground tracking-tight">
            Git<span className="text-primary italic">Saga</span>
          </span>
        </Link>


        {isPending ? (
          <div className="h-9 w-32 rounded-lg bg-muted animate-pulse" />
        ) : session ? (
          <div className="flex items-center gap-2 sm:gap-3">
            {pathname !== "/dashboard" ? (
              <>
                <Link
                  href="/dashboard"
                  className="group flex items-center justify-center sm:justify-start gap-0 sm:gap-2 w-9 h-9 sm:w-auto sm:h-auto sm:px-3 sm:py-2 rounded-lg border border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 hover:border-primary/40 transition-all duration-300 shadow-[0_0_10px_-5px_transparent] hover:shadow-[0_0_15px_-5px_rgba(var(--primary),0.3)]"
                  title="My Repos"
                >
                  <GitBranch className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                  <span className="hidden sm:inline font-medium">My Repos</span>
                </Link>
                <a
                  href={`https://github.com/${session.user.login}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-center sm:justify-start gap-0 sm:gap-2 w-9 h-9 sm:w-auto sm:h-auto sm:px-3 sm:py-2 rounded-lg border border-white/20 bg-white/5 text-white/80 hover:bg-white/10 hover:border-white/40 hover:text-white transition-all duration-300"
                  title="My GitHub"
                >
                  <ExternalLink className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span className="hidden sm:inline font-medium">My GitHub</span>
                </a>
              </>
            ) : (
               <a
                href={`https://github.com/${session.user.login}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center sm:justify-start gap-0 sm:gap-2 w-9 h-9 sm:w-auto sm:h-auto sm:px-3 sm:py-2 rounded-lg border border-white/20 bg-white/5 text-white/80 hover:bg-white/10 hover:border-white/40 hover:text-white transition-all duration-300"
                title="My GitHub"
              >
                <ExternalLink className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span className="hidden sm:inline font-medium">My GitHub</span>
              </a>
            )}
            <div className="h-4 w-px bg-border mx-1 sm:mx-0" />
            <div className="flex items-center gap-2.5">
              {session.user.image && (
                <Image
                  src={session.user.image}
                  alt={session.user.name || ""}
                  width={32}
                  height={32}
                  className="rounded-full border border-border/60 w-8 h-8 sm:w-9 sm:h-9"
                />
              )}
              <span className="hidden md:block text-sm font-medium text-foreground">
                {session.user.name}
              </span>
            </div>
            <button
              onClick={() => signOut({ fetchOptions: { onSuccess: () => { window.location.href = "/"; } } })}
              className="group flex items-center justify-center sm:justify-start gap-0 sm:gap-2 w-9 h-9 sm:w-auto sm:h-auto sm:px-3 sm:py-2 rounded-lg border border-red-500/20 bg-red-500/5 text-red-400 hover:bg-red-500/10 hover:border-red-500/40 hover:text-red-300 transition-all duration-300 ml-1 sm:ml-2 shadow-[0_0_10px_-5px_transparent] hover:shadow-[0_0_15px_-5px_rgba(239,68,68,0.3)]"
              title="Sign out"
            >
              <LogOut className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              <span className="hidden sm:inline text-xs font-bold uppercase tracking-wide">Log Out</span>
            </button>
          </div>
        ) : (
          <button
            onClick={() => signIn.social({ provider: "github", callbackURL: "/dashboard" })}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <LogIn className="w-4 h-4" />
            Sign in with GitHub
          </button>
        )}
      </div>
    </nav>
  );
}
