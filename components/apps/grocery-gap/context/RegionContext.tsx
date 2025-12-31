"use client";

import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export type RegionCode = 'US' | 'CA';
export type CurrencyCode = 'USD' | 'CAD';

interface RegionData {
    code: RegionCode;
    currency: CurrencyCode;
    currencySymbol: string;
    flag: string;
    name: string;
}

interface RegionContextType {
    region: RegionData;
}

const REGIONS: Record<RegionCode, RegionData> = {
    US: {
        code: 'US',
        currency: 'USD',
        currencySymbol: '$',
        flag: '🇺🇸',
        name: 'United States',
    },
    CA: {
        code: 'CA',
        currency: 'CAD',
        currencySymbol: '$',
        flag: '🇨🇦',
        name: 'Canada',
    },
};

const RegionContext = createContext<RegionContextType | undefined>(undefined);

export function RegionProvider({ children }: { children: ReactNode }) {
    const searchParams = useSearchParams();
    const regionParam = searchParams?.get('region')?.toUpperCase();
    const [regionCode, setRegionCode] = useState<RegionCode>('US');

    useEffect(() => {
        if (regionParam === 'CA') {
            setRegionCode('CA');
        } else {
            setRegionCode('US');
        }
    }, [regionParam]);

    return (
        <RegionContext.Provider value={{ region: REGIONS[regionCode] }}>
            {children}
        </RegionContext.Provider>
    );
}

export function useRegion() {
    const context = useContext(RegionContext);
    if (context === undefined) {
        throw new Error('useRegion must be used within a RegionProvider');
    }
    return context;
}
