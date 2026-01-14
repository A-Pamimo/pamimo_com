'use client';

import styles from './Shrinkflation.module.css';
import TLDR from '../ui/TLDR';
import LiveCPIIndicator from '../ui/LiveCPIIndicator';
import Image from 'next/image';

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

export const hiddenCosts = [
    {
        title: 'Package Confusion Effect',
        description: 'BLS assumes you perfectly calculate price-per-ounce while rushing through the aisle. Spoiler: you don\'t.',
    },
    {
        title: 'The Recipe Problem',
        description: 'The recipe calls for 500g. The new box is 450g. Now you have to buy two. Thanks, corporate math.',
    },
    {
        title: 'Search Cost',
        description: 'You now spend 5 extra minutes staring at tiny labels to see if the "Family Size" got smaller. That time isn\'t free.',
    },
    {
        title: 'Trust Tax',
        description: 'Remember when a pound of coffee was actually a pound? Neither do I. The mental load of verifying everything is exhausting.',
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
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-8">
                    <div className={styles.header}>
                        <p className={styles.eyebrow}>Chapter 2: Hidden Costs</p>
                        <h2 className={styles.title}>Shrinkflation</h2>
                        <p className={styles.subtitle}>
                            Same package, same price, less product. The BLS tracks strict price-per-ounce,
                            but they miss the <strong>loss of trust</strong>. That cognitive load is real.
                        </p>
                        {showLiveIndicator && (
                            <div style={{ marginTop: '1rem', marginBottom: '1rem' }}>
                                <LiveCPIIndicator />
                            </div>
                        )}
                        <TLDR inverted={true} source="Rojas et al. (2024), SSRN" sourceLink="https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4804636">
                            Companies make products smaller instead of raising prices. It tricks your brain and your wallet because you focus on the sticker price, not the price per ounce.
                        </TLDR>
                        <p className="text-xs opacity-60 mt-3 italic max-w-prose">
                            <strong>Research Note:</strong> The 3.9 percentage point welfare loss is specific to packaged goods during 2012-2021.
                            This represents unmeasured value erosion, not perceived inflation. I apply it proportionally based on grocery shopping frequency as an illustrative estimate.
                        </p>
                        <p className="text-xs opacity-60 mt-2 italic text-center">
                            I&apos;d tell you a joke about shrinkflation, but the punchline is getting smaller every year.
                        </p>
                    </div>

                    {/* Meme: Visual Example */}
                    <div className="max-w-sm mx-auto w-full border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rotate-1 hover:rotate-0 transition-transform duration-300">
                        <div className="relative w-full aspect-[4/3]">
                            <Image
                                src="/images/shrinkflation_pizza_meme.jpg"
                                alt="Pizza shrinkflation meme showing smaller slices - Nobody will notice"
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 400px"
                            />
                        </div>
                        <div className="bg-black text-white p-3 text-center">
                            <p className="text-sm font-bold uppercase tracking-wider">Exhibit A: The Classic Move</p>
                        </div>
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

                                {/* Box Chart: Visual comparison of old vs new size */}
                                <div className="flex items-end justify-center gap-3 h-24 my-4">
                                    {/* Old Size Box */}
                                    <div className="flex flex-col items-center">
                                        <div
                                            className="w-12 bg-gray-300 border-2 border-gray-400 transition-all"
                                            style={{ height: '100%' }}
                                            title={`Old: ${product.oldSize} ${product.unit}`}
                                        />
                                        <span className="text-[10px] font-mono mt-1 opacity-60">OLD</span>
                                    </div>
                                    {/* New Size Box */}
                                    <div className="flex flex-col items-center">
                                        <div
                                            className="w-12 bg-red-400 border-2 border-red-500 transition-all"
                                            style={{ height: `${(product.newSize / product.oldSize) * 100}%` }}
                                            title={`New: ${product.newSize} ${product.unit}`}
                                        />
                                        <span className="text-[10px] font-mono mt-1 text-red-500 font-bold">NEW</span>
                                    </div>
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
                    <h3 className={styles.hiddenCostsTitle}>What Creates the Perception Gap</h3>
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
