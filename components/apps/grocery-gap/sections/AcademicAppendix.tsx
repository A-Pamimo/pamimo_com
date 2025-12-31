'use client';

import { useState } from 'react';
import styles from './AcademicAppendix.module.css';

export default function AcademicAppendix() {
    const [isOpen, setIsOpen] = useState(false);

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
                                        <strong>Frequency Bias:</strong> Georganas, S., Healy, P. J., & Li, N. (2014). Frequency bias in consumer price perception. <em>Journal of Monetary Economics</em>, 66, 186-199.
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
                                    </li>
                                </ul>
                            </div>

                            <div className={styles.column}>
                                <h3 className={styles.columnTitle}>Model Calculation</h3>
                                <p className={styles.modelNote}>
                                    The <strong>Personal Cost Index</strong> ($PCI$) is calculated as:
                                    <br />
                                    <code className={styles.codeBlock}>
                                        PCI = \pi_{base} \times (1 + \alpha(w_{freq} - 0.5)) \times \gamma_{geo} + S
                                    </code>
                                    <br />
                                    Where $\pi_{base}$ is official CPI, $\alpha=0.44$ (frequency bias coefficient), $w_{freq}$ is the user's weighted consumption of high-frequency goods, $\gamma_{geo}$ is the regional price parity multiplier, and $S$ is the shrinkflation constant.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
