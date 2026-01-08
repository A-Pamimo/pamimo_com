/**
 * Cloudflare Worker: CPI API Proxy
 * 
 * Fetches regional CPI data from BLS API and returns it with CORS headers.
 * Deploy with: npx wrangler deploy
 */

const BLS_API_URL = 'https://api.bls.gov/publicAPI/v2/timeseries/data/';

// BLS Series IDs for Regional CPI (All Urban Consumers, All Items)
// See: https://www.bls.gov/cpi/regional-resources.htm
const SERIES_IDS = {
    // US Regions
    NE: 'CUUR0100SA0', // Northeast
    MW: 'CUUR0200SA0', // Midwest
    SO: 'CUUR0300SA0', // South
    WE: 'CUUR0400SA0', // West
    US: 'CUUR0000SA0', // US City Average (National)
};

// CORS headers
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
    async fetch(request, env, ctx) {
        // Handle CORS preflight
        if (request.method === 'OPTIONS') {
            return new Response(null, { headers: corsHeaders });
        }

        const url = new URL(request.url);

        // Health check endpoint
        if (url.pathname === '/health') {
            return new Response(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
        }

        // Main CPI endpoint
        if (url.pathname === '/cpi' || url.pathname === '/') {
            try {
                const currentYear = new Date().getFullYear();

                const response = await fetch(BLS_API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        seriesid: Object.values(SERIES_IDS),
                        startyear: String(currentYear - 1),
                        endyear: String(currentYear),
                        calculations: true,
                        annualaverage: false,
                        registrationkey: env.BLS_API_KEY || undefined,
                    }),
                });

                const blsData = await response.json();

                if (blsData.status !== 'REQUEST_SUCCEEDED') {
                    throw new Error(blsData.message?.[0] || 'BLS API error');
                }

                // Transform BLS data into a simpler format
                const result = {
                    timestamp: new Date().toISOString(),
                    source: 'BLS',
                    regions: {},
                };

                const regionKeys = Object.keys(SERIES_IDS);

                blsData.Results?.series?.forEach((series, index) => {
                    const regionKey = regionKeys[index];
                    const latestData = series.data?.[0]; // Most recent month
                    const yearAgoData = series.data?.[12]; // Same month, previous year

                    if (latestData) {
                        const currentValue = parseFloat(latestData.value);
                        const yearAgoValue = yearAgoData ? parseFloat(yearAgoData.value) : null;
                        const yearOverYear = yearAgoValue
                            ? ((currentValue - yearAgoValue) / yearAgoValue * 100).toFixed(1)
                            : latestData.calculations?.pct_changes?.['12'] || null;

                        result.regions[regionKey] = {
                            series: SERIES_IDS[regionKey],
                            period: `${latestData.periodName} ${latestData.year}`,
                            value: currentValue,
                            yearOverYear: parseFloat(yearOverYear),
                        };
                    }
                });

                return new Response(JSON.stringify(result, null, 2), {
                    headers: {
                        ...corsHeaders,
                        'Content-Type': 'application/json',
                        'Cache-Control': 'public, max-age=86400', // Cache 24 hours
                    },
                });

            } catch (error) {
                return new Response(JSON.stringify({
                    error: error.message,
                    timestamp: new Date().toISOString(),
                }), {
                    status: 500,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                });
            }
        }

        return new Response('Not Found', { status: 404, headers: corsHeaders });
    },
};
