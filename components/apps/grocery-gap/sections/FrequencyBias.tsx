'use client';

import { useState } from 'react';
import styles from './FrequencyBias.module.css';
import TLDR from '../ui/TLDR';

interface BasketItem {
    name: string;
    cpiWeight: number;
    frequencyPerYear: number;
}

const basketItems: BasketItem[] = [
    { name: 'Groceries', cpiWeight: 13.5, frequencyPerYear: 156 }, // 3x/week
    { name: 'Gasoline', cpiWeight: 3.4, frequencyPerYear: 52 },
    { name: 'Restaurants', cpiWeight: 5.6, frequencyPerYear: 52 },
    { name: 'Electricity', cpiWeight: 2.5, frequencyPerYear: 12 },
    { name: 'Rent/Mortgage', cpiWeight: 32.4, frequencyPerYear: 12 },
    { name: 'Healthcare', cpiWeight: 8.1, frequencyPerYear: 4 },
    { name: 'Apparel', cpiWeight: 2.5, frequencyPerYear: 6 },
    { name: 'Electronics', cpiWeight: 1.2, frequencyPerYear: 0.5 },
];

function calculatePerceivedWeight(item: BasketItem, alpha: number): number {
    const totalFrequency = basketItems.reduce((a, b) => a + b.frequencyPerYear, 0);
    const frequencyWeight = (item.frequencyPerYear / totalFrequency) * 100;

    // Blend CPI weight and frequency weight using alpha
    return (alpha * frequencyWeight) + ((1 - alpha) * item.cpiWeight);
}

export default function FrequencyBias() {
    const [alpha, setAlpha] = useState(0.44);
    const [showFullCitation, setShowFullCitation] = useState(false);

    // Calculate perceived weights for all items
    const perceivedWeights = basketItems.map(item => ({
        ...item,
        perceivedWeight: calculatePerceivedWeight(item, alpha),
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
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <p className={styles.eyebrow}>Chapter 1: The Cognitive Gap</p>
                    <h2 className={styles.title}>Frequency Bias</h2>
                    <p className={styles.subtitle}>
                        Your brain weights price signals by how often you encounter them,
                        not by their actual share of your spending.
                    </p>
                    <TLDR>
                        You buy milk more often than fridges. So when milk prices go up, you feel like <em>everything</em> is getting expensive, even if big-ticket items are stable. This "frequency bias" distorts your perception of inflation.
                    </TLDR>
                </div>

                <div className={styles.alphaControl}>
                    <div className={styles.alphaLabel}>
                        <span className={styles.alphaTitle}>Price Sensitivity</span>
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
                        <span>Mathematical Reality (CPI)</span>
                        <span>Your Brain's Average</span>
                        <span>Pure Feeling</span>
                    </div>
                </div>

                <div className={styles.baskets}>
                    <div className={styles.basket}>
                        <h3 className={styles.basketTitle}>Official CPI Weights</h3>
                        {basketItems.map(item => (
                            <div key={item.name} className={styles.basketItem}>
                                <span className={styles.basketItemName}>{item.name}</span>
                                <div className={styles.basketItemBar}>
                                    <div
                                        className={`${styles.basketItemFill} ${styles.fillCpi}`}
                                        style={{ width: `${(item.cpiWeight / maxWeight) * 100}%` }}
                                    />
                                </div>
                                <span className={styles.basketItemValue}>{item.cpiWeight.toFixed(1)}%</span>
                            </div>
                        ))}
                    </div>

                    <div className={styles.basket}>
                        <h3 className={styles.basketTitle}>Perceived Weights (Sensitivity = {alpha.toFixed(2)})</h3>
                        {normalizedWeights.map(item => (
                            <div key={item.name} className={styles.basketItem}>
                                <span className={styles.basketItemName}>{item.name}</span>
                                <div className={styles.basketItemBar}>
                                    <div
                                        className={`${styles.basketItemFill} ${styles.fillPerceived}`}
                                        style={{ width: `${(item.perceivedWeight / maxWeight) * 100}%` }}
                                    />
                                </div>
                                <span className={styles.basketItemValue}>{item.perceivedWeight.toFixed(1)}%</span>
                            </div>
                        ))}
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
                                purchase frequencies. They found a "frequency bias" of 0.44. In plain English:
                                consumers notice price changes in frequent items (like milk) about 4x more than
                                they "should" if they were acting like a perfect computer.
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
