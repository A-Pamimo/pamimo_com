import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { IconArrow } from '../ui/Icons';

interface BlogCardProps {
    title: string;
    description: string;
    date: string;
    readTime: string;
    href: string;
    tags?: string[];
}

const GLITCH_CHARS = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const useGlitchText = (text: string, active: boolean) => {
    const [displayText, setDisplayText] = useState(text);
    const iterations = useRef(0);

    useEffect(() => {
        if (!active) {
            setDisplayText(text);
            iterations.current = 0;
            return;
        }

        const interval = setInterval(() => {
            setDisplayText(
                text
                    .split('')
                    .map((char, index) => {
                        if (index < iterations.current) {
                            return text[index];
                        }
                        return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
                    })
                    .join('')
            );

            if (iterations.current >= text.length) {
                clearInterval(interval);
            }

            // Speed of resolution
            iterations.current += 1 / 3;
        }, 30);

        return () => clearInterval(interval);
    }, [active, text]);

    return displayText;
};

export default function BlogCard({ title, description, date, readTime, href, tags }: BlogCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const glitchedTitle = useGlitchText(title, isHovered);

    // Fake "Metadata" for the tech flex
    const byteSize = title.length * 128 + Math.floor(Math.random() * 500);
    const readVelocity = "240wpm";

    return (
        <Link
            href={href}
            className="group block h-full"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <article className="relative h-full flex flex-col justify-between p-6 border-2 border-ink dark:border-white/20 bg-white dark:bg-charcoal/50 transition-all duration-300 transform group-hover:-translate-y-2 group-hover:shadow-[8px_8px_0px_0px_var(--pop)] group-hover:bg-ink/5 dark:group-hover:bg-white/5">

                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                    <div className="flex flex-col gap-1">
                        <span className="font-mono text-xs text-pop font-bold tracking-widest uppercase flex items-center gap-2">
                            {tags?.[0] || 'ARTICLE'}
                            {isHovered && <span className="animate-pulse text-[8px] bg-pop text-white px-1 rounded-sm">V.2.0</span>}
                        </span>
                        <span className="font-mono text-[10px] opacity-50 uppercase tracking-wide group-hover:text-pop transition-colors">
                            {date} • {readTime}
                        </span>
                    </div>
                    <IconArrow className="w-4 h-4 -rotate-45 opacity-0 -translate-x-2 translate-y-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 text-pop transition-all duration-300" />
                </div>

                {/* Content */}
                <div className="relative z-10">
                    <h3 className="text-xl md:text-2xl font-bold leading-tight mb-3 text-theme-text group-hover:text-pop transition-colors min-h-[3.5rem]">
                        {glitchedTitle}
                    </h3>
                    <p className="text-sm text-theme-text opacity-80 leading-relaxed line-clamp-3 group-hover:opacity-100 transition-opacity">
                        {description}
                    </p>
                </div>

                {/* Footer / Tags & Data Reveal */}
                <div className="mt-6 pt-4 border-t border-ink/5 dark:border-white/5">
                    {/* Normal Tags - Hide on Hover */}
                    <div className={`flex flex-wrap gap-2 transition-opacity duration-200 ${isHovered ? 'opacity-0 absolute' : 'opacity-100'}`}>
                        {tags && tags.slice(1).map((tag) => (
                            <span key={tag} className="text-[10px] font-mono px-2 py-1 bg-ink/5 dark:bg-white/5 rounded-sm opacity-60">
                                #{tag}
                            </span>
                        ))}
                    </div>

                    {/* Data Reveal - Show on Hover */}
                    <div className={`flex items-center justify-between font-mono text-[10px] text-pop transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 absolute'}`}>
                        <span>SIZE: {byteSize}b</span>
                        <span>VELOCITY: {readVelocity}</span>
                        <span className="animate-pulse">_READING</span>
                    </div>
                </div>

                {/* Background Decor */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-1 pointer-events-none transition-opacity duration-500`}
                    style={{
                        backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(var(--pop-rgb), 0.05) 0%, transparent 70%)'
                    }}
                />
            </article>
        </Link>
    );
}
