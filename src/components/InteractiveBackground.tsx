"use client";

import React, { useEffect, useRef, useState } from "react";

export const InteractiveBackground: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const { left, top } = containerRef.current.getBoundingClientRect();
        setMousePos({
          x: e.clientX - left,
          y: e.clientY - top,
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden bg-background">
      {/* Mesh/Spotlight Layer */}
      <div
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(800px circle at ${mousePos.x}px ${mousePos.y}px, var(--primary), transparent 40%)`,
          opacity: 0.15,
          mixBlendMode: 'screen',
        }}
      />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 z-0 opacity-[0.03]" 
        style={{ 
          backgroundImage: `linear-gradient(to right, oklch(0.75 0.18 75) 1px, transparent 1px), linear-gradient(to bottom, oklch(0.75 0.18 75) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }} 
      />

      {/* Subtle floating blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px] animate-pulse" />
      <div className="absolute bottom-[20%] right-[-5%] w-[30%] h-[30%] rounded-full bg-primary/10 blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />

      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
};
