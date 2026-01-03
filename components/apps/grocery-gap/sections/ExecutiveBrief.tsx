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
                            Smart brands respect <strong>Frequency Bias</strong>. They know customers judge the entire economy by the price of eggs. Winning retailers protect these &ldquo;signal items&rdquo; to maintain trust, even if it means eating margin elsewhere.
                        </p>
                    </div>

                    <div className={styles.card}>
                        <h3 className={styles.cardTitle}>Risk: The Trust Tax</h3>
                        <p className={styles.cardContent}>
                            When consumers spot shrinkflation, they don&rsquo;t just get annoyed. They leave. Data shows a <strong>48% Brand Abandonment Rate</strong><sup>1</sup>. In an era of high inflation, transparency isn&rsquo;t just ethical. It is a survival strategy.
                            <br /><span className="text-[10px] opacity-60 mt-2 block italic">1. Source: PLMA 2024 Consumer Study</span>
                        </p>
                    </div>

                    <div className={styles.card}>
                        <h3 className={styles.cardTitle}>Geographic Arbitrage</h3>
                        <p className={styles.cardContent}>
                            For talent acquisition, the <strong>Real Wage Gap</strong> between regions (up to 45% purchasing power differential)<sup>2</sup> offers an opportunity. Companies can offer &ldquo;lower&rdquo; nominal salaries in high-elasticity markets (TX, OH) that actually deliver higher quality of life for employees.
                            <br /><span className="text-[10px] opacity-60 mt-2 block italic">2. Implied from BEA Regional Price Parity ranges (CA: 112.6 vs MS: 87.3)</span>
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}

