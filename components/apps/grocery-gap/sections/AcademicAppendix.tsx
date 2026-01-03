'use client';

import { useState, useEffect } from 'react';
import styles from './AcademicAppendix.module.css';
import { getBLSData, BLSInflationData } from '@/app/actions/getBLSData';

export default function AcademicAppendix() {
    const [isOpen, setIsOpen] = useState(false);
    const [blsData, setBlsData] = useState<BLSInflationData | null>(null);

    useEffect(() => {
        if (isOpen && !blsData) {
            getBLSData().then(setBlsData);
        }
    }, [isOpen, blsData]);

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
                        <div className={styles.grid}>
                            <div className={styles.column}>
                                <h3 className={styles.columnTitle}>Primary Research</h3>
                                <ul className={styles.citationList}>
                                    <li className={styles.citation}>
                                        <strong>Frequency Bias:</strong> Georganas, S., Healy, P. J., & Li, N. (2014). Frequency bias in consumer price perception. <em>Journal of Monetary Economics</em>.
                                    </li>
                                    <li className={styles.citation}>
                                        <strong>Grocery Price Exposure:</strong> D&apos;Acunto, F., Malmendier, U., Ospina, J., & Weber, M. (2021). Exposure to grocery prices and inflation expectations. <em>Journal of Political Economy</em>.
                                    </li>
                                    <li className={styles.citation}>
                                        <strong>Shrinkflation welfare loss:</strong> Rojas, F., Jaenicke, E. C., & Page, E. (2024). Shrinkflation and the Hidden Cost of Inflation. <em>SSRN Working Paper</em>.
                                    </li>
                                </ul>
                            </div>

                            <div className={styles.column}>
                                <h3 className={styles.columnTitle}>Data Sources</h3>
                                <ul className={styles.citationList}>
                                    <li className={styles.citation}>
                                        <strong>Regional Price Parities:</strong> U.S. Bureau of Economic Analysis (BEA), 2024 Release regarding 2022-2023 data.
                                    </li>
                                    <li className={styles.citation}>
                                        <strong>CPI Weights:</strong> U.S. Bureau of Labor Statistics (BLS), Consumer Price Index Summary, 2024.
                                        {blsData && (
                                            <span style={{ display: 'block', fontSize: '0.8em', color: '#2ecc71', marginTop: '4px' }}>
                                                ● Live Connection Active: Verified release {blsData.period} {blsData.year}
                                            </span>
                                        )}
                                    </li>
                                </ul>
                            </div>

                            <div className={styles.column}>
                                <h3 className={styles.columnTitle}>Related Reading</h3>
                                <ul className={styles.citationList}>
                                    <li className={styles.citation}>
                                        <a href="https://www.nytimes.com/2023/11/07/business/economy/biden-economy-inflation.html" target="_blank" rel="noopener noreferrer" className="hover:text-pop hover:underline">
                                            <strong>NYT Upshot:</strong> Why Voters Feel so Bad About a Good Economy
                                        </a>
                                    </li>
                                    <li className={styles.citation}>
                                        <a href="https://www.thestar.com/business/amount-of-inflation-in-canada-depends-on-stats-or-feelings/article_b30ec094-118c-5b23-9366-218320496152.html" target="_blank" rel="noopener noreferrer" className="hover:text-pop hover:underline">
                                            <strong>Toronto Star:</strong> Inflation: Stats vs. Feelings
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
                                <h3 className={styles.columnTitle}>Model Calculation</h3>
                                <div className={styles.modelNote}>
                                    <p className="mb-2">The <strong>Personal Cost Index</strong> (<span className="font-mono font-bold text-sm">PCI</span>) is calculated as:</p>

                                    <div className={styles.codeBlock}>
                                        <span className="font-bold text-pop">PCI</span> = <span className="italic opacity-80">Official_CPI</span> × <span className="italic opacity-80">Sticker_Shock</span> × <span className="italic opacity-80">Regional_Cost</span> + <span className="italic opacity-80">Shrinkflation</span>
                                    </div>

                                    <p className="text-sm opacity-80 mt-2 leading-relaxed">
                                        In plain English: We take the official CPI, multiply it by your brain&apos;s sensitivity to frequent purchases (0.44), adjust for your local cost of living, and add the hidden cost of shrinking products.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}

