'use client';

import { useState } from 'react';
import Hero from './sections/Hero';
import GroceryTest from './sections/GroceryTest';
import FrequencyBias from './sections/FrequencyBias';
import Shrinkflation from './sections/Shrinkflation';
import RegionalMap from './sections/RegionalMap';
import RegionalMapCA from './sections/RegionalMapCA';
import Calculator from './sections/Calculator';
import ExecutiveBrief from './sections/ExecutiveBrief';
import AcademicAppendix from './sections/AcademicAppendix';
import BackButton from './ui/BackButton';
import { useRegion } from './context/RegionContext';

export default function GroceryGapApp() {
    const { region } = useRegion();
    const isCanada = region.code === 'CA';
    const [showBizMode, setShowBizMode] = useState(false);

    return (
        <main>
            <BackButton />

            {/* Persona Switcher (Subtle) */}
            <div className="fixed top-6 right-6 z-50">
                <button
                    onClick={() => setShowBizMode(!showBizMode)}
                    className="font-mono text-[10px] uppercase tracking-widest px-3 py-1 border border-ink/20 dark:border-white/20 hover:bg-ink hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
                >
                    {showBizMode ? 'Exit Boardroom' : 'Mode: Executive'}
                </button>
            </div>

            <Hero />

            {showBizMode && <ExecutiveBrief />}

            <GroceryTest />
            <FrequencyBias />
            <Shrinkflation />
            {isCanada ? <RegionalMapCA /> : <RegionalMap />}
            <Calculator />

            <AcademicAppendix />
        </main>
    );
}
