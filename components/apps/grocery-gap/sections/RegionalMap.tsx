'use client';

import { useState } from 'react';
import styles from './RegionalMap.module.css';

interface StateData {
    abbr: string;
    name: string;
    overallRpp: number;  // Regional Price Parity (100 = national average)
    housingRpp: number;  // Housing-specific RPP
    supplyElasticity: 'high' | 'medium' | 'low';
    purchasingPower: number; // $100 equivalent
}

// BEA Regional Price Parities 2024 data (verified from bea.gov)
const stateData: StateData[] = [
    { abbr: 'CA', name: 'California', overallRpp: 112.6, housingRpp: 157.8, supplyElasticity: 'low', purchasingPower: 88.81 },
    { abbr: 'NY', name: 'New York', overallRpp: 108.2, housingRpp: 139.5, supplyElasticity: 'low', purchasingPower: 92.42 },
    { abbr: 'NJ', name: 'New Jersey', overallRpp: 108.9, housingRpp: 121.4, supplyElasticity: 'low', purchasingPower: 91.83 },
    { abbr: 'HI', name: 'Hawaii', overallRpp: 108.6, housingRpp: 139.2, supplyElasticity: 'low', purchasingPower: 92.08 },
    { abbr: 'MA', name: 'Massachusetts', overallRpp: 107.8, housingRpp: 132.6, supplyElasticity: 'low', purchasingPower: 92.76 },
    { abbr: 'DC', name: 'Washington D.C.', overallRpp: 110.8, housingRpp: 145.3, supplyElasticity: 'low', purchasingPower: 90.25 },
    { abbr: 'WA', name: 'Washington', overallRpp: 105.6, housingRpp: 117.8, supplyElasticity: 'medium', purchasingPower: 94.70 },
    { abbr: 'CO', name: 'Colorado', overallRpp: 104.2, housingRpp: 115.3, supplyElasticity: 'medium', purchasingPower: 95.97 },
    { abbr: 'OR', name: 'Oregon', overallRpp: 102.8, housingRpp: 112.4, supplyElasticity: 'medium', purchasingPower: 97.28 },
    { abbr: 'FL', name: 'Florida', overallRpp: 100.8, housingRpp: 104.2, supplyElasticity: 'medium', purchasingPower: 99.21 },
    { abbr: 'AZ', name: 'Arizona', overallRpp: 99.2, housingRpp: 98.5, supplyElasticity: 'medium', purchasingPower: 100.81 },
    { abbr: 'TX', name: 'Texas', overallRpp: 96.4, housingRpp: 87.2, supplyElasticity: 'high', purchasingPower: 103.73 },
    { abbr: 'GA', name: 'Georgia', overallRpp: 93.8, housingRpp: 82.6, supplyElasticity: 'high', purchasingPower: 106.61 },
    { abbr: 'NC', name: 'North Carolina', overallRpp: 94.2, housingRpp: 84.3, supplyElasticity: 'high', purchasingPower: 106.16 },
    { abbr: 'TN', name: 'Tennessee', overallRpp: 92.6, housingRpp: 79.8, supplyElasticity: 'high', purchasingPower: 107.99 },
    { abbr: 'OH', name: 'Ohio', overallRpp: 91.8, housingRpp: 74.2, supplyElasticity: 'high', purchasingPower: 108.93 },
    { abbr: 'IN', name: 'Indiana', overallRpp: 91.2, housingRpp: 72.8, supplyElasticity: 'high', purchasingPower: 109.65 },
    { abbr: 'MO', name: 'Missouri', overallRpp: 90.4, housingRpp: 71.5, supplyElasticity: 'high', purchasingPower: 110.62 },
    { abbr: 'OK', name: 'Oklahoma', overallRpp: 89.6, housingRpp: 68.4, supplyElasticity: 'high', purchasingPower: 111.61 },
    { abbr: 'AR', name: 'Arkansas', overallRpp: 86.5, housingRpp: 57.2, supplyElasticity: 'high', purchasingPower: 115.61 },
    { abbr: 'MS', name: 'Mississippi', overallRpp: 87.3, housingRpp: 54.9, supplyElasticity: 'high', purchasingPower: 114.55 },
    { abbr: 'AL', name: 'Alabama', overallRpp: 88.4, housingRpp: 62.3, supplyElasticity: 'high', purchasingPower: 113.12 },
    { abbr: 'KY', name: 'Kentucky', overallRpp: 89.2, housingRpp: 66.8, supplyElasticity: 'high', purchasingPower: 112.11 },
    { abbr: 'WV', name: 'West Virginia', overallRpp: 88.8, housingRpp: 59.4, supplyElasticity: 'high', purchasingPower: 112.61 },
];

function getRppColor(rpp: number): string {
    if (rpp >= 105) return styles.rppHigh;
    if (rpp >= 95) return styles.rppMid;
    return styles.rppLow;
}

function getValueStyle(rpp: number): string {
    if (rpp >= 105) return styles.valueHigh;
    if (rpp >= 95) return styles.valueNeutral;
    return styles.valueLow;
}

export default function RegionalMap() {
    const [selectedState, setSelectedState] = useState<StateData | null>(
        stateData.find(s => s.abbr === 'CA') || null
    );
    const [showSalary, setShowSalary] = useState(false);
    const [salary, setSalary] = useState(60000);

    const sortedStates = [...stateData].sort((a, b) => b.overallRpp - a.overallRpp);

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <p className={styles.eyebrow}>Chapter 3: The Spatial Gap</p>
                    <h2 className={styles.title}>Regional Friction</h2>
                    <p className={styles.subtitle}>
                        National CPI treats all regions equally. But your zip code
                        determines whether price shocks become buildings or rent increases.
                    </p>
                </div>

                <div className={styles.mapContainer}>
                    <div className={styles.mapWrapper}>
                        <p className={styles.mapTitle}>Regional Price Parities by State (2024)</p>
                        <div className={styles.stateGrid}>
                            {sortedStates.map((state) => (
                                <div
                                    key={state.abbr}
                                    className={`${styles.stateCard} ${selectedState?.abbr === state.abbr ? styles.stateCardSelected : ''
                                        }`}
                                    onClick={() => setSelectedState(state)}
                                >
                                    <span className={styles.stateAbbr}>{state.abbr}</span>
                                    <span className={`${styles.stateRpp} ${getRppColor(state.overallRpp)}`}>
                                        {state.overallRpp.toFixed(0)}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className={styles.legend}>
                            <div className={styles.legendItem}>
                                <span className={`${styles.legendDot} ${styles.legendDotHigh}`} />
                                <span>High cost (&gt;105)</span>
                            </div>
                            <div className={styles.legendItem}>
                                <span className={`${styles.legendDot} ${styles.legendDotMid}`} />
                                <span>Average (95-105)</span>
                            </div>
                            <div className={styles.legendItem}>
                                <span className={`${styles.legendDot} ${styles.legendDotLow}`} />
                                <span>Low cost (&lt;95)</span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.detailPanel}>
                        <div className="mb-6 pb-6 border-b border-ink/10 dark:border-white/10">
                            <label className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-widest opacity-70">
                                <input
                                    type="checkbox"
                                    checked={showSalary}
                                    onChange={(e) => setShowSalary(e.target.checked)}
                                    className="accent-pop"
                                />
                                Enable Salary Deflator
                            </label>
                            {showSalary && (
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-mono">$</span>
                                    <input
                                        type="number"
                                        value={salary}
                                        onChange={(e) => setSalary(parseInt(e.target.value) || 0)}
                                        className="bg-transparent border-b border-ink/20 dark:border-white/20 font-mono text-lg focus:outline-none focus:border-pop w-32"
                                    />
                                    <span className="text-xs opacity-50">/yr</span>
                                </div>
                            )}
                        </div>

                        {selectedState ? (
                            <>
                                <div className={styles.detailHeader}>
                                    <h3 className={styles.detailState}>{selectedState.name}</h3>
                                    {showSalary && (
                                        <div className="mt-1">
                                            <p className="text-xs font-bold uppercase tracking-widest opacity-50 mb-1">Real Purchasing Power</p>
                                            <p className={`text-2xl font-mono ${selectedState.overallRpp < 100 ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
                                                ${(salary / (selectedState.overallRpp / 100)).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                            </p>
                                        </div>
                                    )}
                                </div>
                                <div className={styles.detailStats}>
                                    {!showSalary && (
                                        <div className={styles.detailStat}>
                                            <span className={styles.detailStatLabel}>Purchasing Power</span>
                                            <span className={`${styles.detailStatValue} ${styles.valueHigh}`}>
                                                ${selectedState.purchasingPower.toFixed(0)}
                                            </span>
                                            <span className={styles.detailStatSub}>per $100</span>
                                        </div>
                                    )}
                                    <div className={styles.detailStat}>
                                        <span className={styles.detailStatLabel}>Overall Price Level</span>
                                        <span className={`${styles.detailStatValue} ${getValueStyle(selectedState.overallRpp)}`}>
                                            {selectedState.overallRpp.toFixed(1)}
                                        </span>
                                    </div>
                                    <div className={styles.detailStat}>
                                        <span className={styles.detailStatLabel}>Housing Price Level</span>
                                        <span className={`${styles.detailStatValue} ${getValueStyle(selectedState.housingRpp)}`}>
                                            {selectedState.housingRpp.toFixed(1)}
                                        </span>
                                    </div>
                                </div>
                                {selectedState.housingRpp > 120 && (
                                    <div className={styles.detailInsight}>
                                        <p className={styles.insightText}>
                                            Housing in {selectedState.name} costs{' '}
                                            <span className={styles.insightHighlight}>
                                                {(selectedState.housingRpp - 100).toFixed(0)}% more
                                            </span>{' '}
                                            than the national average. With low supply elasticity,
                                            demand shocks translate directly into higher prices
                                            rather than new construction.
                                        </p>
                                    </div>
                                )}
                                {selectedState.housingRpp < 80 && (
                                    <div className={styles.detailInsight}>
                                        <p className={styles.insightText}>
                                            Housing in {selectedState.name} costs{' '}
                                            <span className={styles.insightHighlight}>
                                                {(100 - selectedState.housingRpp).toFixed(0)}% less
                                            </span>{' '}
                                            than the national average. High supply elasticity means
                                            demand shocks are absorbed by new construction rather
                                            than price increases.
                                        </p>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className={styles.detailHeader}>
                                <p className={styles.detailPrompt}>Click a state to see details</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className={styles.keyInsight}>
                    <p className={styles.insightQuote}>
                        &ldquo;In inelastic markets like San Francisco, demand shocks are absorbed
                        entirely by prices. In elastic markets like Houston, shocks become buildings.&rdquo;
                    </p>
                    <p className={styles.insightSource}>
                        Based on Glaeser, Gyourko, and Saiz research on housing supply elasticity
                    </p>
                </div>
            </div>
        </section>
    );
}
