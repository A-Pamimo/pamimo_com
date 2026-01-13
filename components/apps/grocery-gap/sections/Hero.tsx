import { useState } from 'react';
import styles from './Hero.module.css';
import { useRegion } from '../context/RegionContext';
import RegionToggle from '../ui/RegionToggle';

interface HeroProps {
    isBusinessMode?: boolean;
}

export default function Hero({ isBusinessMode = false }: HeroProps) {
    const { region } = useRegion();
    const isCanada = region.code === 'CA';
    const [expandedTLDR, setExpandedTLDR] = useState(false);

    return (
        <section className={styles.hero} data-mode={isBusinessMode ? 'business' : 'consumer'}>
            <div className={styles.heroContent}>
                <div className={styles.tagline}>
                    {isBusinessMode ? '[STRATEGIC_BRIEF]' : '[BEHAVIORAL_ECONOMICS]'}
                </div>

                <h1 className={styles.title}>
                    {isBusinessMode ? 'The Perception Gap' : 'The Grocery Gap'}
                    <span className={styles.titleAccent}>
                        {isBusinessMode ? 'Executive Briefing' : 'The Cost You Feel'}
                    </span>
                </h1>

                <div className={styles.subtitle}>
                    {isBusinessMode ? (
                        <div className="space-y-4">
                            <p className="text-xl md:text-2xl font-medium mb-4">
                                Why official CPI data ({isCanada ? '2.9%' : '3.4%'}) fails to capture consumer sentiment (15%+).
                            </p>
                            <p className="text-sm md:text-base opacity-90 max-w-prose border-l-4 border-pop pl-4">
                                This brief isolates the <strong>three psychological drivers</strong> creating the current wedge between economic data and voter/consumer reality: Frequency Bias, Loss Aversion, and Shrinkflation.
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="mb-6 border-2 border-black dark:border-white">
                                <button
                                    onClick={() => setExpandedTLDR(!expandedTLDR)}
                                    className="w-full flex justify-between items-center p-3 bg-black text-white dark:bg-white dark:text-black hover:bg-pop hover:text-white transition-colors"
                                >
                                    <span className="font-bold text-xs uppercase tracking-widest">TL;DR: The Executive Summary</span>
                                    <span className="font-mono text-sm">{expandedTLDR ? '[−]' : '[+]'}</span>
                                </button>

                                {expandedTLDR && (
                                    <div className="p-4 bg-white dark:bg-black text-theme-text border-t-2 border-black dark:border-white">
                                        <p className="text-sm md:text-base leading-relaxed">
                                            Official inflation counts every price change equally. Your brain does not.
                                            You pay a &quot;psychological tax&quot; every time you buy eggs or gas, but you ignore the flat price of TVs.
                                            This tool calculates the gap between the government&apos;s data and your reality.
                                        </p>
                                    </div>
                                )}
                            </div>

                            <p className="text-xl md:text-2xl font-medium mb-4">
                                The government says inflation is {isCanada ? '2.9%' : '3.4%'}.
                                You feel like it is 15%.
                            </p>
                            <div className="pl-4 border-l-4 border-theme-primary my-6 space-y-2 opacity-90">
                                <p><strong>Both can be true.</strong></p>
                                <p className="text-sm md:text-base max-w-prose">
                                    New research highlights a &quot;Grocery Gap&quot; between official data and consumer reality.
                                    While the CPI tracks average prices, your brain tracks <em>frequency</em> and <em>loss</em>.
                                    This tool helps you calculate your <strong>Perceived Inflation Index</strong> based on these psychological factors.
                                </p>
                            </div>
                        </>
                    )}
                </div>

                <div className={styles.stats}>
                    {[
                        {
                            value: '2.5x',
                            label: 'Mental multiplier',
                            desc: 'We feel price increases 2.5× more painfully than savings (Loss Aversion).',
                            anchor: 'frequency-bias'
                        },
                        {
                            value: isCanada ? '3-5%' : '3.9pp',
                            label: 'Shrinkflation Gap',
                            desc: 'Hidden welfare loss from package downsizing not fully captured in CPI.',
                            anchor: 'shrinkflation' // Ensure this anchor exists in Shrinkflation.tsx
                        },
                        {
                            value: isCanada ? '145%' : '57.8%',
                            label: isCanada ? 'BC Housing Premium' : 'Housing Premium',
                            desc: 'How much more housing costs relative to general inflation.',
                            anchor: 'regional-friction'
                        }
                    ].map((stat, i) => (
                        <button
                            key={i}
                            className={styles.stat}
                            onClick={() => {
                                const el = document.getElementById(stat.anchor);
                                if (el) el.scrollIntoView({ behavior: 'smooth' });
                            }}
                            aria-label={`Jump to ${stat.label} section`}
                        >
                            <div className={styles.statContent}>
                                <div className="flex justify-between items-start w-full">
                                    <span className={styles.statNumber}>{stat.value}</span>
                                    <span className="text-[10px] font-mono opacity-50 uppercase tracking-wider group-hover:text-theme-primary transition-colors">
                                        Read More
                                    </span>
                                </div>
                                <span className={styles.statLabel}>{stat.label}</span>
                                <span className="block text-[10px] mt-2 opacity-60 font-normal leading-tight normal-case max-w-[180px]">
                                    {stat.desc}
                                </span>
                            </div>
                            <div className={styles.statArrow}>↓</div>
                        </button>
                    ))}
                </div>

                <div className="mt-8 pt-6 border-t border-ink/10 dark:border-white/10 flex flex-wrap gap-6 text-[10px] font-mono opacity-50 uppercase tracking-widest">
                    <span>Sources:</span>
                    <a href="https://www.bls.gov/cpi/" target="_blank" rel="noopener noreferrer" className="hover:underline hover:opacity-100 transition-opacity">
                        US Bureau of Labor Statistics (CPI)
                    </a>
                    <span className="opacity-30">|</span>
                    <a href="https://www150.statcan.gc.ca/n1/daily-quotidien/240220/dq240220a-eng.htm" target="_blank" rel="noopener noreferrer" className="hover:underline hover:opacity-100 transition-opacity">
                        StatsCan (CPI)
                    </a>
                    <span className="opacity-30">|</span>
                    <span className="cursor-help" title="Kahneman, D., & Tversky, A. (1979). Prospect Theory: An Analysis of Decision under Risk.">
                        Kahneman & Tversky (1979)
                    </span>
                </div>
            </div>

            <div className={styles.scrollPrompt}>
                <div className={styles.scrollIcon}></div>

            </div>
        </section>
    );
}
