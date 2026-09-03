# Airfare Index

A polished frontend prototype for an India domestic airfare pricing intelligence dashboard.

## Current scope

- Airfare Price Index dashboard
- Route pressure monitoring
- Booking-horizon views (T+1 to T+45)
- Route-wise fare tracking
- Airline comparison
- Sector heatmap
- Fare Explorer
- Data quality monitoring
- Methodology and API preview
- Responsive dark dashboard UI

> **Demo environment:** all market observations are synthetic. No live airline or government data is represented.

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

The generated `dist` directory can be deployed directly to Vercel. Vercel will also detect the Vite project automatically when the repository is imported.

## Next production layer

1. Replace synthetic observations with validated fare feeds.
2. Add the index calculation and route-weighting service.
3. Add scheduled ingestion and data-quality checks.
4. Expose the `/api/v1/*` endpoints shown in the dashboard.
5. Add authentication and rate limits for API consumers.
