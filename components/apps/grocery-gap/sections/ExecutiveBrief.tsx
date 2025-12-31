'use client';

import styles from './ExecutiveBrief.module.css';

export default function ExecutiveBrief() {
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <p className={styles.eyebrow}>Executive Strategy Brief</p>
                    <h2 className={styles.title}>The Business Impact</h2>
                    <p className={styles.subtitle}>
                        <span className="font-mono text-xs uppercase tracking-widest text-pop block mb-2">[OFFICIAL MEMO]</span>
                        Why perceived inflation matters for retail strategy and brand risk.
                    </p>
                </div>

                <div className={styles.grid}>
                    <div className={styles.card}>
                        <h3 className={styles.cardTitle}>Retail Pricing Strategy</h3>
                        <p className={styles.cardContent}>
                            Top-performing brands leverage <strong>Frequency Bias</strong>. By investing in loss leaders on high-frequency items (milk, eggs), retailers can purchase disproportionate positive customer sentiment, effectively decoupling their brand image from broader inflationary trends.
                        </p>
                    </div>

                    <div className={styles.card}>
                        <h3 className={styles.cardTitle}>Risk: The Trust Tax</h3>
                        <p className={styles.cardContent}>
                            Our data indicates a <strong>48% Brand Abandonment Rate</strong> when consumers detect shrinkflation. This "Trust Tax" creates a long-term liability that outweighs short-term margin protection. Transparency is now a competitive differentiator.
                        </p>
                    </div>

                    <div className={styles.card}>
                        <h3 className={styles.cardTitle}>Geographic Arbitrage</h3>
                        <p className={styles.cardContent}>
                            For talent acquisition, the <strong>Real Wage Gap</strong> between regions (up to 45% purchasing power differential) offers an opportunity. Companies can offer "lower" nominal salaries in high-elasticity markets (TX, OH) that actually deliver higher quality of life for employees.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
