'use client';

import styles from './Preamble.module.css';

export default function Preamble() {
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <p className={styles.eyebrow}>The Disconnect</p>
                    <h2 className={styles.title}>The Metric vs. The Mind</h2>
                </div>

                <div className={styles.content}>
                    <p>
                        Official inflation data isn&rsquo;t lying. It just isn&rsquo;t telling <em>your</em> truth.
                        The CPI is a diverse national average, but your life is a specific sequence of receipts.
                        When these two realities diverge, we lose faith in the system.
                    </p>

                    <div className={styles.definitions}>
                        <h3 className={styles.glossaryTitle}>The Vocabulary of Inflation</h3>
                        <dl className={styles.glossary}>
                            <div className={styles.term}>
                                <dt>Sticker Shock</dt>
                                <dd>The visceral, emotional reaction to a price that feels intuitively wrong.</dd>
                            </div>
                            <div className={styles.term}>
                                <dt>Frequency Bias</dt>
                                <dd>We notice price hikes in things we buy often (like eggs) far more than in things we buy rarely (like sofas).</dd>
                            </div>
                            <div className={styles.term}>
                                <dt>Personal Distortion Field</dt>
                                <dd>The gap between the official inflation rate and your lived financial reality.</dd>
                            </div>
                        </dl>
                    </div>

                    This distortion field creates an <strong>Invisible Tax</strong>.
                    It represents the <em>loss of trust</em>—the mental energy spent verifying prices, switching brands, and managing the anxiety of &quot;getting ripped off.&quot;
                    It is not paid to the government, but paid in stress and cognitive load.
                    Every time you see a price that defies your expectations, you pay this tax.

                    <p>
                        To understand it, we need to measure your personal baseline.
                        Let&apos;s start by testing your own reaction to recent price changes.
                    </p>
                </div>
            </div>
        </section>
    );
}
