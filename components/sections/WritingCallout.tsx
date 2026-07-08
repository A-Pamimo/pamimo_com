'use client';

import React from 'react';
import Link from 'next/link';

// Surfaces the strongest long-form analytical piece as a first-class credential,
// reinforcing the "messy data -> decisions" thesis without diluting the work index.
const WritingCallout: React.FC = () => {
    return (
        <section className="py-24 md:py-32 px-4 md:px-12 bg-surface border-t-2 border-edge transition-colors">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-wrap items-baseline justify-between gap-4 mb-8">
                    <h2 className="font-display font-extrabold text-display-1">SELECTED<br />WRITING<span className="text-pop">.</span></h2>
                    <Link href="/blog" className="font-mono text-label font-bold text-pop-ink dark:text-pop hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pop-ink">
                        ALL WRITING ↗
                    </Link>
                </div>

                <Link
                    href="/blog/the-grocery-gap"
                    className="group block border-2 border-edge bg-bg p-8 md:p-12 transition-all hover:shadow-hard-lg hover:-translate-x-1 hover:-translate-y-1 cursor-hoverable focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pop-ink"
                >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="max-w-2xl">
                            <span className="font-mono text-label font-bold text-pop-ink dark:text-pop uppercase">Interactive Essay · Behavioral Economics</span>
                            <h3 className="font-display font-bold text-display-2 mt-3 mb-3">The Grocery Gap</h3>
                            <p className="opacity-80 leading-relaxed">
                                Why the inflation you <em>feel</em> outruns the number you&apos;re told — a sourced, interactive
                                breakdown of frequency bias, shrinkflation and regional CPI, with an executive mode and a
                                &ldquo;your real inflation&rdquo; calculator.
                            </p>
                        </div>
                        <span className="font-mono text-label font-bold text-pop-ink dark:text-pop shrink-0 group-hover:translate-x-1 transition-transform">READ ↗</span>
                    </div>
                </Link>
            </div>
        </section>
    );
};

export default WritingCallout;
