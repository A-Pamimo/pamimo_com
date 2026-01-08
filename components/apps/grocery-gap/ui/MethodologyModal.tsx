'use client';

import { useState } from 'react';
import styles from './MethodologyModal.module.css';

interface MethodologyModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function MethodologyModal({ isOpen, onClose }: MethodologyModalProps) {
    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <button className={styles.closeButton} onClick={onClose}>×</button>

                <h2 className={styles.title}>How We Calculate Your Personal Cost Index</h2>

                <div className={styles.content}>
                    <section className={styles.section}>
                        <h3 className={styles.sectionTitle}>The Formula</h3>
                        <div className={styles.formula}>
                            <span className="font-bold text-pop">PCI</span> =
                            <span className="italic opacity-80"> Regional_CPI</span> +
                            <span className="italic opacity-80"> Freq_Bias</span> +
                            <span className="italic opacity-80"> Housing_Pressure</span>
                        </div>
                        <p className={styles.note}>
                            (Shrinkflation shown separately as &quot;Hidden Value Loss&quot;)
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h3 className={styles.sectionTitle}>1. Regional CPI (Base Rate)</h3>
                        <p className={styles.description}>
                            Your state or province&apos;s official inflation rate from government sources (BLS for US, StatCan for Canada).
                        </p>
                        <div className={styles.example}>
                            <strong>Example:</strong> Northeast US = 3.1%, South = 2.2%
                        </div>
                    </section>

                    <section className={styles.section}>
                        <h3 className={styles.sectionTitle}>2. Frequency Bias</h3>
                        <div className={styles.formulaDetail}>
                            α × (HighFreqWeight - 0.5) × BaseCPI
                        </div>
                        <p className={styles.description}>
                            Where α = 0.44 (empirically measured by Georganas et al. 2014)
                        </p>
                        <div className={styles.example}>
                            <strong>Example:</strong> If you buy groceries/gas 60% of the time and base CPI is 3%:<br />
                            → 0.44 × (0.60 - 0.50) × 3.0 = <strong>+0.13%</strong>
                        </div>
                        <p className={styles.insight}>
                            <strong>Why this matters:</strong> Your brain overweights price changes in things you buy frequently.
                            Even though groceries are only ~13% of the CPI basket, if you buy them 3x/week,
                            they feel like 30% of inflation.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h3 className={styles.sectionTitle}>3. Housing Pressure</h3>
                        <div className={styles.formulaDetail}>
                            (RentBurden / 100) × ShelterWeight × ShelterInflation
                        </div>
                        <p className={styles.description}>
                            Where ShelterWeight = 36.2% (US) or 29.1% (Canada) of CPI basket
                        </p>
                        <div className={styles.example}>
                            <strong>Example:</strong> If you spend 45% of income on rent, shelter inflation is 5%, and you&apos;re in the US:<br />
                            → 0.45 × 0.362 × 5.0 = <strong>+0.81%</strong>
                        </div>
                        <p className={styles.insight}>
                            <strong>Why this matters:</strong> If housing is eating more of your budget than the &quot;average&quot; person,
                            you&apos;ll feel inflation more acutely even if the official rate is moderate.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h3 className={styles.sectionTitle}>4. Shrinkflation (Hidden Loss)</h3>
                        <div className={styles.formulaDetail}>
                            3.9% × GroceryShare
                        </div>
                        <p className={styles.description}>
                            Based on Rojas et al. (2024) finding of 3.9pp welfare loss from package downsizing in packaged goods (2012-2021)
                        </p>
                        <div className={styles.example}>
                            <strong>Example:</strong> If groceries are 40% of your purchases:<br />
                            → 3.9 × 0.40 = <strong>1.56%</strong> hidden value loss
                        </div>
                        <p className={styles.caveat}>
                            <strong>Important caveat:</strong> This 3.9pp figure is specific to packaged goods during 2012-2021.
                            We apply it proportionally based on your grocery shopping frequency as an illustrative estimate.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h3 className={styles.sectionTitle}>Confidence Intervals</h3>
                        <p className={styles.description}>
                            The α parameter (0.44) has a standard error of approximately ±0.15 based on the original research.
                            This means your actual frequency bias could range from 0.29 to 0.59, creating a confidence interval
                            of roughly ±0.5pp around your final result.
                        </p>
                        <div className={styles.example}>
                            <strong>Example:</strong> If your PCI is 4.2%, the 95% confidence interval is approximately 3.7% - 4.7%
                        </div>
                    </section>

                    <section className={styles.disclaimer}>
                        <h3 className={styles.sectionTitle}>Important Limitations</h3>
                        <ul className={styles.limitationsList}>
                            <li>This is a <strong>stylized educational model</strong>, not a replacement for official CPI</li>
                            <li>It illustrates <strong>why perception differs from measurement</strong>, not which is &quot;more correct&quot;</li>
                            <li>The model assumes α = 0.44 applies universally (it varies by person)</li>
                            <li>Housing calculations use regional averages, not your specific rent/mortgage</li>
                            <li>Shrinkflation estimate extrapolates from packaged goods research to all groceries</li>
                            <li>Results are <strong>illustrative</strong>, showing concepts rather than precise predictions</li>
                        </ul>
                    </section>
                </div>
            </div>
        </div>
    );
}
