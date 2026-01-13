'use client';

import { useState, useEffect } from 'react';
import styles from './AcademicAppendix.module.css';
import { useRegionalCPI } from '@/app/actions/getRegionalCPI';
import Image from 'next/image';

export default function AcademicAppendix() {
    const [isOpen, setIsOpen] = useState(false);
    const { data: cpiData } = useRegionalCPI();
    const isLive = cpiData && !cpiData.source.includes('Fallback');

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <button
                    className={styles.toggleButton}
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <span className={styles.toggleIcon}>{isOpen ? '−' : '+'}</span>
                    METHODOLOGY & CITATIONS
                </button>

                {isOpen && (
                    <div className={styles.content}>
                        {/* Economist Disclaimer */}
                        <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 p-4 mb-6 text-sm">
                            <p className="font-bold text-amber-800 dark:text-amber-200 mb-1">📐 Note for Economists</p>
                            <p className="text-amber-700 dark:text-amber-300 opacity-90">
                                This tool measures <strong>perceived inflation</strong> based on psychological factors (frequency bias, cognitive load),
                                not a normative cost-of-living index. It explains the gap between official CPI and consumer sentiment,
                                not to replace COLI methodology. All parameters are illustrative, not individually calibrated.
                            </p>
                        </div>

                        <div className={styles.grid}>
                            <div className={styles.column}>
                                <h3 className={styles.columnTitle}>Primary Research</h3>
                                <ul className={styles.citationList}>
                                    <li className={styles.citation}>
                                        <strong>Frequency Bias:</strong> Georganas, S., Healy, P. J., & Li, N. (2014). <a href="https://ideas.repec.org/a/eee/eecrev/v67y2014i1p144-158.html" target="_blank" rel="noopener noreferrer" className="hover:text-pop hover:underline">Frequency bias in consumers&apos; perceptions of inflation</a>. <em>European Economic Review</em>, 67, 144-158.
                                    </li>
                                    <li className={styles.citation}>
                                        <strong>Grocery Price Exposure:</strong> D&apos;Acunto, F., Malmendier, U., Ospina, J., & Weber, M. (2021). <a href="https://www.nber.org/papers/w27951" target="_blank" rel="noopener noreferrer" className="hover:text-pop hover:underline">Exposure to grocery prices and inflation expectations</a>. <em>Journal of Political Economy</em>, 129(5), 1615-1639.
                                    </li>
                                    <li className={styles.citation}>
                                        <strong>Shrinkflation:</strong> Rojas, C., Jaenicke, E. C., & Page, E. (2024). <a href="https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4804636" target="_blank" rel="noopener noreferrer" className="hover:text-pop hover:underline">Shrinkflation? Quantifying the Impact of Changes in Package Size on Food Inflation</a>. <em>SSRN Working Paper</em>.
                                    </li>
                                </ul>
                            </div>

                            <div className={styles.column}>
                                <h3 className={styles.columnTitle}>Data Sources (Nov 2025)</h3>
                                <ul className={styles.citationList}>
                                    <li className={styles.citation}>
                                        <a href="https://www.bls.gov/regions/subjects/consumer-price-indexes.htm" target="_blank" rel="noopener noreferrer" className="hover:text-pop hover:underline">
                                            <strong>US Regional CPI:</strong> BLS Regional CPI Summary
                                        </a>
                                    </li>
                                    <li className={styles.citation}>
                                        <a href="https://www150.statcan.gc.ca/n1/daily-quotidien/251215/dq251215a-eng.htm" target="_blank" rel="noopener noreferrer" className="hover:text-pop hover:underline">
                                            <strong>Canada CPI:</strong> Statistics Canada CPI Release
                                        </a>
                                        {isLive ? (
                                            <span style={{ display: 'block', fontSize: '0.8em', color: '#2ecc71', marginTop: '4px' }}>
                                                ● Live Connection Active: Verified release {cpiData.regions.US.period}
                                            </span>
                                        ) : (
                                            <span style={{ display: 'block', fontSize: '0.8em', color: '#999', marginTop: '4px' }}>
                                                ● Using Fallback Data (Nov 2025)
                                            </span>
                                        )}
                                    </li>
                                </ul>
                            </div>

                            <div className={styles.column}>
                                <h3 className={styles.columnTitle}>Related Reading</h3>
                                <ul className={styles.citationList}>
                                    <li className={styles.citation}>
                                        <a href="https://www.theatlantic.com/ideas/archive/2023/12/inflation-prices-consumers-spending/676191/" target="_blank" rel="noopener noreferrer" className="hover:text-pop hover:underline">
                                            <strong>The Atlantic:</strong> Inflation Is Your Fault (Why people keep buying despite high prices)
                                        </a>
                                    </li>
                                    <li className={styles.citation}>
                                        <a href="https://en.wikipedia.org/wiki/Vibecession" target="_blank" rel="noopener noreferrer" className="hover:text-pop hover:underline">
                                            <strong>Wikipedia:</strong> Vibecession (The disconnect between economic data and public sentiment)
                                        </a>
                                    </li>
                                    <li className={styles.citation}>
                                        <a href="https://pudding.cool/" target="_blank" rel="noopener noreferrer" className="hover:text-pop hover:underline">
                                            <strong>The Pudding:</strong> Visual Journalism Inspiration
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            <div className={styles.column}>
                                <h3 className={styles.columnTitle}>Perceived Inflation Index (PII)</h3>
                                <div className={styles.modelNote}>
                                    <p className="mb-2">The <strong>Perceived Inflation Index</strong> (<span className="font-mono font-bold text-sm">PII</span>) is calculated as:</p>

                                    <div className={styles.codeBlock}>
                                        <span className="font-bold text-pop">PII</span> = <span className="italic opacity-80">Regional_CPI</span> + <span className="italic opacity-80">Freq_Bias</span> + <span className="italic opacity-80">Housing_Pressure</span>
                                    </div>

                                    <p className="text-sm opacity-80 mt-3 mb-2 font-bold">Component Breakdown:</p>

                                    <p className="text-xs opacity-70 mt-2 leading-relaxed">
                                        <strong>1. Regional CPI (Base):</strong> Your state&apos;s official inflation rate from BLS (e.g., 3.1% for Northeast, 2.2% for South).
                                    </p>

                                    <p className="text-xs opacity-70 mt-2 leading-relaxed">
                                        <strong>2. Frequency Bias:</strong> α × (HighFreqWeight - 0.5) × BaseCPI<br />
                                        Where α = 0.44 (from Georganas et al. 2014)<br />
                                        Example: If you buy groceries/gas 60% of the time vs other items, and base CPI is 3%:<br />
                                        → 0.44 × (0.60 - 0.50) × 3.0 = +0.13%
                                    </p>

                                    <p className="text-xs opacity-70 mt-2 leading-relaxed">
                                        <strong>3. Housing Pressure:</strong> (RentBurden / 100) × ShelterWeight × ShelterInflation<br />
                                        Where ShelterWeight = 36.2% (US) or 29.1% (Canada) of CPI basket<br />
                                        Example: If you spend 45% of income on rent, shelter inflation is 5%, and you&apos;re in the US:<br />
                                        → 0.45 × 0.362 × 5.0 = +0.81%
                                    </p>

                                    <p className="text-xs opacity-70 mt-2 leading-relaxed">
                                        <strong>4. Shrinkflation (Separate):</strong> 3.9% × (GroceryShare)<br />
                                        Example: If groceries are 40% of your purchases:<br />
                                        → 3.9 × 0.40 = 1.56% hidden value loss
                                    </p>

                                    <p className="text-xs opacity-60 mt-3 italic">
                                        Note: PII measures perceived inflation pressure, not official statistics. Shrinkflation is shown separately as a &quot;Hidden Loss&quot; because it represents value erosion, not price increases.
                                    </p>
                                </div>
                            </div>

                            <div className={styles.fullWidth}>
                                <h3 className={styles.columnTitle}>Model Limitations & Research Context</h3>
                                <div className={styles.modelNote}>
                                    <p className="text-sm font-bold mb-2 text-pop">Important: This is a stylized educational model</p>

                                    <p className="text-xs opacity-80 leading-relaxed mb-3">
                                        The Perceived Inflation Index illustrates <strong>why perception differs from measurement</strong>, not which is &quot;more correct.&quot;
                                        It combines three distinct phenomena:
                                    </p>

                                    <div className="space-y-2 mb-4">
                                        <div className="border-l-4 border-black dark:border-white pl-3">
                                            <p className="text-xs font-bold">1. Cognitive Bias (Frequency Weighting)</p>
                                            <p className="text-xs opacity-70">Your brain overweights price changes in frequently purchased items. This is a <strong>perception error</strong>, not a measurement error.</p>
                                        </div>

                                        <div className="border-l-4 border-black dark:border-white pl-3">
                                            <p className="text-xs font-bold text-white">2. Measurement Gap (Shrinkflation)</p>
                                            <div className="text-white space-y-2">
                                                <p className="text-xs text-white opacity-90">Research Note: The 3.9 percentage point welfare loss is specific to packaged goods during 2012-2021. This represents unmeasured value erosion, not perceived inflation. I apply it proportionally based on grocery shopping frequency as an illustrative estimate.</p>
                                                <p className="text-xs text-white italic opacity-80">&quot;I&apos;d tell you a joke about shrinkflation, but the punchline is getting smaller every year.&quot;</p>
                                            </div>
                                        </div>

                                        <div className="border-l-4 border-black dark:border-white pl-3">
                                            <p className="text-xs font-bold">3. Distributional Effects (Housing Burden)</p>
                                            <p className="text-xs opacity-70">If your housing costs differ from the average, you&apos;ll experience inflation differently. This isn&apos;t bias - it&apos;s <strong>real variation</strong> in personal circumstances.</p>
                                        </div>
                                    </div>

                                    <p className="text-xs opacity-70 leading-relaxed mb-2">
                                        <strong>Comparison of Measures:</strong>
                                    </p>
                                    <div className="overflow-x-auto mb-4">
                                        <table className="text-xs w-full border-collapse">
                                            <thead>
                                                <tr className="border-b-2 border-black dark:border-white">
                                                    <th className="text-left py-1 pr-2">Measure</th>
                                                    <th className="text-left py-1 pr-2">What It Tracks</th>
                                                    <th className="text-left py-1">Best For</th>
                                                </tr>
                                            </thead>
                                            <tbody className="opacity-80">
                                                <tr className="border-b border-gray-300 dark:border-gray-600">
                                                    <td className="py-1 pr-2 font-bold">Official CPI</td>
                                                    <td className="py-1 pr-2">Objective price changes (fixed basket)</td>
                                                    <td className="py-1">Policy, wage indexing</td>
                                                </tr>
                                                <tr className="border-b border-gray-300 dark:border-gray-600">
                                                    <td className="py-1 pr-2 font-bold">Personal COLI</td>
                                                    <td className="py-1 pr-2">Your actual expenditure basket</td>
                                                    <td className="py-1">True welfare impact</td>
                                                </tr>
                                                <tr>
                                                    <td className="py-1 pr-2 font-bold text-pop">This Tool (PII)</td>
                                                    <td className="py-1 pr-2">Psychological perception of inflation</td>
                                                    <td className="py-1">Understanding sentiment gap</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>

                                    <p className="text-xs opacity-70 leading-relaxed mb-2">
                                        <strong>Limitations:</strong>
                                    </p>
                                    <ul className="text-xs opacity-70 space-y-1 list-disc list-inside mb-3">
                                        <li>Measures psychological <em>perception</em>, not economic welfare</li>
                                        <li>α = 0.44 is illustrative, not individually calibrated (std error ±0.15)</li>
                                        <li>Does not account for <strong>substitution effects</strong> (you switch to cheaper goods)</li>
                                        <li>Regional adjustments may overlap with CPI&apos;s existing regional weights</li>
                                        <li>Shrinkflation rate extrapolated from packaged goods only (2012-2021)</li>
                                        <li>Results are <strong>illustrative</strong>, not precise predictions</li>
                                    </ul>

                                    <p className="text-xs opacity-60 mt-3 italic">
                                        This model is designed for education, not as a replacement for official statistics.
                                        It helps explain the &quot;vibecession&quot; - why people feel worse about the economy than the data suggests they should.
                                    </p>
                                </div>
                            </div>

                            <div className={styles.fullWidth}>
                                <h3 className={styles.columnTitle}>Technical Deep Dive</h3>
                                <p className={styles.citation}>
                                    <strong>How I built this:</strong> I deployed a custom <strong>Cloudflare Worker</strong> that acts as a global edge proxy.
                                    Every time you load this page, the worker securely calls the official <strong>BLS API</strong> to fetch the absolute latest Regional CPI data (Series CUUR0000SA0).
                                    I cache this data for 24 hours to protect the government&apos;s servers while ensuring you see the same numbers the Fed sees.
                                </p>
                                <p className={styles.citation}>
                                    <strong>Why it matters:</strong> Most calculators use static yearly data. I wanted you to see the real number, right now, as it changes.
                                </p>

                                <div className={styles.memeContainer}>
                                    <div className="relative w-full aspect-[4/3]">
                                        <Image
                                            src="/images/inflation_meme.png"
                                            alt="Rent vs Eggs Inflation Meme"
                                            fill
                                            className={styles.memeImage}
                                            sizes="(max-width: 768px) 100vw, 400px"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}

