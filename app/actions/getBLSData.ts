// Client-side compatible BLS data fetcher
// Note: Removed 'use server' directive for static export compatibility




export interface BLSInflationData {
    period: string;
    year: string;
    value: number;
    source: 'BLS';
}


export async function getBLSData(): Promise<BLSInflationData | null> {
    // For static export, we cannot use server-side only APIs
    // Return static/mocked data for the production build
    // This is a trade-off for static hosting (Cloudflare Pages)

    // In a real production scenario, this would call a separate deployed API
    // or use ISR/SSR instead of static export.

    // Return a realistic static value for the demo
    return {
        period: 'October',
        year: '2024',
        value: 3.4,
        source: 'BLS'
    };
}
