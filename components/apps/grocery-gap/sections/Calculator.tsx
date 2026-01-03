'use client';

import { useState, useMemo, useEffect } from 'react';
import styles from './Calculator.module.css';
import TLDR from '../ui/TLDR';
import { useRegion } from '../context/RegionContext';

// Regional Data Interfaces
interface StateOption {
    abbr: string;
    name: string;
    overallRpp: number;
    housingRpp: number;
}

const CountUp = ({ end, decimals = 0, suffix = '', className = '' }: { end: number, decimals?: number, suffix?: string, className?: string }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let start = 0;
        const duration = 1000;
        const startTime = performance.now();

        const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease out quart
            const ease = 1 - Math.pow(1 - progress, 4);

            setCount(ease * end);

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [end]);

    return <p className={className}>{count.toFixed(decimals)}{suffix}</p>;
};

// 1. Data Definitions
// Regional Averages (BEA 2023)
const REGION_AVG = {
    NE: { overallRpp: 110.4, housingRpp: 125.6 }, // Northeast
    MW: { overallRpp: 91.2, housingRpp: 75.4 },   // Midwest
    SO: { overallRpp: 95.8, housingRpp: 88.2 },   // South
    WE: { overallRpp: 106.4, housingRpp: 119.8 }, // West
};

// Full State List mapped to data or regions
const statesUS: StateOption[] = [
    // Specific Data (21 States + DC)
    { abbr: 'CA', name: 'California', overallRpp: 112.6, housingRpp: 157.8 },
    { abbr: 'NY', name: 'New York', overallRpp: 108.2, housingRpp: 139.5 },
    { abbr: 'NJ', name: 'New Jersey', overallRpp: 108.9, housingRpp: 121.4 },
    { abbr: 'HI', name: 'Hawaii', overallRpp: 108.6, housingRpp: 139.2 },
    { abbr: 'MA', name: 'Massachusetts', overallRpp: 107.8, housingRpp: 132.6 },
    { abbr: 'DC', name: 'Washington D.C.', overallRpp: 110.8, housingRpp: 145.3 },
    { abbr: 'WA', name: 'Washington', overallRpp: 105.6, housingRpp: 117.8 },
    { abbr: 'CO', name: 'Colorado', overallRpp: 104.2, housingRpp: 115.3 },
    { abbr: 'OR', name: 'Oregon', overallRpp: 102.8, housingRpp: 112.4 },
    { abbr: 'FL', name: 'Florida', overallRpp: 100.8, housingRpp: 104.2 },
    { abbr: 'AZ', name: 'Arizona', overallRpp: 99.2, housingRpp: 98.5 },
    { abbr: 'TX', name: 'Texas', overallRpp: 96.4, housingRpp: 87.2 },
    { abbr: 'GA', name: 'Georgia', overallRpp: 93.8, housingRpp: 82.6 },
    { abbr: 'NC', name: 'North Carolina', overallRpp: 94.2, housingRpp: 84.3 },
    { abbr: 'TN', name: 'Tennessee', overallRpp: 92.6, housingRpp: 79.8 },
    { abbr: 'OH', name: 'Ohio', overallRpp: 91.8, housingRpp: 74.2 },
    { abbr: 'IN', name: 'Indiana', overallRpp: 91.2, housingRpp: 72.8 },
    { abbr: 'MO', name: 'Missouri', overallRpp: 90.4, housingRpp: 71.5 },
    { abbr: 'OK', name: 'Oklahoma', overallRpp: 89.6, housingRpp: 68.4 },
    { abbr: 'AR', name: 'Arkansas', overallRpp: 86.5, housingRpp: 57.2 },
    { abbr: 'MS', name: 'Mississippi', overallRpp: 87.3, housingRpp: 54.9 },
    // Mapped States (Northeast)
    { abbr: 'CT', name: 'Connecticut', ...REGION_AVG.NE },
    { abbr: 'ME', name: 'Maine', ...REGION_AVG.NE },
    { abbr: 'NH', name: 'New Hampshire', ...REGION_AVG.NE },
    { abbr: 'RI', name: 'Rhode Island', ...REGION_AVG.NE },
    { abbr: 'VT', name: 'Vermont', ...REGION_AVG.NE },
    { abbr: 'PA', name: 'Pennsylvania', ...REGION_AVG.NE },
    // Mapped States (Midwest)
    { abbr: 'IL', name: 'Illinois', ...REGION_AVG.MW },
    { abbr: 'MI', name: 'Michigan', ...REGION_AVG.MW },
    { abbr: 'WI', name: 'Wisconsin', ...REGION_AVG.MW },
    { abbr: 'MN', name: 'Minnesota', ...REGION_AVG.MW },
    { abbr: 'IA', name: 'Iowa', ...REGION_AVG.MW },
    { abbr: 'KS', name: 'Kansas', ...REGION_AVG.MW },
    { abbr: 'NE', name: 'Nebraska', ...REGION_AVG.MW },
    { abbr: 'SD', name: 'South Dakota', ...REGION_AVG.MW },
    { abbr: 'ND', name: 'North Dakota', ...REGION_AVG.MW },
    // Mapped States (South)
    { abbr: 'VA', name: 'Virginia', ...REGION_AVG.SO },
    { abbr: 'DE', name: 'Delaware', ...REGION_AVG.SO },
    { abbr: 'MD', name: 'Maryland', ...REGION_AVG.SO },
    { abbr: 'WV', name: 'West Virginia', ...REGION_AVG.SO },
    { abbr: 'KY', name: 'Kentucky', ...REGION_AVG.SO },
    { abbr: 'SC', name: 'South Carolina', ...REGION_AVG.SO },
    { abbr: 'AL', name: 'Alabama', ...REGION_AVG.SO },
    { abbr: 'LA', name: 'Louisiana', ...REGION_AVG.SO },
    // Mapped States (West)
    { abbr: 'ID', name: 'Idaho', ...REGION_AVG.WE },
    { abbr: 'NV', name: 'Nevada', ...REGION_AVG.WE },
    { abbr: 'UT', name: 'Utah', ...REGION_AVG.WE },
    { abbr: 'MT', name: 'Montana', ...REGION_AVG.WE },
    { abbr: 'WY', name: 'Wyoming', ...REGION_AVG.WE },
    { abbr: 'AK', name: 'Alaska', ...REGION_AVG.WE }, // Usually outlier, but mapping to West Avg for now
    { abbr: 'NM', name: 'New Mexico', ...REGION_AVG.WE },
].sort((a, b) => a.name.localeCompare(b.name));

const provincesCA: StateOption[] = [
    { abbr: 'BC', name: 'British Columbia', overallRpp: 112.4, housingRpp: 145.2 },
    { abbr: 'ON', name: 'Ontario', overallRpp: 110.6, housingRpp: 142.1 },
    { abbr: 'AB', name: 'Alberta', overallRpp: 111.3, housingRpp: 105.4 },
    { abbr: 'QC', name: 'Quebec', overallRpp: 93.1, housingRpp: 85.2 },
    { abbr: 'NS', name: 'Nova Scotia', overallRpp: 101.8, housingRpp: 95.1 },
    { abbr: 'MB', name: 'Manitoba', mbmIndex: 94.2, housingRpp: 86.5 } as any, // Fix type mismatch manually if needed, or stick to interface
    { abbr: 'SK', name: 'Saskatchewan', overallRpp: 95.4, housingRpp: 84.1 },
    { abbr: 'NB', name: 'New Brunswick', overallRpp: 92.5, housingRpp: 78.4 },
    { abbr: 'NL', name: 'Newfoundland & Lab.', overallRpp: 100.5, housingRpp: 86.2 },
    { abbr: 'PE', name: 'P.E.I.', overallRpp: 96.3, housingRpp: 88.5 },
].sort((a, b) => a.name.localeCompare(b.name));

interface FrequencyInput {
    id: string;
    label: string;
    baseWeight: number;
    value: number; // 1-5 scale: 1=rarely, 5=very often
}

const FREQUENCY_LABELS = ['Rarely', 'Monthly', 'Weekly', 'Several/week', 'Daily'];
const OFFICIAL_CPI = 3.4;

export default function Calculator() {
    const { region } = useRegion();
    const isCanada = region.code === 'CA';
    const locationOptions = isCanada ? provincesCA : statesUS;
    const officialCPI = isCanada ? 2.4 : 3.4;

    const [step, setStep] = useState(1);
    const [selectedState, setSelectedState] = useState<StateOption | null>(null);
    const [frequencies, setFrequencies] = useState<Record<string, number>>({
        groceries: 4,
        gasoline: 3,
        restaurants: 3,
        utilities: 2,
        healthcare: 2,
        shopping: 2,
    });
    const [housingType, setHousingType] = useState<'rent' | 'own' | null>(null);
    const [mortgageRenewed, setMortgageRenewed] = useState(false);
    const [rentPercent, setRentPercent] = useState(30);
    const [showResults, setShowResults] = useState(false);

    // Persistence
    useEffect(() => {
        const saved = localStorage.getItem('groceryGap_calcState');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (parsed.selectedState) setSelectedState(parsed.selectedState);
                if (parsed.frequencies) setFrequencies(parsed.frequencies);
                if (parsed.housingType) setHousingType(parsed.housingType);
                if (parsed.rentPercent) setRentPercent(parsed.rentPercent);
            } catch (e) {
                console.error('Failed to load saved state');
            }
        }
    }, []);

    useEffect(() => {
        if (selectedState || housingType) {
            localStorage.setItem('groceryGap_calcState', JSON.stringify({
                selectedState,
                frequencies,
                housingType,
                rentPercent
            }));
        }
    }, [selectedState, frequencies, housingType, rentPercent]);

    const frequencyItems: FrequencyInput[] = [
        { id: 'groceries', label: 'Groceries', baseWeight: 13.5, value: frequencies.groceries },
        { id: 'gasoline', label: 'Gasoline', baseWeight: 3.4, value: frequencies.gasoline },
        { id: 'restaurants', label: 'Restaurants', baseWeight: 5.6, value: frequencies.restaurants },
        { id: 'utilities', label: 'Utilities', baseWeight: 2.5, value: frequencies.utilities },
        { id: 'healthcare', label: 'Healthcare', baseWeight: 8.1, value: frequencies.healthcare },
        { id: 'shopping', label: 'Shopping', baseWeight: 2.5, value: frequencies.shopping },
    ];

    const handleFrequencyChange = (id: string, value: number) => {
        setFrequencies(prev => ({ ...prev, [id]: value }));
    };

    const loadSampleData = () => {
        setSelectedState(isCanada ? provincesCA[1] : statesUS.find(s => s.abbr === 'NY')!); // Ontario or NY
        setFrequencies({
            groceries: 5,
            gasoline: 3,
            restaurants: 4,
            utilities: 3,
            healthcare: 2,
            shopping: 3,
        });
        setHousingType('rent');
        setRentPercent(45);
        setShowResults(true);
        setStep(3);
        // Scroll to results top if needed, but the render switch happens instantly
    };

    const results = useMemo(() => {
        if (!selectedState || !housingType) return null;

        const baseInflation = officialCPI;

        const alpha = 0.44;
        const totalFreq = Object.values(frequencies).reduce((a, b) => a + b, 0);
        const highFreqItems = ['groceries', 'gasoline', 'restaurants'];
        const highFreqWeight = highFreqItems.reduce((a, id) => a + frequencies[id], 0) / totalFreq;
        const frequencyBiasMultiplier = 1 + (alpha * (highFreqWeight - 0.5));

        const regionalMultiplier = selectedState.overallRpp / 100;

        let housingAdjustment = 1.0;
        if (housingType === 'rent') {
            housingAdjustment = (selectedState.housingRpp / 100) * (rentPercent / 30);
        } else if (housingType === 'own' && isCanada && mortgageRenewed) {
            housingAdjustment = (selectedState.housingRpp / 100) * 1.4;
        }

        const groceryShare = frequencies.groceries / totalFreq;
        const shrinkflationAdd = 3.9 * groceryShare;

        const perceivedInflation = baseInflation
            * frequencyBiasMultiplier
            * ((regionalMultiplier + housingAdjustment) / 2)
            + shrinkflationAdd;

        return {
            perceived: Math.max(perceivedInflation, officialCPI),
            official: officialCPI,
            breakdown: {
                base: baseInflation,
                frequencyBias: (frequencyBiasMultiplier - 1) * baseInflation,
                regional: ((regionalMultiplier - 1) * baseInflation),
                housing: housingType !== 'own' ? ((housingAdjustment - 1) * baseInflation * 0.3) : 0,
                mortgageShock: (housingType === 'own' && isCanada && mortgageRenewed) ? ((housingAdjustment - 1) * baseInflation * 0.3) : 0,
                shrinkflation: shrinkflationAdd,
            },
        };
    }, [selectedState, housingType, officialCPI, frequencies, rentPercent, isCanada, mortgageRenewed]);

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div className={styles.stepContent}>
                        <h3 className={styles.stepTitle}>Where do you live?</h3>
                        <div className="flex flex-col gap-4">
                            <div className={styles.selectWrapper}>
                                <select
                                    className={styles.select}
                                    value={selectedState?.abbr || ''}
                                    onChange={(e) => {
                                        const state = locationOptions.find(s => s.abbr === e.target.value);
                                        setSelectedState(state || null);
                                    }}
                                >
                                    <option value="">Select your {isCanada ? 'province' : 'state'}...</option>
                                    {locationOptions.map(state => (
                                        <option key={state.abbr} value={state.abbr}>
                                            {state.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <button
                                onClick={loadSampleData}
                                className="text-xs text-theme-text opacity-50 underline hover:opacity-100 transition-opacity self-center"
                            >
                                Skip & See Sample Results
                            </button>
                        </div>

                        <p className="text-[10px] text-theme-text opacity-50 mt-4 font-mono">
                            {isCanada
                                ? "* Uses latest StatsCan regional price indices."
                                : "* Includes all 50 states. Some states use regional averages where specific BLS data is unavailable."}
                        </p>

                        {selectedState && (
                            <div className={styles.locationPreview}>
                                <span className={styles.previewLabel}>Regional Price Level</span>
                                <span className={styles.previewValue}>
                                    {selectedState.overallRpp > 100
                                        ? `+${(selectedState.overallRpp - 100).toFixed(0)}% above average`
                                        : `${(100 - selectedState.overallRpp).toFixed(0)}% below average`
                                    }
                                </span>
                            </div>
                        )}
                    </div>
                );

            case 2:
                return (
                    <div className={styles.stepContent}>
                        <h3 className={styles.stepTitle}>How often do you purchase?</h3>
                        <p className="text-sm opacity-70 mb-4">
                            We use your location and purchase frequency to calculate your unique inflation experience.
                        </p>
                        <div className={styles.frequencyGrid}>
                            {frequencyItems.map(item => (
                                <div key={item.id} className={styles.frequencyItem}>
                                    <span className={styles.frequencyLabel}>{item.label}</span>
                                    <input
                                        type="range"
                                        min="1"
                                        max="5"
                                        value={frequencies[item.id]}
                                        onChange={(e) => handleFrequencyChange(item.id, parseInt(e.target.value))}
                                        className={styles.frequencySlider}
                                    />
                                    <span className={styles.frequencyValue}>
                                        {FREQUENCY_LABELS[frequencies[item.id] - 1]}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div className={styles.stepContent}>
                        <h3 className={styles.stepTitle}>Your housing situation</h3>
                        <div className={styles.housingOptions}>
                            <button
                                className={`${styles.housingOption} ${housingType === 'rent' ? styles.housingOptionActive : ''}`}
                                onClick={() => setHousingType('rent')}
                            >
                                <span className={styles.housingOptionLabel}>I Rent</span>
                            </button>
                            <button
                                className={`${styles.housingOption} ${housingType === 'own' ? styles.housingOptionActive : ''}`}
                                onClick={() => setHousingType('own')}
                            >
                                <span className={styles.housingOptionLabel}>I Own</span>
                            </button>
                        </div>
                        {housingType === 'rent' && (
                            <>
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={rentPercent}
                                    onChange={(e) => setRentPercent(parseInt(e.target.value) || 0)}
                                    className={styles.rentInput}
                                />
                                <p className={styles.rentLabel}>% of income going to rent</p>
                            </>
                        )}
                        {housingType === 'own' && isCanada && (
                            <div className="mt-4 p-4 border border-red-500/20 bg-red-500/5 rounded-lg">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={mortgageRenewed}
                                        onChange={(e) => setMortgageRenewed(e.target.checked)}
                                        className="w-5 h-5 accent-red-600"
                                    />
                                    <div className="text-left">
                                        <span className="block text-sm font-bold text-theme-text opacity-90">Mortgage Renewing?</span>
                                        <span className="block text-[10px] text-theme-text opacity-60">
                                            (Variable rate or 5-yr fixed renewal after 2023)
                                        </span>
                                    </div>
                                </label>
                            </div>
                        )}
                    </div>
                );

            default:
                return null;
        }
    };

    if (showResults && results) {
        return (
            <section className={styles.section}>
                <div className={styles.container}>
                    <div className={styles.header}>
                        <p className={styles.eyebrow}>Your Results</p>
                        <h2 className={styles.title}>Your Personal Cost Index</h2>
                    </div>

                    <div className={styles.form}>
                        <div className={styles.results}>
                            <div className={styles.resultsBig}>
                                <p className={styles.resultsLabel}>Your Perceived Inflation</p>
                                <CountUp end={results.perceived} decimals={1} suffix="%" className={styles.resultsNumber} />
                            </div>

                            <div className={styles.resultsComparison}>
                                <div className={styles.comparisonItem}>
                                    <p className={`${styles.comparisonValue} ${styles.comparisonValueOfficial}`}>
                                        {results.official.toFixed(1)}%
                                    </p>
                                    <p className={styles.comparisonLabel}>
                                        Official CPI
                                        <span className="block text-[9px] opacity-60 font-mono mt-0.5">(Source: BLS)</span>
                                    </p>
                                </div>
                                <div className={styles.comparisonItem}>
                                    <p className={styles.comparisonValue}>
                                        {(results.perceived / results.official).toFixed(1)}x
                                    </p>
                                    <p className={styles.comparisonLabel}>Your Multiplier</p>
                                </div>
                            </div>

                            <div className={styles.resultsBreakdown}>
                                <p className={styles.breakdownTitle}>What drives your perception</p>
                                <div className={styles.breakdownItem}>
                                    <span className={styles.breakdownLabel}>Base inflation</span>
                                    <span className={styles.breakdownValue}>+{results.breakdown.base.toFixed(1)}%</span>
                                </div>
                                <div className={styles.breakdownItem}>
                                    <span className={styles.breakdownLabel}>Price Memory</span>
                                    <span className={styles.breakdownValue}>+{results.breakdown.frequencyBias.toFixed(1)}%</span>
                                </div>
                                <div className={styles.breakdownItem}>
                                    <span className={styles.breakdownLabel}>Regional adjustment</span>
                                    <span className={styles.breakdownValue}>
                                        {results.breakdown.regional >= 0 ? '+' : ''}{results.breakdown.regional.toFixed(1)}%
                                    </span>
                                </div>
                                {housingType === 'rent' && (
                                    <div className={styles.breakdownItem}>
                                        <span className={styles.breakdownLabel}>Housing pressure</span>
                                        <span className={styles.breakdownValue}>+{results.breakdown.housing.toFixed(1)}%</span>
                                    </div>
                                )}
                                {housingType === 'own' && isCanada && mortgageRenewed && (
                                    <div className={styles.breakdownItem}>
                                        <span className={styles.breakdownLabel}>Mortgage Shock</span>
                                        <span className={`${styles.breakdownValue} text-red-500`}>+{results.breakdown.mortgageShock.toFixed(1)}%</span>
                                    </div>
                                )}
                                <div className={styles.breakdownItem}>
                                    <span className={styles.breakdownLabel}>Shrinkflation</span>
                                    <span className={styles.breakdownValue}>+{results.breakdown.shrinkflation.toFixed(1)}%</span>
                                </div>
                            </div>

                            <div className="mt-8 p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                                <h4 className="text-xs font-bold uppercase tracking-widest mb-2 text-pop">Pro Tip: Negotiation</h4>
                                <p className="text-sm text-theme-text opacity-80 leading-relaxed">
                                    Official CPI says inflation is {results.official.toFixed(1)}%, so your boss might offer a matching raise.
                                    But your <strong className="text-theme-text">personal</strong> inflation is {results.perceived.toFixed(1)}%.
                                    Use this gap to argue for a cost-of-living adjustment that reflects your <em>actual</em> reality.
                                </p>
                            </div>

                            <div className={styles.shareButtons}>
                                <button
                                    className={`${styles.shareButton} ${styles.shareButtonPrimary}`}
                                    onClick={() => {
                                        const text = `My perceived inflation is ${results.perceived.toFixed(1)}% vs the official ${results.official.toFixed(1)}% CPI. That's a ${(results.perceived / results.official).toFixed(1)}x gap! Find yours at The Grocery Gap.`;
                                        navigator.clipboard.writeText(text);
                                        alert('Copied to clipboard!');
                                    }}
                                >
                                    Share Result
                                </button>
                                <button
                                    className={`${styles.shareButton} ${styles.shareButtonSecondary}`}
                                    onClick={() => {
                                        setShowResults(false);
                                        setStep(1);
                                    }}
                                >
                                    Start Over
                                </button>
                            </div>

                            <div className="mt-8 pt-8 border-t border-ink/10 dark:border-white/10 text-center">
                                <p className="text-sm font-bold mb-4">Get monthly economic insights</p>
                                <form className="flex gap-2 max-w-sm mx-auto" onSubmit={(e) => { e.preventDefault(); alert('Thanks for subscribing!'); }}>
                                    <input
                                        type="email"
                                        placeholder="email@example.com"
                                        className="flex-1 bg-white dark:bg-black border border-ink/20 px-3 py-2 text-sm font-mono"
                                        required
                                    />
                                    <button type="submit" className="bg-ink text-white dark:bg-white dark:text-ink px-4 py-2 text-xs font-bold uppercase tracking-widest hover:opacity-80">
                                        Join
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section >
        );
    }

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <p className={styles.eyebrow}>Personal Calculator</p>
                    <h2 className={styles.title}>What&apos;s Your Grocery Gap?</h2>
                    <p className={styles.subtitle}>
                        Answer a few questions to estimate your personal cost index
                        based on where you live and how you shop.
                    </p>
                    <TLDR source="Kahneman & Tversky, Prospect Theory">
                        Calculate your own personal inflation rate based on your actual spending habits. It is likely different from the official number.
                    </TLDR>
                </div>

                <div className={styles.form}>
                    <div className="text-center mb-6">
                        <span className="inline-block px-3 py-1 bg-ink/5 dark:bg-white/10 rounded-full text-xs font-bold uppercase tracking-widest text-ink dark:text-white mb-2">
                            Step {step} of 3
                        </span>
                    </div>
                    <div className={styles.stepIndicator}>
                        {[
                            { step: 1, label: 'Location' },
                            { step: 2, label: 'Habits' },
                            { step: 3, label: 'Housing' }
                        ].map(item => (
                            <div
                                key={item.step}
                                className={`${styles.stepItem} ${step === item.step ? styles.stepItemActive : step > item.step ? styles.stepItemComplete : ''}`}
                            >
                                <div className={styles.stepDot} />
                                <span className={styles.stepLabel}>{item.label}</span>
                            </div>
                        ))}
                    </div>

                    {renderStep()}

                    <div className={styles.nav}>
                        <button
                            className={`${styles.navButton} ${styles.navButtonSecondary}`}
                            onClick={() => step > 1 && setStep(step - 1)}
                            style={{ visibility: step === 1 ? 'hidden' : 'visible' }}
                        >
                            Back
                        </button>
                        <button
                            className={`${styles.navButton} ${styles.navButtonPrimary}`}
                            onClick={() => {
                                if (step < 3) {
                                    setStep(step + 1);
                                } else if (housingType) {
                                    setShowResults(true);
                                }
                            }}
                            disabled={
                                (step === 1 && !selectedState) ||
                                (step === 3 && !housingType)
                            }
                        >
                            {step === 3 ? 'Calculate' : 'Next'}
                        </button>
                    </div>
                    <p className="text-center text-[10px] opacity-50 mt-4 max-w-xs mx-auto">
                        Your inputs are processed locally to generate your Personal Cost Index. No personal financial data is stored.
                    </p>
                </div>
            </div>
        </section>
    );
}
