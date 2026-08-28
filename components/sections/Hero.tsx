'use client';

import React from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';

// Honest claim, split into lines so the type becomes graphic architecture.
const HEADLINE_LINES: { text: string; accent?: boolean; stroke?: boolean }[] = [
    { text: 'I SHIP PRODUCTS' },
    { text: 'THAT TURN MESSY' },
    { text: 'DATA INTO', stroke: true },
    { text: 'DECISIONS.', accent: true },
];

const TAGS = ['[PRODUCT]', '[DATA→DECISIONS]', '[0-TO-1]'];

const MARQUEE =
    'PRODUCT MANAGER // PRODUCT & STRATEGY // TORONTO // xuexi // Sangyin // 0-TO-1 // MESSY DATA → DECISIONS // ';

const Hero: React.FC = () => {
    const reduce = useReducedMotion();

    // Per-line mask reveal — the one signature entrance.
    const lineReveal = (i: number) =>
        reduce
            ? {}
            : {
                  initial: { y: '110%' },
                  animate: { y: '0%' },
                  transition: { duration: 0.9, delay: i * 0.09, ease: [0.16, 1, 0.3, 1] as const },
              };

    const fade = reduce
        ? {}
        : {
              initial: { opacity: 0, y: 16 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 0.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] as const },
          };

    return (
        <section className="min-h-[100dvh] flex flex-col justify-center px-4 md:px-12 relative pt-32 pb-28 overflow-hidden">
            <div className="max-w-[90rem] mx-auto w-full z-10">
                {/* Eyebrow — honest level + recruiter keywords */}
                <motion.p
                    {...(reduce ? {} : { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.6 } })}
                    className="font-mono text-xs md:text-sm uppercase tracking-widest text-pop-ink dark:text-pop font-bold mb-8 flex items-center gap-3"
                >
                    <span className="w-2 h-2 bg-pop shrink-0 motion-safe:animate-pulse" aria-hidden="true" />
                    Product Manager — Product &amp; Strategy · Toronto · Open to early-career roles
                </motion.p>

                {/* Headline — type-as-architecture, masked line reveals */}
                <h1 className="font-display font-extrabold text-[clamp(2.75rem,10vw,9rem)] leading-[0.86] tracking-[-0.03em] mb-12">
                    {HEADLINE_LINES.map((line, i) => (
                        <span key={line.text} className="block overflow-hidden pb-[0.05em]">
                            <motion.span
                                {...lineReveal(i)}
                                className={`block ${line.accent ? 'text-pop motion-safe:animate-flicker' : ''}`}
                                style={
                                    line.stroke
                                        ? { WebkitTextStroke: '2px currentColor', color: 'transparent' }
                                        : undefined
                                }
                            >
                                {line.text}
                            </motion.span>
                        </span>
                    ))}
                </h1>

                {/* Offset-right column: bracket tags + honest spine (v1 layout, v2 words) */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    <motion.div {...fade} className="md:col-span-7 md:col-start-6">
                        <div className="flex flex-wrap gap-x-4 gap-y-2 mb-6 font-mono text-xs md:text-sm text-pop-ink dark:text-pop uppercase tracking-wider font-bold">
                            {TAGS.map((t) => (
                                <span key={t}>{t}</span>
                            ))}
                        </div>

                        <p className="text-lg md:text-xl font-sans leading-relaxed max-w-2xl border-l-2 border-pop pl-6 mb-10">
                            Economics + engineering background. I find a real user problem, make the hard
                            prioritization call, ship it, and measure what moved — most recently{' '}
                            <span className="font-bold">xuexi</span> (a Mandarin-learning app) and{' '}
                            <span className="font-bold">Sangyin</span> (an open-source audio reader).
                        </p>

                        {/* Two CTAs */}
                        <div className="flex flex-wrap gap-4">
                            <a
                                href="#work"
                                className="inline-flex items-center gap-2 bg-ink text-cream dark:bg-cream dark:text-ink font-bold px-8 py-4 text-lg shadow-hard hover:bg-pop hover:text-white hover:shadow-none hover:translate-y-1 transition-all focus-visible:ring-2 focus-visible:ring-pop-ink focus-visible:outline-none cursor-hoverable"
                            >
                                Read my flagship case study →
                            </a>
                            <Link
                                href="/resume"
                                className="inline-flex items-center gap-2 border-2 border-ink dark:border-cream px-8 py-4 text-lg font-bold hover:bg-ink hover:text-cream dark:hover:bg-cream dark:hover:text-ink transition-colors focus-visible:ring-2 focus-visible:ring-pop-ink focus-visible:outline-none cursor-hoverable"
                            >
                                View résumé
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Signature persistent element: bottom marquee ticker */}
            <div className="absolute bottom-0 left-0 w-full bg-ink dark:bg-white text-cream dark:text-ink py-3 overflow-hidden flex border-t-4 border-pop z-20">
                {[0, 1].map((k) => (
                    <div
                        key={k}
                        aria-hidden={k === 1}
                        className="animate-marquee motion-reduce:animate-none whitespace-nowrap font-mono text-sm tracking-wider font-bold shrink-0"
                    >
                        {MARQUEE.repeat(2)}
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Hero;
