// Client-side compatible FRED data fetcher
// Note: Removed 'use server' directive for static export compatibility

export interface InflationData {
    date: string;
    value: number;
    yearOverYear: number;
}

export async function getInflationData(): Promise<InflationData | null> {
    // For static export, we cannot use server-side only APIs
    // Return static/mocked data for the production build
    // This is a trade-off for static hosting (Cloudflare Pages)

    // In a real production scenario, this would call a separate deployed API
    // or use ISR/SSR instead of static export.

    // Return a realistic static value for the demo
    return {
        date: '2024-10-01',
        value: 318.6,
        yearOverYear: 3.4
    };
}
