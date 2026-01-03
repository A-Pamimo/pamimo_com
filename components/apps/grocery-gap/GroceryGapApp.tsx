'use client';

import { useState } from 'react';
import Hero from './sections/Hero';
import Preamble from './sections/Preamble';
import GroceryTest from './sections/GroceryTest';
import FrequencyBias from './sections/FrequencyBias';
import Shrinkflation from './sections/Shrinkflation';
import RegionalMap from './sections/RegionalMap';
import RegionalMapCA from './sections/RegionalMapCA';
import Calculator from './sections/Calculator';
import ExecutiveBrief from './sections/ExecutiveBrief';
import AcademicAppendix from './sections/AcademicAppendix';
import BackButton from './ui/BackButton';
import ModeToggle from './ui/ModeToggle';
import { useRegion } from './context/RegionContext';
import ProgressBar from './ui/ProgressBar';

export default function GroceryGapApp() {
    const { region } = useRegion();
    const isCanada = region.code === 'CA';
    const [showBizMode, setShowBizMode] = useState(false);

    return (
        <main>
            <ProgressBar />

            {/* Persona Switcher */}
            <div className="fixed top-24 right-6 z-40">
                <ModeToggle
                    isBusinessMode={showBizMode}
                    onToggle={() => setShowBizMode(!showBizMode)}
                />
            </div>

            <Hero isBusinessMode={showBizMode} />

            {showBizMode ? (
                // EXECUTIVE MODE LAYOUT
                <>
                    <ExecutiveBrief />
                    {/* Retain Theory as "Root Cause Analysis" */}
                    <FrequencyBias />
                    <Shrinkflation />
                    {isCanada ? <RegionalMapCA /> : <RegionalMap />}
                    {/* Hide Calculator in Brief Mode */}
                </>
            ) : (
                // FULL ARTICLE MODE LAYOUT
                <>
                    <Preamble />
                    <GroceryTest />
                    <FrequencyBias />
                    <Shrinkflation />
                    {isCanada ? <RegionalMapCA /> : <RegionalMap />}
                    <Calculator />
                </>
            )}

            <AcademicAppendix />
        </main>
    );
}
