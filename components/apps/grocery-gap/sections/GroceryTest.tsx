'use client';

import { useState, useMemo } from 'react';
import styles from './GroceryTest.module.css';
import { useRegion } from '../context/RegionContext';

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
    { id: 'coffee', name: 'Coffee', frequency: 'Weekly', frequencyWeight: 52, price2022: 14.99, price2024: 18.99, cpiWeight: 0.15, unit: 'kg' },
    { id: 'gasoline', name: 'Gasoline', frequency: 'Weekly', frequencyWeight: 52, price2022: 1.65, price2024: 1.83, cpiWeight: 3.1, unit: 'liter' }, // Per liter CAD
    { id: 'eggs', name: 'Eggs', frequency: 'Weekly', frequencyWeight: 52, price2022: 3.88, price2024: 4.65, cpiWeight: 0.12, unit: 'dozen' },
    { id: 'streaming', name: 'Netflix', frequency: 'Monthly', frequencyWeight: 12, price2022: 16.49, price2024: 20.99, cpiWeight: 0.3, unit: 'month' },
    { id: 'laptop', name: 'Laptop', frequency: 'Every 3 years', frequencyWeight: 0.33, price2022: 1199, price2024: 1249, cpiWeight: 0.2, unit: 'unit' },
    { id: 'electricity', name: 'Electricity', frequency: 'Monthly', frequencyWeight: 12, price2022: 110, price2024: 128, cpiWeight: 2.2, unit: 'bill' },
    { id: 'restaurant', name: 'Restaurant Meal', frequency: 'Weekly', frequencyWeight: 52, price2022: 22.50, price2024: 26.50, cpiWeight: 6.1, unit: 'meal' },
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
    }, [ratings, allRated]);

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
                <p className={styles.subtitle}>
                    Rate how much each price change bothers you on a scale of 1-10.
                    Be honest. There are no wrong answers.
                </p>
            </div>

            <div className={styles.grid}>
                {products.map(product => {
                    const priceChange = ((product.price2024 - product.price2022) / product.price2022) * 100;
                    const isActive = ratings[product.id] !== undefined;

                    return (
                        <div
                            key={product.id}
                            className={`${styles.productCard} ${isActive ? styles.productCardActive : ''}`}
                        >
                            <div className={styles.productHeader}>
                                <span className={styles.productName}>{product.name}</span>
                                <span className={styles.productFrequency}>{product.frequency}</span>
                            </div>

                            <div className={styles.priceChange}>
                                <span className={styles.priceOld}>
                                    {region.currencySymbol}{product.price2022.toFixed(2)}
                                </span>
                                <span className={styles.priceArrow}>→</span>
                                <span className={styles.priceNew}>
                                    {region.currencySymbol}{product.price2024.toFixed(2)}
                                </span>
                                <span className={styles.changePercent}>
                                    +{priceChange.toFixed(0)}%
                                </span>
                            </div>

                            <div className={styles.sliderContainer}>
                                <div className={styles.sliderLabel}>
                                    <span>Does not bother me</span>
                                    <span>Bothers me a lot</span>
                                </div>
                                <input
                                    type="range"
                                    min="1"
                                    max="10"
                                    value={ratings[product.id] || 5}
                                    onChange={(e) => handleRatingChange(product.id, parseInt(e.target.value))}
                                    className={styles.slider}
                                />
                                <div className={styles.sliderValue}>
                                    {ratings[product.id] || '–'}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {!showResults && (
                <button
                    className={styles.submitButton}
                    onClick={handleSubmit}
                    disabled={!allRated}
                >
                    {allRated ? 'See My Results' : `Rate all ${products.length} items to continue`}
                </button>
            )}

            {showResults && results && (
                <div className={`${styles.results} ${styles.resultsVisible}`}>
                    <h3 className={styles.resultsTitle}>Your Mental Inflation Weights</h3>

                    <div className={styles.comparison}>
                        <div className={styles.comparisonSide}>
                            <p className={styles.comparisonLabel}>Your weight on frequent purchases</p>
                            <p className={`${styles.comparisonValue} ${styles.yourWeight}`}>
                                {results.userHighFreqWeight.toFixed(0)}%
                            </p>
                        </div>

                        <span className={styles.vs}>vs</span>

                        <div className={styles.comparisonSide}>
                            <p className={styles.comparisonLabel}>CPI weight on frequent purchases</p>
                            <p className={`${styles.comparisonValue} ${styles.cpiWeight}`}>
                                {results.cpiHighFreqWeight.toFixed(0)}%
                            </p>
                        </div>
                    </div>

                    <p className={styles.explanation}>
                        You weighted high-frequency purchases at{' '}
                        <span className={styles.explainHighlight}>
                            {(results.userHighFreqWeight / results.cpiHighFreqWeight).toFixed(1)}x
                        </span>{' '}
                        the official CPI weight. This is <span className={styles.explainHighlight}>Frequency Bias</span>.
                        Because you buy these items often, your brain treats their price changes as "more real" than bigger, rarer purchases.
                        Most people have a sensitivity multiplier of about <span className={styles.explainHighlight}>2.5x</span>.
                    </p>
                </div>
            )}
        </section>
    );
}
