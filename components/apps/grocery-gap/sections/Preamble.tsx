'use client';

import styles from './Preamble.module.css';
import Image from 'next/image';

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
                    It represents the <em>loss of trust</em> - the mental energy spent verifying prices, switching brands, and managing the anxiety of &quot;getting ripped off.&quot;
                    It is not paid to the government, but paid in stress and cognitive load.
                    Every time you see a price that defies your expectations, you pay this tax.
                </div>

                {/* Meme: The Frequency Bias Hook */}
                <div className="max-w-sm mx-auto w-full border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] -rotate-1 mt-12 mb-4">
                    <div className="relative w-full aspect-[4/3]">
                        <Image
                            src="/images/frequency_bias_meat_meme.jpg"
                            alt="What inflation? A package of hamburger meat costs the same as it did last month meme"
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 400px"
                        />
                    </div>
                    <div className="bg-black text-white p-3 text-center">
                        <p className="text-sm font-bold uppercase tracking-wider">Your Brain: &quot;Everything&apos;s Fine!&quot;</p>
                        <p className="text-xs mt-1 opacity-80">When you see the same price but ignore the shrinking package</p>
                    </div>
                </div>

                <p>
                    To understand it, we need to measure your personal baseline.
                    Let&apos;s start by testing your own reaction to recent price changes.
                </p>
            </div>
        </section>
    );
}
