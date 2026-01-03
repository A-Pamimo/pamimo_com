'use client';

import styles from './Shrinkflation.module.css';
import TLDR from '../ui/TLDR';
import LiveCPIIndicator from '../ui/LiveCPIIndicator';

interface ShrinkProduct {
    name: string;
    category: string;
    oldSize: number;
    newSize: number;
    unit: string;
    year: string;
    priceChange: number; // percentage, typically 0 or small increase
}

import { useRegion } from '../context/RegionContext';

// ... (keep interface ShrinkProduct) ...

// Verified shrinkflation examples from 2023-2024 research (US)
const shrinkProductsUS: ShrinkProduct[] = [
    { name: 'Laundry Detergent', category: 'Household', oldSize: 189, newSize: 140, unit: 'fl oz', year: '2023', priceChange: 0 },
    { name: 'Family Cereal', category: 'Breakfast', oldSize: 13.1, newSize: 9.7, unit: 'oz', year: '2024', priceChange: 0 },
    { name: 'Toilet Paper Roll', category: 'Household', oldSize: 280, newSize: 240, unit: 'sheets', year: '2023', priceChange: 0 },
    { name: 'Yogurt Cup', category: 'Dairy', oldSize: 5.3, newSize: 4.5, unit: 'oz', year: '2024', priceChange: 0 },
    { name: 'Candy Bag (Party)', category: 'Snacks', oldSize: 40, newSize: 35.6, unit: 'oz', year: '2024', priceChange: 0 },
    { name: 'Frosted Flakes', category: 'Breakfast', oldSize: 24, newSize: 21.7, unit: 'oz', year: '2024', priceChange: 0 },
];

// Verified shrinkflation examples from 2024 (Canada)
const shrinkProductsCA: ShrinkProduct[] = [
    { name: 'Kraft Salad Dressing', category: 'Pantry', oldSize: 475, newSize: 425, unit: 'ml', year: '2024', priceChange: 0 },
    { name: 'GoGo Squeez', category: 'Snacks', oldSize: 1440, newSize: 1080, unit: 'g', year: '2024', priceChange: 0 },
    { name: 'Jane\'s Chicken Bites', category: 'Frozen', oldSize: 900, newSize: 710, unit: 'g', year: '2024', priceChange: 0 },
    { name: 'Crisco Oil', category: 'Pantry', oldSize: 1420, newSize: 1180, unit: 'ml', year: '2024', priceChange: 0 },
    { name: 'Kraft Dinner', category: 'Pantry', oldSize: 225, newSize: 200, unit: 'g', year: '2024', priceChange: 0 },
    { name: 'Granola Bars (Box)', category: 'Snacks', oldSize: 6, newSize: 5, unit: 'bars', year: '2024', priceChange: 0 },
];

const hiddenCosts = [
    {
        title: 'Per-Unit Fallacy',
        description: 'BLS assumes price-size elasticity of 1.0. Actual data shows 0.4-0.7, meaning bulk discounts disappear with shrinkage.',
    },
    {
        title: 'The Recipe Problem',
        description: 'A 500g recipe with a 450g package forces you to buy two units. The leftover becomes waste or future cost.',
    },
    {
        title: 'Search Cost',
        description: 'Relearning package sizes, comparing new unit prices, and adjusting shopping habits takes cognitive effort.',
    },
    {
        title: 'Trust Tax',
        description: 'Reduced confidence in price signals means more time spent verifying value. This is uncompensated labor.',
    },
];

export default function Shrinkflation() {
    const { region } = useRegion();
    // Use live indicator only for US context for now (as FRED data is US-based)
    const showLiveIndicator = region.code === 'US';
    const shrinkProducts = region.code === 'CA' ? shrinkProductsCA : shrinkProductsUS;

    return (
        <section id="shrinkflation" className={styles.section}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <p className={styles.eyebrow}>Chapter 2: Hidden Costs</p>
                    <h2 className={styles.title}>Shrinkflation Examples</h2>
                    <p className={styles.subtitle}>
                        Same package, same price, less product. The BLS tracks price-per-ounce,
                        but they miss the <strong>loss of trust</strong>. That is the invisible tax.
                    </p>
                    {showLiveIndicator && (
                        <div style={{ marginTop: '1rem', marginBottom: '1rem' }}>
                            <LiveCPIIndicator />
                        </div>
                    )}
                    <TLDR inverted={true} source="Rojas et al. (2024), SSRN" sourceLink="https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4746409">
                        Companies make products smaller instead of raising prices. It tricks your brain and your wallet because you focus on the sticker price, not the price per ounce.
                    </TLDR>
                </div>

                <div className={styles.statsBanner}>
                    <div className={styles.statCard}>
                        <span className={styles.statNumber}>3.9pp</span>
                        <span className={styles.statLabel}>
                            <a href="https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4746409" target="_blank" className="hover:underline decoration-white/30">
                                Unmeasured Welfare Loss*
                                <span className="block text-[9px] opacity-70 font-normal no-underline">
                                    *(percentage points difference from official CPI)
                                </span>
                            </a>
                        </span>
                    </div>
                    <div className={styles.statCard}>
                        <span className={styles.statNumber}>82%</span>
                        <span className={styles.statLabel}>
                            <a href="https://business.yougov.com/content/48833-shrinkflation-affects-brand-loyalty-for-nearly-half-of-us-shoppers" target="_blank" className="hover:underline decoration-white/30">
                                Consumers who noticed
                            </a>
                        </span>
                    </div>
                    <div className={styles.statCard}>
                        <span className={styles.statNumber}>48%</span>
                        <span className={styles.statLabel}>
                            <a href="https://plma.com/" target="_blank" className="hover:underline decoration-white/30">
                                Who abandoned a brand
                            </a>
                        </span>
                    </div>
                </div>

                <div className={styles.products}>
                    {shrinkProducts.map((product) => {
                        const shrinkPercent = ((product.oldSize - product.newSize) / product.oldSize) * 100;

                        return (
                            <div key={product.name} className={styles.productCard}>
                                <div className={styles.cardHeader}>
                                    <h3 className={styles.productName}>{product.name}</h3>
                                    <span className={styles.productCategory}>{product.category}</span>
                                </div>

                                <div className={styles.progressContainer}>
                                    <div
                                        className={styles.progressBar}
                                        style={{ width: `${(product.newSize / product.oldSize) * 100}%` }}
                                    />
                                    <div className={styles.progressBarBackground} />
                                </div>

                                <div className={styles.cardFooter}>
                                    <span className={styles.sizeChange}>
                                        {product.oldSize} &rarr; {product.newSize} {product.unit}
                                    </span>
                                    <span className={styles.percentChange}>
                                        -{shrinkPercent.toFixed(0)}%
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className={styles.hiddenCosts}>
                    <h3 className={styles.hiddenCostsTitle}>What the BLS Misses</h3>
                    <div className={styles.costsList}>
                        {hiddenCosts.map((cost) => (
                            <div key={cost.title} className={styles.costItem}>
                                <h4 className={styles.costItemTitle}>{cost.title}</h4>
                                <p className={styles.costItemDesc}>{cost.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.keyFinding}>
                    <p className={styles.keyFindingLabel}>The Research Finding</p>
                    <div className={styles.keyFindingNumbers}>
                        <div className={styles.findingItem}>
                            <p className={`${styles.findingValue} ${styles.findingValueOfficial}`}>+3.8%</p>
                            <p className={styles.findingLabel}>Standard Measurement</p>
                        </div>
                        <span className={styles.vs}>vs</span>
                        <div className={styles.findingItem}>
                            <p className={`${styles.findingValue} ${styles.findingValueHedonic}`}>-0.1%</p>
                            <p className={styles.findingLabel}>Hedonic (Quality-Adjusted)</p>
                        </div>
                    </div>
                    <p className={styles.gapExplanation}>
                        Rojas, Jaenicke, and Page (2024) found a{' '}
                        <span className={styles.gapHighlight}>3.9 percentage point gap</span>{' '}
                        between standard and hedonic (quality-adjusted) inflation measures in packaged goods,
                        suggesting significant unmeasured welfare loss.
                    </p>
                    <p className={styles.citation}>
                        Source: Barcode-level analysis, 2012-2021
                    </p>
                </div>
            </div>
        </section>
    );
}
