# CPI API Worker

A Cloudflare Worker that proxies BLS (Bureau of Labor Statistics) API calls to fetch regional CPI data.

## Deploy

```bash
cd workers/cpi-api
npx wrangler deploy
```

## Optional: Add BLS API Key

Get a free key from [BLS Registration](https://data.bls.gov/registrationEngine/) for higher rate limits.

```bash
npx wrangler secret put BLS_API_KEY
# Enter your key when prompted
```

## Endpoints

- `GET /` or `GET /cpi` - Returns regional CPI data
- `GET /health` - Health check

## Response Format

```json
{
  "timestamp": "2025-01-07T...",
  "source": "BLS",
  "regions": {
    "NE": { "period": "November 2025", "yearOverYear": 3.1 },
    "MW": { "period": "November 2025", "yearOverYear": 3.0 },
    "SO": { "period": "November 2025", "yearOverYear": 2.2 },
    "WE": { "period": "November 2025", "yearOverYear": 3.0 },
    "US": { "period": "November 2025", "yearOverYear": 2.7 }
  }
}
```
