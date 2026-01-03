'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { motion, useSpring, useTransform, useInView } from 'framer-motion';
import styles from './GroceryTest.module.css';
import { useRegion } from '../context/RegionContext';

function Counter({ value, suffix = '%' }: { value: number; suffix?: string }) {
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: true });

    const spring = useSpring(0, { mass: 0.8, stiffness: 75, damping: 15 });
    const display = useTransform(spring, (current) => Math.round(current) + suffix);

    useEffect(() => {
        if (isInView) {
            spring.set(value);
        }
    }, [spring, value, isInView]);

    return <motion.span ref={ref}>{display}</motion.span>;
}

interface Product {
    id: string;
    name: string;
    frequency: string;
    frequencyWeight: number; // Higher = more frequent
    price2022: number;
    price2024: number;
    cpiWeight: number; // Official CPI weight (percentage)
    unit: string;
}

const productsUS: Product[] = [
    { id: 'coffee', name: 'Coffee', frequency: 'Weekly', frequencyWeight: 52, price2022: 8.99, price2024: 10.97, cpiWeight: 0.15, unit: 'lb bag' },
    { id: 'gasoline', name: 'Gasoline', frequency: 'Weekly', frequencyWeight: 52, price2022: 3.41, price2024: 4.02, cpiWeight: 3.4, unit: 'gallon' },
    { id: 'eggs', name: 'Eggs', frequency: 'Weekly', frequencyWeight: 52, price2022: 2.86, price2024: 3.95, cpiWeight: 0.11, unit: 'dozen' },
    { id: 'streaming', name: 'Netflix', frequency: 'Monthly', frequencyWeight: 12, price2022: 13.99, price2024: 17.49, cpiWeight: 0.3, unit: 'month' },
    { id: 'laptop', name: 'Laptop', frequency: 'Every 3 years', frequencyWeight: 0.33, price2022: 899, price2024: 944, cpiWeight: 0.2, unit: 'unit' },
    { id: 'electricity', name: 'Electricity', frequency: 'Monthly', frequencyWeight: 12, price2022: 143, price2024: 163, cpiWeight: 2.5, unit: 'bill' },
    { id: 'restaurant', name: 'Restaurant Meal', frequency: 'Weekly', frequencyWeight: 52, price2022: 16.50, price2024: 17.82, cpiWeight: 5.6, unit: 'meal' },
    { id: 'coat', name: 'Winter Coat', frequency: 'Every 2 years', frequencyWeight: 0.5, price2022: 189, price2024: 195, cpiWeight: 0.08, unit: 'coat' },
];

const productsCA: Product[] = [
    { id: 'coffee', name: 'Coffee', frequency: 'Weekly', frequencyWeight: 52, price2022: 15.65, price2024: 27.35, cpiWeight: 0.15, unit: 'kg' }, // StatsCan Jan '22: $15.65/kg ($5.32/340g)
    { id: 'gasoline', name: 'Gasoline', frequency: 'Weekly', frequencyWeight: 52, price2022: 1.45, price2024: 1.61, cpiWeight: 3.71, unit: 'liter' }, // StatsCan 2024 Weight: 3.71%
    { id: 'eggs', name: 'Eggs', frequency: 'Weekly', frequencyWeight: 52, price2022: 3.88, price2024: 4.75, cpiWeight: 0.12, unit: 'dozen' }, // ~Feb 2025
    { id: 'streaming', name: 'Netflix', frequency: 'Monthly', frequencyWeight: 12, price2022: 16.49, price2024: 18.99, cpiWeight: 0.3, unit: 'month' }, // Jan 2025 Price
    { id: 'laptop', name: 'Laptop', frequency: 'Every 3 years', frequencyWeight: 0.33, price2022: 1199, price2024: 1249, cpiWeight: 0.2, unit: 'unit' },
    { id: 'electricity', name: 'Electricity', frequency: 'Monthly', frequencyWeight: 12, price2022: 110, price2024: 141, cpiWeight: 1.68, unit: 'bill' }, // StatsCan 2024 Weight 1.68%
    { id: 'restaurant', name: 'Restaurant Meal', frequency: 'Weekly', frequencyWeight: 52, price2022: 22.50, price2024: 25.00, cpiWeight: 5.90, unit: 'meal' }, // StatsCan 2023 Weight 5.90%
    { id: 'coat', name: 'Winter Coat', frequency: 'Every 2 years', frequencyWeight: 0.5, price2022: 249, price2024: 275, cpiWeight: 0.08, unit: 'coat' },
];

export default function GroceryTest() {
    const { region } = useRegion();
    const products = region.code === 'CA' ? productsCA : productsUS;

    const [ratings, setRatings] = useState<Record<string, number>>({});
    const [showResults, setShowResults] = useState(false);

    const handleRatingChange = (productId: string, value: number) => {
        setRatings(prev => ({ ...prev, [productId]: value }));
    };

    const allRated = products.every(p => ratings[p.id] !== undefined);

    const results = useMemo(() => {
        if (!allRated) return null;

        // Calculate user's implied weights based on their ratings
        const totalRating = Object.values(ratings).reduce((a, b) => a + b, 0);
        const userWeights = products.map(p => ({
            ...p,
            userWeight: (ratings[p.id] / totalRating) * 100,
        }));

        // Calculate frequency-weighted prices for high-frequency items (coffee, gas, eggs, restaurant)
        const highFreqItems = userWeights.filter(p => p.frequencyWeight >= 12);
        const lowFreqItems = userWeights.filter(p => p.frequencyWeight < 12);

        const avgHighFreqUserWeight = highFreqItems.reduce((a, b) => a + b.userWeight, 0);
        const avgHighFreqCpiWeight = highFreqItems.reduce((a, b) => a + b.cpiWeight, 0);

        return {
            userHighFreqWeight: avgHighFreqUserWeight,
            cpiHighFreqWeight: avgHighFreqCpiWeight,
        };
    }, [ratings, allRated, products]);

    const handleSubmit = () => {
        if (allRated) {
            setShowResults(true);
        }
    };

    return (
        <section className={styles.section}>
            <div className={styles.header}>
                <p className={styles.eyebrow}>Interactive Experiment</p>
                <h2 className={styles.title}>The Grocery Test</h2>
                <div className={styles.narrativeIntro}>
                    <p>
                        We want to measure your <strong>Sticker Shock</strong>.
                        Official data tracks prices, but this tool tracks your pain.
                        Rate how deeply each price change bothers you personally.
                    </p>
                    <p className="text-[10px] mt-2 opacity-60 font-mono">
                        Product prices sourced from official {region.code === 'CA' ? 'StatsCan' : 'BLS'} average price data.
                    </p>
                </div>
            </div>

            <div className={styles.progressContainer}>
                <div className={styles.progressLabel}>
                    <span className="font-bold">Progress</span>
                    <span className="font-mono">{Object.keys(ratings).length} / {products.length} Rated</span>
                </div>
                <div className={styles.progressBarBg}>
                    <div
                        className={styles.progressBarFill}
                        style={{ width: `${(Object.keys(ratings).length / products.length) * 100}%` }}
                    />
                </div>
            </div>

            <div className={styles.grid}>
                {products.map(product => {
                    const priceChange = ((product.price2024 - product.price2022) / product.price2022) * 100;
                    const isActive = ratings[product.id] !== undefined;
                    const val = ratings[product.id] || 5;

                    // Dynamic color calc: Green (120) -> Red (0)
                    const hue = 120 - ((val - 1) / 9) * 120;
                    const dynamicColor = `hsl(${hue}, 80%, 45%)`;

                    return (
                        <div
                            key={product.id}
                            className={`${styles.productCard} ${isActive ? styles.productCardActive : ''}`}
                            style={isActive ? { borderColor: dynamicColor, boxShadow: `4px 4px 0px 0px ${dynamicColor}` } : {}}
                        >
                            <div className={styles.productHeader}>
                                <span className={styles.productName}>{product.name}</span>
                                <span className={styles.productFrequency}>{product.frequency}</span>
                            </div>

                            <div className={styles.priceChange}>
                                <span className={styles.priceOld}>
                                    {region.currencySymbol}{product.price2022.toFixed(2)}
                                </span>
                                <span className={styles.priceArrow}>&rarr;</span>
                                <span className={styles.priceNew}>
                                    {region.currencySymbol}{product.price2024.toFixed(2)}
                                </span>
                                <span className={styles.changePercent}>
                                    +{priceChange.toFixed(0)}%
                                </span>
                            </div>

                            <div className={styles.sliderContainer}>
                                <div className={styles.sliderLabel}>
                                    <span>Fine</span>
                                    <span>Painful</span>
                                </div>
                                <input
                                    type="range"
                                    min="1"
                                    max="10"
                                    value={ratings[product.id] || 5}
                                    onChange={(e) => {
                                        const newVal = parseInt(e.target.value);
                                        handleRatingChange(product.id, newVal);
                                        if (navigator.vibrate) navigator.vibrate(5); // Haptic tick
                                    }}
                                    className={styles.slider}
                                    style={{
                                        background: `linear-gradient(to right, #4ADE80 0%, #FACC15 50%, #FF4400 100%)`,
                                        '--thumb-color': dynamicColor
                                    } as React.CSSProperties}
                                />
                                <div className="flex justify-between items-center mt-2 px-1">
                                    <div className={styles.sliderValue} style={{ color: isActive ? dynamicColor : 'inherit' }}>
                                        {ratings[product.id] || 5}/10
                                    </div>
                                    {isActive && (
                                        <div className="text-[10px] font-mono font-bold uppercase text-theme-text/80">
                                            Shock: <span style={{ color: dynamicColor }}>
                                                {val > 7 ? 'High' : val > 4 ? 'Med' : 'Low'}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {!showResults && (
                <div className="flex flex-col items-center mt-12 pb-8 gap-4">
                    <button
                        onClick={handleSubmit}
                        disabled={!allRated}
                        className={`${styles.button} ${allRated ? styles.buttonActive : ''}`}
                    >
                        {allRated
                            ? 'Calculate Your Sticker Shock'
                            : `Calculate (${products.length - Object.keys(ratings).length} items remaining)`}
                    </button>

                    <p className={styles.privacyNote}>
                        *Your inputs are processed locally in your browser. No personal data is logged or stored.
                    </p>
                </div>
            )}

            {
                showResults && results && (
                    <div className={`${styles.results} ${styles.resultsVisible}`}>
                        <h3 className={styles.resultsTitle}>Your Mental Inflation Weights</h3>
                        <p className="text-[10px] text-center opacity-60 mb-6 font-mono uppercase tracking-widest">
                            Values derived from your sensitivity ratings
                        </p>

                        <div className={styles.comparison}>
                            <div className={styles.comparisonSide}>
                                <p className={styles.comparisonLabel}>Your weight on frequent purchases</p>
                                <p className={`${styles.comparisonValue} ${styles.yourWeight}`}>
                                    <Counter value={results.userHighFreqWeight} />
                                </p>
                            </div>

                            <span className={styles.vs}>vs</span>

                            <div className={styles.comparisonSide}>
                                <p className={styles.comparisonLabel}>CPI weight on frequent purchases</p>
                                <p className={`${styles.comparisonValue} ${styles.cpiWeight}`}>
                                    <Counter value={results.cpiHighFreqWeight} />
                                </p>
                            </div>
                        </div>

                        <p className={styles.explanation}>
                            You weighted high-frequency purchases at{' '}
                            <span className={styles.explainHighlight}>
                                {(results.userHighFreqWeight / results.cpiHighFreqWeight).toFixed(1)}x
                            </span>{' '}
                            the official CPI weight. This is <span className={styles.explainHighlight}>Frequency Bias</span>.
                            The CPI weighs items by <em>cost</em>, but your brain weighs them by <em>pain</em>. You feel the coffee price hike 52 times a year, so it feels &ldquo;more real&rdquo; than the stable price of a fridge you buy once a decade.
                        </p>
                    </div>
                )
            }

            <div className="mt-8 text-center text-[10px] text-theme-text opacity-50 font-mono">
                {region.code === 'CA' ? (
                    <>Data Source: <a href="https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=1810024501" target="_blank" rel="noopener noreferrer" className="underline hover:text-pop">Statistics Canada Table 18-10-0245-01 (Monthly Average Retail Prices)</a></>
                ) : (
                    <>Use of BLS Average Price Data (Series AP) for Jan 2022 vs Jan 2024 is for illustrative purposes. <a href="https://www.bls.gov/regions/midwest/data/averageenergyprices_selectedareas_table.htm" target="_blank" rel="noopener noreferrer" className="underline hover:text-pop">View Official Energy Data</a>.</>
                )}
            </div>
        </section >
    );
}

