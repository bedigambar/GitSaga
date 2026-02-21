import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroCTA from "@/components/HeroCTA";
import { BookOpen, GitCommit, Sparkles, Wand2 } from "lucide-react";
import { InteractiveBackground } from "@/components/InteractiveBackground";

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "GitSaga",
    url: "https://git-saga.vercel.app",
    description:
        "Turn your GitHub commit history into an epic AI-narrated story. Every commit is a chapter. Every repo is a saga.",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web",
    offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
    },
};

export default function LandingPage() {
    return (
        <InteractiveBackground>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <div className="min-h-screen flex flex-col">
                <Navbar />

                {/* Hero */}
                <main className="flex-1 flex flex-col items-center justify-center px-4 text-center py-20">
                    {/* Badge */}
                    <div className="mt-12 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-sm font-medium text-primary mb-10 animate-fade-in glass">
                        <Sparkles className="w-4 h-4" />
                        <span>The Loom of Legend Awaits</span>
                    </div>

                    {/* Title with Gradient */}
                    <div className="relative">
                        <div className="absolute -inset-4 bg-primary/20 blur-3xl opacity-20 rounded-full" />
                        <h1 className="relative text-7xl sm:text-8xl md:text-9xl font-extrabold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-br from-white via-white to-primary/50 leading-none drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                            Git<span className="text-primary italic ml-2">Saga</span>
                        </h1>
                    </div>

                    {/* Subtitle */}
                    <p className="text-2xl sm:text-3xl text-muted-foreground/90 font-medium mb-4 max-w-2xl tracking-tight">
                        Your commits. Your legend.
                    </p>
                    <p className="text-lg text-muted-foreground/60 mb-12 max-w-xl leading-relaxed">
                        Forge your repository&apos;s history into a dramatic, chapter-based narrative.
                        Witness your development journey retold as a legend for the ages.
                    </p>

                    {/* CTA Group (client component for auth) */}
                    <HeroCTA />

                    {/* Bento Grid Features */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-32 max-w-6xl w-full px-4">
                        {/* Large Feature - AI Narrative Engine */}
                        <div className="md:col-span-2 p-8 rounded-3xl glass bento-card group relative overflow-hidden flex flex-col md:flex-row items-center gap-8">
                             {/* Content */}
                            <div className="flex-1 relative z-10">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 border border-primary/20 shadow-[0_0_15px_-3px_var(--primary)] text-primary">
                                    <Wand2 className="w-7 h-7" />
                                </div>
                                <h3 className="text-3xl font-bold text-foreground mb-4">AI Narrative Engine</h3>
                                <p className="text-muted-foreground text-lg leading-relaxed">
                                    Our advanced storyteller processes your commit history, identifying key plot points, hero developers, and epic project evolutions.
                                </p>
                            </div>
                            
                            {/* Graphic */}
                            <div className="relative w-full md:w-1/2 h-48 md:h-full flex items-center justify-center">
                                 {/* Abstract decorative elements */}
                                <div className="absolute inset-0 bg-primary/5 rounded-2xl md:skew-y-3 transform md:translate-x-4 border border-white/5" />
                                <div className="absolute inset-0 bg-background/40 backdrop-blur-sm rounded-2xl md:-skew-y-3 transform md:-translate-x-4 border border-white/10 flex items-center justify-center p-6">
                                     <div className="space-y-3 w-full opacity-80">
                                         <div className="h-2 w-3/4 bg-primary/20 rounded-full animate-pulse" />
                                         <div className="h-2 w-full bg-primary/10 rounded-full animate-pulse delay-75" />
                                         <div className="h-2 w-5/6 bg-primary/10 rounded-full animate-pulse delay-150" />
                                         <div className="h-2 w-4/6 bg-primary/10 rounded-full animate-pulse delay-200" />
                                     </div>
                                </div>
                            </div>
                        </div>

                        {/* Small Feature 1 */}
                        <div className="p-8 rounded-3xl glass bento-card group flex flex-col items-start relative overflow-hidden">
                             <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                            
                            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-primary/20 shadow-sm relative z-10">
                                <GitCommit className="w-7 h-7 text-primary" />
                            </div>
                            
                            <h3 className="text-xl font-bold text-foreground mb-3 relative z-10">Any Repository</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed relative z-10">
                                Support for both public and private repos. We only read what you authorize, ensuring your legacy is yours alone.
                            </p>
                        </div>

                        {/* Small Feature 2 */}
                        <div className="p-8 rounded-3xl glass bento-card group flex flex-col items-start relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                            
                            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-primary/20 shadow-sm relative z-10">
                                <BookOpen className="w-7 h-7 text-primary" />
                            </div>
                            
                            <h3 className="text-xl font-bold text-foreground mb-3 relative z-10">Chaptered Sagas</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed relative z-10">
                                Commits are grouped into a three-act structure. Watch as your progress unfolds in a beautifully formatted interface.
                            </p>
                        </div>

                        {/* Long Feature */}
                        <div className="md:col-span-2 p-8 rounded-3xl glass bento-card group flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
                            <div className="flex-1 relative z-10">
                                <h3 className="text-2xl font-bold text-foreground mb-3">Real-time Chronicles</h3>
                                <p className="text-muted-foreground text-lg">Experience the story as it is written. Our low-latency streaming narrator brings your history to life instantly.</p>
                            </div>
                            
                            {/* Terminal / Streaming Animation */}
                            <div className="relative w-full md:w-64 h-32 rounded-lg bg-black/60 border border-white/10 p-4 font-mono text-xs overflow-hidden shadow-inner">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-primary/50 to-primary opacity-50" />
                                <div className="space-y-1.5">
                                    <div className="flex gap-2 text-primary/80">
                                        <span className="text-muted-foreground/50">{">"}</span>
                                        <span className="animate-typing overflow-hidden whitespace-nowrap w-0 border-r border-primary" style={{animation: 'typing 2s steps(20) infinite alternate, blink .7s infinite'}}>Initializing saga...</span>
                                    </div>
                                    <div className="flex gap-2 text-green-400/80 opacity-0 animate-fade-in" style={{animationDelay: '1s'}}>
                                        <span className="text-muted-foreground/50">{">"}</span>
                                        <span>Analyzing commits...</span>
                                    </div>
                                    <div className="flex gap-2 text-blue-400/80 opacity-0 animate-fade-in" style={{animationDelay: '2s'}}>
                                        <span className="text-muted-foreground/50">{">"}</span>
                                        <span>Generating chapter 1...</span>
                                    </div>
                                </div>
                                {/* Scanline effect */}
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent animate-scan" style={{backgroundSize: '100% 3px'}} />
                            </div>
                        </div>
                    </div>
                </main>

                <Footer />
            </div>
        </InteractiveBackground>
    );
}
