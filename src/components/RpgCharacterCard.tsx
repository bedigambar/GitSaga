
import Image from "next/image";
import { Sword, Scroll, Zap, Crown, User, Book } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface RpgCharacterCardProps {
    repoName: string;
    language: string | null;
    stars: number;
    forks: number;
    size: number;
    ownerAvatar?: string;
    className?: string;
}

const CLASS_MAPPING: Record<string, string> = {
    TypeScript: "Type Wizard",
    JavaScript: "Script Rogue",
    Python: "Pyromancer",
    Rust: "Iron Guardian",
    Go: "Cloud Walker",
    Java: "Byte Paladin",
    "C++": "Memory Knight",
    C: "Void Sentinel",
    HTML: "Web Weaver",
    CSS: "Style Sorcerer",
    PHP: "Echo Priest",
    Ruby: "Gem Alchemist",
    Swift: "Speed Ranger",
    Kotlin: "Android Archer",
    Shell: "Bash Barbarian",
    default: "Code Mercenary"
};

export function RpgCharacterCard({
    repoName,
    language,
    stars,
    forks,
    size,
    ownerAvatar,
    className
}: RpgCharacterCardProps) {
    const rpgClass = CLASS_MAPPING[language || "default"] || CLASS_MAPPING["default"];
    const level = Math.max(1, Math.floor(Math.log2(size + 1) + (stars / 50)));

    const strength = Math.min(100, Math.floor((size / 1000) * 10) + 10);
    const dexterity = Math.min(100, Math.floor((forks * 2) + 10));
    const charisma = Math.min(100, Math.floor((stars / 2) + 10));
    const intelligence = Math.min(100, Math.floor(level * 5 + 20));

    return (
        <div className={cn("relative group perspective-1000", className)}>
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-xl opacity-0 group-hover:opacity-50 transition-opacity duration-700" />
            
            <Card className="relative overflow-hidden border-2 border-primary/30 bg-black/80 backdrop-blur-md p-6 rpg-card-clip">
                {/* Header / Avatar */}
                <div className="flex items-start justify-between mb-6">
                    <div className="flex gap-4">
                        <div className="relative">
                            <div className="w-16 h-16 rounded-lg overflow-hidden border-2 border-primary shadow-[0_0_15px_rgba(var(--primary),0.5)]">
                                {ownerAvatar ? (
                                    <Image src={ownerAvatar} alt="Avatar" width={64} height={64} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-primary/20 flex items-center justify-center">
                                        <User className="w-8 h-8 text-primary" />
                                    </div>
                                )}
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-primary text-background text-xs font-bold px-2 py-0.5 rounded-full border border-black shadow-sm">
                                Lvl {level}
                            </div>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-primary tracking-tight">{repoName.split('/')[1] || repoName}</h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                <Scroll className="w-3 h-3" />
                                <span className="text-foreground/90 font-medium">{rpgClass}</span>
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Rank</div>
                        <div className="text-2xl font-black text-amber-500 flex items-center justify-end gap-1">
                            <Crown className="w-5 h-5" />
                            <span>{level > 50 ? 'S' : level > 30 ? 'A' : level > 15 ? 'B' : 'C'}</span>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <StatBar label="STR" value={strength} icon={<Sword className="w-3 h-3" />} color="bg-red-500" />
                    <StatBar label="AGI" value={dexterity} icon={<Zap className="w-3 h-3" />} color="bg-yellow-500" />
                    <StatBar label="CHA" value={charisma} icon={<User className="w-3 h-3" />} color="bg-purple-500" />
                    <StatBar label="INT" value={intelligence} icon={<Book className="w-3 h-3" />} color="bg-blue-500" />
                </div>

                {/* Flavor Text / Footer */}
                <div className="mt-4 pt-4 border-t border-white/10 text-xs text-muted-foreground italic text-center">
                    &quot;A legendary artifact forged in the fires of {language || 'code'}.&quot;
                </div>
            </Card>
        </div>
    );
}

function StatBar({ label, value, icon, color }: { label: string; value: number; icon: React.ReactNode; color: string }) {
    return (
        <div className="space-y-1">
            <div className="flex justify-between text-xs uppercase font-bold tracking-wider text-muted-foreground">
                <span className="flex items-center gap-1.5">{icon} {label}</span>
                <span className="text-foreground">{value}</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div 
                    className={cn("h-full rounded-full opacity-80 shadow-[0_0_10px_currentColor]", color)} 
                    style={{ width: `${Math.min(100, value)}%` }} 
                />
            </div>
        </div>
    );
}
