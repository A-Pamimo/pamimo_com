'use client';

import { useState, useEffect } from 'react';

const WORKER_URL = 'https://cpi-api.akinjidedavid.workers.dev/cpi';

interface RegionalCPIData {
    timestamp: string;
    source: string;
    regions: {
        NE: { period: string; yearOverYear: number };
        MW: { period: string; yearOverYear: number };
        SO: { period: string; yearOverYear: number };
        WE: { period: string; yearOverYear: number };
        US: { period: string; yearOverYear: number };
    };
}

// Fallback data (Nov 2025)
const FALLBACK_DATA: RegionalCPIData = {
    timestamp: new Date().toISOString(),
    source: 'BLS (Static Fallback)',
    regions: {
        NE: { period: 'November 2025', yearOverYear: 3.1 },
        MW: { period: 'November 2025', yearOverYear: 3.0 },
        SO: { period: 'November 2025', yearOverYear: 2.2 },
        WE: { period: 'November 2025', yearOverYear: 3.0 },
        US: { period: 'November 2025', yearOverYear: 2.7 },
    },
};

export function useRegionalCPI() {
    const [data, setData] = useState<RegionalCPIData>(FALLBACK_DATA);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCPI = async () => {
            try {
                const response = await fetch(WORKER_URL);

                if (!response.ok) {
                    throw new Error(`Worker returned ${response.status}`);
                }

                const result = await response.json();
                setData(result);
                setError(null);
            } catch (err) {
                console.warn('Failed to fetch live CPI, using fallback:', err);
                setError(err instanceof Error ? err.message : 'Unknown error');
                // Keep using FALLBACK_DATA
            } finally {
                setLoading(false);
            }
        };

        fetchCPI();
    }, []);

    return { data, loading, error };
}
