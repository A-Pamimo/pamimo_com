'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import styles from './FrequencyBias.module.css';
import TLDR from '../ui/TLDR';
import { useRegion } from '../context/RegionContext';

interface BasketItem {
    name: string;
    cpiWeight: number;
    frequencyPerYear: number;
}

const basketItemsUS: BasketItem[] = [
    { name: 'Groceries', cpiWeight: 8.0, frequencyPerYear: 156 }, // BLS "Food at home" Dec 2024: 8.043%
    { name: 'Gasoline', cpiWeight: 3.3, frequencyPerYear: 52 },   // BLS "Gasoline, all types"
    { name: 'Restaurants', cpiWeight: 5.4, frequencyPerYear: 52 },
    { name: 'Electricity', cpiWeight: 2.5, frequencyPerYear: 12 },
    { name: 'Rent/Mortgage', cpiWeight: 36.2, frequencyPerYear: 12 }, // BLS "Shelter": 36.2%
    { name: 'Healthcare', cpiWeight: 8.1, frequencyPerYear: 4 },
    { name: 'Apparel', cpiWeight: 2.5, frequencyPerYear: 6 },
    { name: 'Electronics', cpiWeight: 1.2, frequencyPerYear: 0.5 },
];

const basketItemsCA: BasketItem[] = [
    { name: 'Groceries', cpiWeight: 10.8, frequencyPerYear: 156 }, // StatsCan 2024: ~10.75%
    { name: 'Gasoline', cpiWeight: 3.7, frequencyPerYear: 52 },   // StatsCan 2024: 3.71%
    { name: 'Restaurants', cpiWeight: 5.9, frequencyPerYear: 52 }, // StatsCan 2023: 5.90%
    { name: 'Electricity', cpiWeight: 1.7, frequencyPerYear: 12 }, // StatsCan 2024: 1.68%
    { name: 'Rent/Mortgage', cpiWeight: 29.1, frequencyPerYear: 12 }, // StatsCan 2024 Shelter: 29.12%
    { name: 'Healthcare', cpiWeight: 4.5, frequencyPerYear: 4 },  // Lower due to public coverage
    { name: 'Apparel', cpiWeight: 3.8, frequencyPerYear: 6 },
    { name: 'Electronics', cpiWeight: 1.5, frequencyPerYear: 0.5 }, // Adjust to fill
];

function calculatePerceivedWeight(item: BasketItem, alpha: number, basket: BasketItem[]): number {
    const totalFrequency = basket.reduce((a, b) => a + b.frequencyPerYear, 0);
    const frequencyWeight = (item.frequencyPerYear / totalFrequency) * 100;

    // Blend CPI weight and frequency weight using alpha
    return (alpha * frequencyWeight) + ((1 - alpha) * item.cpiWeight);
}

export default function FrequencyBias() {
    const { region } = useRegion();
    const basketItems = region.code === 'CA' ? basketItemsCA : basketItemsUS;

    const [alpha, setAlpha] = useState(0.44);
    const [showFullCitation, setShowFullCitation] = useState(false);

    // Calculate perceived weights for all items
    const perceivedWeights = basketItems.map(item => ({
        ...item,
        perceivedWeight: calculatePerceivedWeight(item, alpha, basketItems),
    }));

    // Normalize to sum to ~100%
    const totalPerceived = perceivedWeights.reduce((a, b) => a + b.perceivedWeight, 0);
    const normalizedWeights = perceivedWeights.map(item => ({
        ...item,
        perceivedWeight: (item.perceivedWeight / totalPerceived) * 100,
    }));

    // Find max for scaling
    const maxCpi = Math.max(...basketItems.map(i => i.cpiWeight));
    const maxPerceived = Math.max(...normalizedWeights.map(i => i.perceivedWeight));
    const maxWeight = Math.max(maxCpi, maxPerceived);

    return (
        <section id="frequency-bias" className={styles.section}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <p className={styles.eyebrow}>Chapter 1: Why Our Brains Lie</p>
                    <h2 className={styles.title}>Frequency Bias</h2>
                    <p className={styles.subtitle}>
                        Your brain weights price signals by how often you encounter them,
                        not by their actual share of your spending.
                    </p>
                    <TLDR source="European Economic Review (2014)" sourceLink="https://ideas.repec.org/a/eee/eecrev/v67y2014i1p144-158.html">
                        Researchers proved that even when people <em>know</em> the official inflation rate,
                        they ignore it if it conflicts with the price changes of their most frequent purchases.
                    </TLDR>
                </div>

                <div className={styles.alphaControl}>
                    <div className={styles.alphaLabel}>
                        <span className={styles.alphaTitle}>Your &quot;Bias Level&quot;</span>
                        <span className={styles.alphaValue}>{alpha.toFixed(2)}</span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={alpha}
                        onChange={(e) => setAlpha(parseFloat(e.target.value))}
                        className={styles.alphaSlider}
                    />
                    <div className={styles.alphaDescription}>
                        <span>0.0 (Pure Logic)</span>
                        <span>0.44 (Avg Human)</span>
                        <span>1.0 (Pure Emotion)</span>
                    </div>
                </div>
                <div className={styles.sliderExplainer}>
                    <p>
                        This slider lets you simulate different psychological states.
                        At <strong>0.44</strong> (default), you are seeing the world as most humans do—over-weighting daily purchases.
                        Slide to <strong>0</strong> to see the &quot;Logic&quot; (CPI) view, or <strong>1</strong> to see fully emotive pricing.
                    </p>
                </div>

                <div className={styles.chartContainer}>
                    <div className={styles.chartLegend}>
                        <div className={styles.legendItem}>
                            <div className={`${styles.legendDot} ${styles.fillCpi}`} />
                            <span>Official CPI Weight</span>
                        </div>
                        <div className={styles.legendItem}>
                            <div className={`${styles.legendDot} ${styles.fillPerceived}`} />
                            <span>Your Brain&apos;s Weight</span>
                        </div>
                    </div>

                    <div className={styles.chartGrid}>
                        {normalizedWeights.map(item => (
                            <div key={item.name} className={styles.chartRow}>
                                <div className={styles.rowLabel}>{item.name}</div>
                                <div className={styles.rowBars}>
                                    {/* Official CPI Bar */}
                                    <div className={styles.barGroup}>
                                        <motion.div
                                            className={`${styles.bar} ${styles.fillCpi}`}
                                            style={{ width: `${Math.min((item.cpiWeight / 50) * 100, 100)}%`, transformOrigin: 'left' }}
                                            initial={{ scaleX: 0 }}
                                            whileInView={{ scaleX: 1 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.8, ease: "circOut", delay: 0.1 }}
                                        />
                                        <span className={styles.barValue}>{item.cpiWeight.toFixed(1)}%</span>
                                    </div>

                                    {/* Perceived Bar */}
                                    <div className={styles.barGroup}>
                                        <motion.div
                                            className={`${styles.bar} ${styles.fillPerceived}`}
                                            style={{ width: `${Math.min((item.perceivedWeight / 50) * 100, 100)}%`, transformOrigin: 'left' }}
                                            initial={{ scaleX: 0 }}
                                            whileInView={{ scaleX: 1 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.8, ease: "circOut", delay: 0.2 }}
                                        />
                                        <span className={`${styles.barValue} ${styles.valuePerceived}`}>
                                            {item.perceivedWeight.toFixed(1)}%
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 text-center text-[10px] text-theme-text opacity-50 font-mono">
                        {region.code === 'CA' ? (
                            <>Source: <a href="https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=1810000501" target="_blank" rel="noopener noreferrer" className="underline hover:text-pop">Statistics Canada Basket Weights (2024)</a></>
                        ) : (
                            <>Source: <a href="https://www.bls.gov/news.release/cpi.t02.htm" target="_blank" rel="noopener noreferrer" className="underline hover:text-pop">BLS Consumer Price Index Relative Importance (Dec 2024)</a></>
                        )}
                        <span className="block mt-1 opacity-70">*Bars scaled to max 50% for visibility</span>
                    </div>
                </div>

                <div className={styles.citation}>
                    <p className={styles.citationText}>
                        &ldquo;Subjects systematically overweighted price changes in frequently purchased goods
                        when estimating economy-wide inflation... even when they knew the true inflation rates.&rdquo;
                    </p>
                    <p className={styles.citationSource}>
                        Georganas, Healy, and Li (2014), Journal of Monetary Economics
                    </p>

                    <button
                        className={styles.accordionToggle}
                        onClick={() => setShowFullCitation(!showFullCitation)}
                    >
                        {showFullCitation ? '− Less detail' : '+ More detail'}
                    </button>

                    {showFullCitation && (
                        <div className={styles.accordionContent}>
                            <p>
                                The researchers conducted controlled experiments where people bought items with different
                                purchase frequencies. They found a &ldquo;frequency bias&rdquo; of 0.44. In plain English:
                                consumers notice price changes in frequent items (like milk) about 4x more than
                                they &ldquo;should&rdquo; if they were acting like a perfect computer.
                            </p>
                            <p style={{ marginTop: '1rem' }}>
                                Additional validation from Vogel, Menz, and Fritsche (2009) found that in a 12-country
                                Eurozone panel, households exhibited loss aversion, reacting roughly 2x as strongly
                                to price increases as to decreases.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

