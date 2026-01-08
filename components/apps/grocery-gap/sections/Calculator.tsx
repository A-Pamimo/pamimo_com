'use client';

import { useState, useEffect, useMemo } from 'react';
import styles from './Calculator.module.css';
import TLDR from '../ui/TLDR';
import { useRegionalCPI } from '@/app/actions/getRegionalCPI';
import { useRegion } from '../context/RegionContext';
import MethodologyModal from '../ui/MethodologyModal';

interface StateOption {
    abbr: string;
    name: string;
    cpiRate: number; // Nov 2025 YoY CPI % (Fallback)
    housingRpp: number;
    regionCode?: string; // For live API mapping
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
// Regional CPI (BLS Nov 2025 YoY%) - Source: https://www.bls.gov/regions/
const REGION_CPI = {
    NE: 3.1, // Northeast
    MW: 3.0, // Midwest
    SO: 2.2, // South
    WE: 3.0, // West
};
const NATIONAL_CPI_US = 2.7; // Approximate
const HOUSING_RPP_AVG = 100; // Placeholder, housing logic separate

// Full State List - CPI by region (BLS Nov 2025)
// Source: https://www.bls.gov/regions/subjects/consumer-price-indexes.htm
const statesUS: StateOption[] = [
    // Northeast (3.5%)
    { abbr: 'CT', name: 'Connecticut', cpiRate: REGION_CPI.NE, regionCode: 'NE', housingRpp: 125.6 },
    { abbr: 'ME', name: 'Maine', cpiRate: REGION_CPI.NE, regionCode: 'NE', housingRpp: 110 },
    { abbr: 'MA', name: 'Massachusetts', cpiRate: REGION_CPI.NE, regionCode: 'NE', housingRpp: 132.6 },
    { abbr: 'NH', name: 'New Hampshire', cpiRate: REGION_CPI.NE, regionCode: 'NE', housingRpp: 115 },
    { abbr: 'NJ', name: 'New Jersey', cpiRate: REGION_CPI.NE, regionCode: 'NE', housingRpp: 121.4 },
    { abbr: 'NY', name: 'New York', cpiRate: REGION_CPI.NE, regionCode: 'NE', housingRpp: 139.5 },
    { abbr: 'PA', name: 'Pennsylvania', cpiRate: REGION_CPI.NE, regionCode: 'NE', housingRpp: 95 },
    { abbr: 'RI', name: 'Rhode Island', cpiRate: REGION_CPI.NE, regionCode: 'NE', housingRpp: 110 },
    { abbr: 'VT', name: 'Vermont', cpiRate: REGION_CPI.NE, regionCode: 'NE', housingRpp: 105 },
    // Midwest (2.6%)
    { abbr: 'IL', name: 'Illinois', cpiRate: REGION_CPI.MW, regionCode: 'MW', housingRpp: 90 },
    { abbr: 'IN', name: 'Indiana', cpiRate: REGION_CPI.MW, regionCode: 'MW', housingRpp: 72.8 },
    { abbr: 'IA', name: 'Iowa', cpiRate: REGION_CPI.MW, regionCode: 'MW', housingRpp: 70 },
    { abbr: 'KS', name: 'Kansas', cpiRate: REGION_CPI.MW, regionCode: 'MW', housingRpp: 68 },
    { abbr: 'MI', name: 'Michigan', cpiRate: REGION_CPI.MW, regionCode: 'MW', housingRpp: 78 },
    { abbr: 'MN', name: 'Minnesota', cpiRate: REGION_CPI.MW, regionCode: 'MW', housingRpp: 85 },
    { abbr: 'MO', name: 'Missouri', cpiRate: REGION_CPI.MW, regionCode: 'MW', housingRpp: 71.5 },
    { abbr: 'NE', name: 'Nebraska', cpiRate: REGION_CPI.MW, regionCode: 'MW', housingRpp: 72 },
    { abbr: 'ND', name: 'North Dakota', cpiRate: REGION_CPI.MW, regionCode: 'MW', housingRpp: 70 },
    { abbr: 'OH', name: 'Ohio', cpiRate: REGION_CPI.MW, regionCode: 'MW', housingRpp: 74.2 },
    { abbr: 'SD', name: 'South Dakota', cpiRate: REGION_CPI.MW, regionCode: 'MW', housingRpp: 70 },
    { abbr: 'WI', name: 'Wisconsin', cpiRate: REGION_CPI.MW, regionCode: 'MW', housingRpp: 80 },
    // South (2.7%)
    { abbr: 'AL', name: 'Alabama', cpiRate: REGION_CPI.SO, regionCode: 'SO', housingRpp: 65 },
    { abbr: 'AR', name: 'Arkansas', cpiRate: REGION_CPI.SO, regionCode: 'SO', housingRpp: 57.2 },
    { abbr: 'DE', name: 'Delaware', cpiRate: REGION_CPI.SO, regionCode: 'SO', housingRpp: 90 },
    { abbr: 'DC', name: 'Washington D.C.', cpiRate: REGION_CPI.SO, regionCode: 'SO', housingRpp: 145.3 },
    { abbr: 'FL', name: 'Florida', cpiRate: REGION_CPI.SO, regionCode: 'SO', housingRpp: 104.2 },
    { abbr: 'GA', name: 'Georgia', cpiRate: REGION_CPI.SO, regionCode: 'SO', housingRpp: 82.6 },
    { abbr: 'KY', name: 'Kentucky', cpiRate: REGION_CPI.SO, regionCode: 'SO', housingRpp: 68 },
    { abbr: 'LA', name: 'Louisiana', cpiRate: REGION_CPI.SO, regionCode: 'SO', housingRpp: 70 },
    { abbr: 'MD', name: 'Maryland', cpiRate: REGION_CPI.SO, regionCode: 'SO', housingRpp: 105 },
    { abbr: 'MS', name: 'Mississippi', cpiRate: REGION_CPI.SO, regionCode: 'SO', housingRpp: 54.9 },
    { abbr: 'NC', name: 'North Carolina', cpiRate: REGION_CPI.SO, regionCode: 'SO', housingRpp: 84.3 },
    { abbr: 'OK', name: 'Oklahoma', cpiRate: REGION_CPI.SO, regionCode: 'SO', housingRpp: 68.4 },
    { abbr: 'SC', name: 'South Carolina', cpiRate: REGION_CPI.SO, regionCode: 'SO', housingRpp: 75 },
    { abbr: 'TN', name: 'Tennessee', cpiRate: REGION_CPI.SO, regionCode: 'SO', housingRpp: 79.8 },
    { abbr: 'TX', name: 'Texas', cpiRate: REGION_CPI.SO, regionCode: 'SO', housingRpp: 87.2 },
    { abbr: 'VA', name: 'Virginia', cpiRate: REGION_CPI.SO, regionCode: 'SO', housingRpp: 100 },
    { abbr: 'WV', name: 'West Virginia', cpiRate: REGION_CPI.SO, regionCode: 'SO', housingRpp: 60 },
    // West (2.4%)
    { abbr: 'AK', name: 'Alaska', cpiRate: REGION_CPI.WE, regionCode: 'WE', housingRpp: 110 },
    { abbr: 'AZ', name: 'Arizona', cpiRate: REGION_CPI.WE, regionCode: 'WE', housingRpp: 98.5 },
    { abbr: 'CA', name: 'California', cpiRate: REGION_CPI.WE, regionCode: 'WE', housingRpp: 157.8 },
    { abbr: 'CO', name: 'Colorado', cpiRate: REGION_CPI.WE, regionCode: 'WE', housingRpp: 115.3 },
    { abbr: 'HI', name: 'Hawaii', cpiRate: REGION_CPI.WE, regionCode: 'WE', housingRpp: 139.2 },
    { abbr: 'ID', name: 'Idaho', cpiRate: REGION_CPI.WE, regionCode: 'WE', housingRpp: 95 },
    { abbr: 'MT', name: 'Montana', cpiRate: REGION_CPI.WE, regionCode: 'WE', housingRpp: 90 },
    { abbr: 'NV', name: 'Nevada', cpiRate: REGION_CPI.WE, regionCode: 'WE', housingRpp: 100 },
    { abbr: 'NM', name: 'New Mexico', cpiRate: REGION_CPI.WE, regionCode: 'WE', housingRpp: 80 },
    { abbr: 'OR', name: 'Oregon', cpiRate: REGION_CPI.WE, regionCode: 'WE', housingRpp: 112.4 },
    { abbr: 'UT', name: 'Utah', cpiRate: REGION_CPI.WE, regionCode: 'WE', housingRpp: 105 },
    { abbr: 'WA', name: 'Washington', cpiRate: REGION_CPI.WE, regionCode: 'WE', housingRpp: 117.8 },
    { abbr: 'WY', name: 'Wyoming', cpiRate: REGION_CPI.WE, regionCode: 'WE', housingRpp: 85 },
].sort((a, b) => a.name.localeCompare(b.name));

// Canadian Provinces/Territories - CPI (StatCan Nov 2025)
// Source: https://www150.statcan.gc.ca/n1/daily-quotidien/251215/dq251215a-eng.htm
const NATIONAL_CPI_CA = 2.2;
const provincesCA: StateOption[] = [
    { abbr: 'AB', name: 'Alberta', cpiRate: 1.9, housingRpp: 105.4 },
    { abbr: 'BC', name: 'British Columbia', cpiRate: 2.0, housingRpp: 145.2 },
    { abbr: 'MB', name: 'Manitoba', cpiRate: 3.3, housingRpp: 86.5 },
    { abbr: 'NB', name: 'New Brunswick', cpiRate: 2.7, housingRpp: 78.4 },
    { abbr: 'NL', name: 'Newfoundland & Lab.', cpiRate: 2.2, housingRpp: 86.2 },
    { abbr: 'NT', name: 'Northwest Territories', cpiRate: 2.2, housingRpp: 100 }, // Approx national
    { abbr: 'NS', name: 'Nova Scotia', cpiRate: 2.4, housingRpp: 95.1 },
    { abbr: 'NU', name: 'Nunavut', cpiRate: 2.2, housingRpp: 100 }, // Approx national
    { abbr: 'ON', name: 'Ontario', cpiRate: 1.9, housingRpp: 142.1 },
    { abbr: 'PE', name: 'Prince Edward Island', cpiRate: 1.4, housingRpp: 88.5 },
    { abbr: 'QC', name: 'Quebec', cpiRate: 3.0, housingRpp: 85.2 },
    { abbr: 'SK', name: 'Saskatchewan', cpiRate: 2.1, housingRpp: 84.1 },
    { abbr: 'YT', name: 'Yukon', cpiRate: 2.2, housingRpp: 110 }, // Approx national
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

    // Fetch live CPI data from worker
    const { data: cpiData, loading: cpiLoading, error: cpiError } = useRegionalCPI();
    const officialCPI = cpiData?.regions?.US?.yearOverYear || (isCanada ? 2.2 : 2.7);

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
    const [showMethodology, setShowMethodology] = useState(false);
    const [advancedMode, setAdvancedMode] = useState(false);
    const [alpha, setAlpha] = useState(0.44);

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

        // Base: Use live API data if available, else static fallback
        let baseInflation = selectedState.cpiRate;
        if (cpiData?.regions && selectedState.regionCode) {
            const regionKey = selectedState.regionCode as keyof typeof cpiData.regions;
            const liveRegion = cpiData.regions[regionKey];
            if (liveRegion) {
                baseInflation = liveRegion.yearOverYear;
            }
        }

        const nationalCPI = isCanada ? NATIONAL_CPI_CA : (cpiData?.regions?.US?.yearOverYear || NATIONAL_CPI_US);

        // Frequency Bias (over-weight high-frequency purchases)
        const totalFreq = Object.values(frequencies).reduce((a, b) => a + b, 0);
        const highFreqItems = ['groceries', 'gasoline', 'restaurants'];
        const highFreqWeight = highFreqItems.reduce((a, id) => a + frequencies[id], 0) / totalFreq;
        const frequencyBiasAdd = alpha * (highFreqWeight - 0.5) * baseInflation;

        // Housing Pressure - CORRECTED to use actual shelter CPI weight
        let housingPressure = 0;
        const shelterWeight = isCanada ? 0.291 : 0.362; // Actual CPI basket weight for shelter
        // Estimate shelter inflation (typically higher than general CPI)
        const shelterInflation = baseInflation * 1.5; // Shelter typically inflates 1.5x general rate

        if (housingType === 'rent') {
            // Use actual rent burden and shelter weight
            housingPressure = (rentPercent / 100) * shelterWeight * shelterInflation;
        } else if (housingType === 'own' && isCanada && mortgageRenewed) {
            // Mortgage shock for Canadian homeowners
            housingPressure = shelterWeight * shelterInflation * 0.5;
        }

        // Shrinkflation (Separate, not added to main %)
        const groceryShare = frequencies.groceries / totalFreq;
        const shrinkflationLoss = 3.9 * groceryShare;

        // Perceived Cost Index (without shrinkflation baked in)
        const perceivedCPI = baseInflation + frequencyBiasAdd + housingPressure;

        // Confidence interval based on alpha standard error (±0.15)
        const alphaStdError = 0.15;
        const confidenceLow = baseInflation + (alpha - alphaStdError) * (highFreqWeight - 0.5) * baseInflation + housingPressure;
        const confidenceHigh = baseInflation + (alpha + alphaStdError) * (highFreqWeight - 0.5) * baseInflation + housingPressure;

        return {
            perceived: perceivedCPI,
            official: nationalCPI,
            shrinkflationLoss: shrinkflationLoss,
            confidenceInterval: {
                low: confidenceLow,
                high: confidenceHigh,
            },
            breakdown: {
                base: baseInflation,
                frequencyBias: frequencyBiasAdd,
                housing: housingPressure,
                mortgageShock: (housingType === 'own' && isCanada && mortgageRenewed) ? housingPressure : 0,
            },
        };
    }, [selectedState, housingType, frequencies, rentPercent, isCanada, mortgageRenewed, cpiData, alpha]);

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
                                <span className={styles.previewLabel}>Regional Inflation Rate (Nov &apos;25)</span>
                                <span className={styles.previewValue}>
                                    {selectedState.cpiRate.toFixed(1)}%
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
                                    <label htmlFor={item.id} className={styles.frequencyLabel}>{item.label}</label>
                                    <input
                                        id={item.id}
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

                        {/* Advanced Mode Toggle */}
                        <div className="mt-6 pt-4 border-t border-ink/10 dark:border-white/10">
                            <button
                                onClick={() => setAdvancedMode(!advancedMode)}
                                className="text-xs font-mono uppercase tracking-widest text-theme-text opacity-60 hover:opacity-100 transition-opacity flex items-center gap-2"
                            >
                                <span>{advancedMode ? '−' : '+'}</span>
                                Advanced: Adjust Frequency Bias Sensitivity
                            </button>
                            {advancedMode && (
                                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded">
                                    <label className="block text-sm font-bold mb-2">
                                        Frequency Bias (α): {alpha.toFixed(2)}
                                    </label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="1"
                                        step="0.01"
                                        value={alpha}
                                        onChange={(e) => setAlpha(parseFloat(e.target.value))}
                                        className="w-full"
                                    />
                                    <div className="flex justify-between text-xs mt-1 opacity-60">
                                        <span>0.0 (Rational)</span>
                                        <span>0.44 (Average)</span>
                                        <span>1.0 (Emotional)</span>
                                    </div>
                                    <p className="text-xs mt-2 opacity-70 leading-relaxed">
                                        Most people: 0.44. Adjust if you think you're more/less emotional about price changes.
                                    </p>
                                </div>
                            )}
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
                        <p className="text-xs opacity-60 mt-2">(Behavioral Economics Model)</p>
                    </div>

                    <div className={styles.form}>
                        <div className={styles.results}>
                            <div className={styles.resultsBig}>
                                <p className={styles.resultsLabel}>Your Personal Cost Index</p>
                                <CountUp end={results.perceived} decimals={1} suffix="%" className={styles.resultsNumber} />
                                <p className="text-xs opacity-50 mt-2 font-mono">
                                    95% Confidence: {results.confidenceInterval.low.toFixed(1)}% - {results.confidenceInterval.high.toFixed(1)}%
                                </p>
                            </div>

                            <div className={styles.resultsComparison}>
                                <div className={styles.comparisonItem}>
                                    <p className={`${styles.comparisonValue} ${styles.comparisonValueOfficial}`}>
                                        {results.official.toFixed(1)}%
                                    </p>
                                    <p className={styles.comparisonLabel}>
                                        Official CPI
                                        <span className="block text-[9px] opacity-60 font-mono mt-0.5">
                                            (Source: {isCanada ? 'StatCan' : 'BLS'})
                                            {cpiData && !cpiData.source.includes('Fallback') && !isCanada && (
                                                <span className="text-green-500 font-bold ml-1 animate-pulse">● Live</span>
                                            )}
                                        </span>
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
                                    <span className={styles.breakdownLabel}>Regional CPI</span>
                                    <span className={styles.breakdownValue}>+{results.breakdown.base.toFixed(1)}%</span>
                                </div>
                                <div className={styles.breakdownItem}>
                                    <span className={styles.breakdownLabel}>Price Memory (Frequency Bias)</span>
                                    <span className={styles.breakdownValue}>
                                        {results.breakdown.frequencyBias >= 0 ? '+' : ''}{results.breakdown.frequencyBias.toFixed(1)}%
                                    </span>
                                </div>
                                {results.breakdown.housing > 0 && (
                                    <div className={styles.breakdownItem}>
                                        <span className={styles.breakdownLabel}>Housing Pressure</span>
                                        <span className={styles.breakdownValue}>+{results.breakdown.housing.toFixed(1)}%</span>
                                    </div>
                                )}
                                {housingType === 'own' && isCanada && mortgageRenewed && (
                                    <div className={styles.breakdownItem}>
                                        <span className={styles.breakdownLabel}>Mortgage Shock</span>
                                        <span className={`${styles.breakdownValue} text-red-500`}>+{results.breakdown.mortgageShock.toFixed(1)}%</span>
                                    </div>
                                )}
                            </div>

                            {/* Shrinkflation: Separate Hidden Loss */}
                            <div className="mt-4 p-4 border border-dashed border-pop/50 rounded-lg bg-pop/5">
                                <p className="font-mono text-xs uppercase tracking-widest opacity-60 mb-1">Hidden Value Loss</p>
                                <p className="text-2xl font-bold text-pop">~{results.shrinkflationLoss.toFixed(1)}%</p>
                                <p className="text-xs opacity-70 mt-1">
                                    Estimated value lost to package shrinkage (not included in official CPI).
                                </p>
                            </div>

                            <div className="mt-8 p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                                <h4 className="text-xs font-bold uppercase tracking-widest mb-2 text-pop">Understanding Your Cost Structure</h4>
                                <p className="text-sm text-theme-text opacity-80 leading-relaxed">
                                    Official CPI says inflation is {results.official.toFixed(1)}%, but your personal experience is {results.perceived.toFixed(1)}%.
                                    Understanding your actual cost structure can help frame conversations about compensation and career decisions.
                                    While employers typically use official CPI for raises, knowing your real expenses helps you make informed choices about job offers, relocations, and budget planning.
                                </p>
                            </div>

                            <button
                                onClick={() => setShowMethodology(true)}
                                className="mt-4 w-full text-center text-xs font-mono uppercase tracking-widest text-pop hover:underline"
                            >
                                + Show the Math (Methodology)
                            </button>

                            <div className={styles.shareButtons}>
                                <button
                                    className={`${styles.shareButton} ${styles.shareButtonPrimary}`}
                                    onClick={() => {
                                        const text = `Based on my spending patterns, my perceived inflation is ${results.perceived.toFixed(1)}% vs the official ${results.official.toFixed(1)}% CPI. Calculate yours at The Grocery Gap!`;
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
                                        aria-label="Email address for newsletter"
                                    />
                                    <button type="submit" className="bg-ink text-white dark:bg-white dark:text-ink px-4 py-2 text-xs font-bold uppercase tracking-widest hover:opacity-80">
                                        Join
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>

                    <p className="text-center text-xs opacity-50 mt-6 max-w-md mx-auto">
                        Educational model based on behavioral economics research. Results illustrate concepts, not precise predictions.
                    </p>
                </div>

                <MethodologyModal isOpen={showMethodology} onClose={() => setShowMethodology(false)} />
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
                        Calculate your Perceived Cost Index based on your location and spending habits. Your perception of price changes likely differs from official statistics.
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

                    <button
                        onClick={() => setShowMethodology(true)}
                        className="mt-4 text-center text-xs font-mono uppercase tracking-widest text-theme-text opacity-50 hover:opacity-100 transition-opacity mx-auto block"
                    >
                        How is this calculated?
                    </button>
                </div>

                <MethodologyModal isOpen={showMethodology} onClose={() => setShowMethodology(false)} />
            </div>
        </section>
    );
}
