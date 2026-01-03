'use client';

import { useState } from 'react';
import styles from './RegionalMap.module.css';

interface ProvinceData {
    abbr: string;
    name: string;
    mbmIndex: number;  // Market Basket Measure Index (100 = national average)
    housingIndex: number;  // Housing cost index
    trend: 'rising' | 'stable' | 'mixed';
}

// Estimated Cost Indices based on StatsCan 2023 MBM Thresholds (Vancouver ~$58k, Montreal ~$48k)
const provinceData: ProvinceData[] = [
    { abbr: 'BC', name: 'British Columbia', mbmIndex: 112.4, housingIndex: 145.2, trend: 'rising' },
    { abbr: 'ON', name: 'Ontario', mbmIndex: 110.6, housingIndex: 142.1, trend: 'rising' }, // TO: 57.5k
    { abbr: 'AB', name: 'Alberta', mbmIndex: 111.3, housingIndex: 105.4, trend: 'mixed' }, // Calgary: 57.9k
    { abbr: 'QC', name: 'Quebec', mbmIndex: 93.1, housingIndex: 85.2, trend: 'stable' }, // MTL: 48.4k
    { abbr: 'NS', name: 'Nova Scotia', mbmIndex: 101.8, housingIndex: 95.1, trend: 'rising' }, // HFX: 52.9k
    { abbr: 'MB', name: 'Manitoba', mbmIndex: 94.2, housingIndex: 86.5, trend: 'stable' },
    { abbr: 'SK', name: 'Saskatchewan', mbmIndex: 95.4, housingIndex: 84.1, trend: 'stable' },
    { abbr: 'NB', name: 'New Brunswick', mbmIndex: 92.5, housingIndex: 78.4, trend: 'rising' },
    { abbr: 'NL', name: 'Newfoundland & Lab.', mbmIndex: 100.5, housingIndex: 86.2, trend: 'mixed' }, // StJs: 52.2k
    { abbr: 'PE', name: 'P.E.I.', mbmIndex: 96.3, housingIndex: 88.5, trend: 'rising' },
];

function getIndexColor(index: number): string {
    if (index >= 105) return styles.rppHigh;
    if (index >= 95) return styles.rppMid;
    return styles.rppLow;
}

function getValueStyle(index: number): string {
    if (index >= 105) return styles.valueHigh;
    if (index >= 95) return styles.valueNeutral;
    return styles.valueLow;
}

export default function RegionalMapCA() {
    const [selectedProvince, setSelectedProvince] = useState<ProvinceData | null>(
        provinceData.find(s => s.abbr === 'ON') || null
    );
    const [showSalary, setShowSalary] = useState(false);
    const [salary, setSalary] = useState(60000);

    const sortedProvinces = [...provinceData].sort((a, b) => b.mbmIndex - a.mbmIndex);

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <p className={styles.eyebrow}>Chapter 3: The Spatial Gap</p>
                    <h2 className={styles.title}>Provincial Friction</h2>
                    <p className={styles.subtitle}>
                        National CPI treats all of Canada equally. But your postal code
                        determines whether global price shocks become unlivable rent increases.
                    </p>
                </div>

                <div className={styles.mapContainer}>
                    <div className={styles.mapWrapper}>
                        <p className={styles.mapTitle}>Cost of Living Index by Province (2024)</p>
                        <div className={styles.stateGrid}>
                            {sortedProvinces.map((prov) => (
                                <div
                                    key={prov.abbr}
                                    className={`${styles.stateCard} ${selectedProvince?.abbr === prov.abbr ? styles.stateCardSelected : ''
                                        }`}
                                    onClick={() => setSelectedProvince(prov)}
                                >
                                    <span className={styles.stateAbbr}>{prov.abbr}</span>
                                    <span className={`${styles.stateRpp} ${getIndexColor(prov.mbmIndex)}`}>
                                        {prov.mbmIndex.toFixed(0)}
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

                        {selectedProvince ? (
                            <>
                                <div className={styles.detailHeader}>
                                    <h3 className={styles.detailState}>{selectedProvince.name}</h3>
                                    {showSalary && (
                                        <div className="mt-1">
                                            <p className="text-xs font-bold uppercase tracking-widest opacity-50 mb-1">Real Purchasing Power</p>
                                            <p className={`text-2xl font-mono ${selectedProvince.mbmIndex < 100 ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
                                                ${(salary / (selectedProvince.mbmIndex / 100)).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                            </p>
                                        </div>
                                    )}
                                </div>
                                <div className={styles.detailStats}>
                                    <div className={styles.detailStat}>
                                        <span className={styles.detailStatLabel}>Overall Cost Index</span>
                                        <span className={`${styles.detailStatValue} ${getValueStyle(selectedProvince.mbmIndex)}`}>
                                            {selectedProvince.mbmIndex.toFixed(1)}
                                        </span>
                                    </div>
                                    <div className={styles.detailStat}>
                                        <span className={styles.detailStatLabel}>Housing Index</span>
                                        <span className={`${styles.detailStatValue} ${getValueStyle(selectedProvince.housingIndex)}`}>
                                            {selectedProvince.housingIndex.toFixed(1)}
                                        </span>
                                    </div>
                                    <div className={styles.detailStat}>
                                        <span className={styles.detailStatLabel}>Cost Trend</span>
                                        <span className={`${styles.detailStatValue} ${styles.valueNeutral}`}>
                                            {selectedProvince.trend.charAt(0).toUpperCase() + selectedProvince.trend.slice(1)}
                                        </span>
                                    </div>
                                </div>
                                {selectedProvince.housingIndex > 120 && (
                                    <div className={styles.detailInsight}>
                                        <p className={styles.insightText}>
                                            Housing in {selectedProvince.name} is{' '}
                                            <span className={styles.insightHighlight}>
                                                {(selectedProvince.housingIndex - 100).toFixed(0)}% above
                                            </span>{' '}
                                            the national average. Supply constraints in major urban centers are driving extreme friction.
                                        </p>
                                    </div>
                                )}
                                {selectedProvince.housingIndex < 90 && (
                                    <div className={styles.detailInsight}>
                                        <p className={styles.insightText}>
                                            Housing in {selectedProvince.name} is{' '}
                                            <span className={styles.insightHighlight}>
                                                {(100 - selectedProvince.housingIndex).toFixed(0)}% below
                                            </span>{' '}
                                            the national average, offering a significant buffer against other inflationary pressures.
                                        </p>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className={styles.detailHeader}>
                                <p className={styles.detailPrompt}>Click a province to see details</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className={styles.keyInsight}>
                    <p className={styles.insightQuote}>
                        &ldquo;While Toronto and Vancouver face European-style supply constraints,
                        the Prairie provinces remain remarkably elastic in their housing response.&rdquo;
                    </p>
                    <p className={styles.insightSource}>
                        Based on <a href="https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=1110006601" target="_blank" rel="noopener noreferrer" className="underline hover:text-pop">Statistics Canada MBM Thresholds (2023)</a>
                    </p>
                </div>
            </div>
        </section>
    );
}
