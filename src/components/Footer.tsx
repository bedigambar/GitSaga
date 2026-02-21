
import { Github, Linkedin } from "lucide-react";

export default function Footer() {
    return (
        <footer className="w-full py-6 mt-auto border-t border-white/5 bg-black/20 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground/60">
                
                <div className="text-center md:text-left">
                    <span>&copy; {new Date().getFullYear()} GitSaga. Echoes of the repository.</span>
                </div>

                <div className="flex items-center gap-6">
                    <a 
                        href="https://x.com/digambarcodes" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:text-primary transition-colors flex items-center gap-2 group"
                    >
                        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current group-hover:scale-110 transition-transform">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                        </svg>
                        <span className="hidden sm:inline font-medium">X / Twitter</span>
                    </a>
                    
                    <a 
                        href="https://github.com/bedigambar" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:text-white transition-colors flex items-center gap-2 group"
                    >
                        <Github className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        <span className="hidden sm:inline font-medium">GitHub</span>
                    </a>

                    <a 
                        href="https://www.linkedin.com/in/digambar-behera" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:text-blue-400 transition-colors flex items-center gap-2 group"
                    >
                        <Linkedin className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        <span className="hidden sm:inline font-medium">LinkedIn</span>
                    </a>
                </div>
            </div>
        </footer>
    );
}
