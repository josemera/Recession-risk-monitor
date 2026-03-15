# Recession Risk Monitor

A single-file, browser-based dashboard that combines two related but distinct
views of the US economy:

- a **12-indicator Recession Risk composite**
- an **8-indicator Economic Hardship composite**

The app runs directly from `index.html` with no backend, no build step, and no
server. It fetches live data from the Federal Reserve Bank of St. Louis FRED
API and reconstructs historical composite scores in the browser.

**Combined history chart · Toggleable recession / hardship views · FRED live data · No build step**

---

## Quick Start

1. Open `index.html` in any modern browser
2. Enter your free FRED API key when prompted
3. Click **Load Live Data**

Your key is stored in browser `localStorage`, so you typically only need to
enter it once per browser.

If the file is opened in a sandboxed preview environment that blocks external
fetches, the dashboard automatically falls back to demo data.

---

## Getting a FRED API Key

The dashboard uses the St. Louis Fed's FRED API.

1. Go to [fred.stlouisfed.org/docs/api/api_key.html](https://fred.stlouisfed.org/docs/api/api_key.html)
2. Request or view your API key
3. Copy the key and paste it into the app banner

---

## What the Dashboard Shows

### 1. Historical Chart

The top chart is a combined history view. When hardship is enabled, it can show:

- Recession composite score
- Economic Hardship composite score
- Implied recession probability
- Risk threshold line
- NBER recession shading

Legend items are clickable and toggle chart layers on/off.

The chart always remains combined, regardless of which lower section is active.

### 2. Toggleable Analysis Section

Below the chart is a single shared content area with two pill-style tabs:

- **Recession Risk**
- **Economic Hardship**

Only one is shown at a time.

**Recession Risk** view contains:
- recession composite card
- 12 recession indicator cards
- recession methodology table

**Economic Hardship** view contains:
- hardship composite card
- 8 hardship indicator cards
- hardship methodology table

No duplicated panels are shown simultaneously.

---

## Recession Composite

The recession model scores **12 indicators** from 0 to 100 and combines them
using fixed weights that sum to 1.00.

Regimes:

| Score Range | Regime |
|---|---|
| **> 70** | Low recession risk |
| **50–70** | Elevated risk |
| **< 50** | High recession risk |

The chart also derives an implied 12-month recession probability from the
recession composite.

### Recession Indicators

| Indicator | Series / Logic |
|---|---|
| Yield Curve | `DGS10 - TB3MS` |
| Financial Conditions | `NFCI` |
| Credit Conditions | `DRTSCILM` |
| Sahm Rule | `SAHMREALTIME` |
| CFNAI | `CFNAI` |
| Housing Permits YoY | `PERMIT` |
| Consumer Sentiment z-score | `UMCSENT` |
| Corporate Profits YoY | `CP` |
| Industrial Production 6mo | `INDPRO` |
| Recession Probability | `RECPROUSM156N` |
| HY Credit Spread | `BAMLH0A0HYM2` |
| Jobless Claims | `ICSA` |

---

## Economic Hardship Composite

The hardship model scores **8 indicators** from 0 to 100 and combines them
using its own independent weight set that also sums to 1.00.

Higher score means healthier household conditions; lower score means more
economic hardship.

Regimes:

| Score Range | Regime |
|---|---|
| **> 70** | Low hardship |
| **50–70** | Elevated hardship |
| **< 50** | High hardship |

### Hardship Indicators

| Indicator | FRED Series |
|---|---|
| Real Personal Income ex-Transfers | `W875RX1` |
| Personal Saving Rate | `PSAVERT` |
| Part-Time for Economic Reasons | `LNS12032194` |
| Credit Card Delinquency Rate | `DRCCLACBS` |
| Real Retail Sales YoY | `RSXFS` |
| Labor Force Participation Rate | `CIVPART` |
| Consumer Sentiment z-score | `UMCSENT` |
| Real Median Weekly Earnings YoY | `LES1252881600Q` |

The hardship tier is architecturally isolated from the recession tier. Even
shared underlying series like `UMCSENT` are fetched and scored independently.

---

## Historical Reconstruction

The app reconstructs both composites in the browser:

- **Recession history:** monthly from **1990-present**
- **Hardship history:** monthly from **1994-present**

Those start dates are determined by series availability, not by UI preference.

---

## Data Freshness

Freshness pills are intended to answer whether the dashboard is current
relative to the latest available release, not merely how old the observation
month is.

Current behavior:

- **Daily / weekly series:** freshness is based on observation age
- **Monthly / quarterly macro series:** freshness is release-aware using
  approximate publication timing
- **Quarterly series:** use explicit `freshnessDate` offsets

The observation date shown in the card header remains the actual observation
period. Only the freshness pill uses the release-aware date when applicable.

---

## Technical Notes

- Single self-contained HTML file
- Vanilla HTML, CSS, and JavaScript only
- No npm, bundler, or server
- Uses CORS proxies in the browser for FRED access
- All external data access goes through `fetchSeries(seriesId, limit)`
- Live view loads first; historical reconstruction runs after
- Demo mode is available and is also used automatically in sandboxed preview environments

---

## FRED / Legal Attribution

This project uses FRED data and includes persistent attribution in the app UI.

- Source: U.S. Federal Reserve Economic Data (FRED), Federal Reserve Bank of St. Louis
- FRED website: [fred.stlouisfed.org](https://fred.stlouisfed.org)
- FRED API Terms: [fred.stlouisfed.org/docs/api/terms_of_use.html](https://fred.stlouisfed.org/docs/api/terms_of_use.html)

This product uses the FRED® API but is not endorsed or certified by the
Federal Reserve Bank of St. Louis.

Some series may include third-party source restrictions. Review the relevant
FRED series page before redistribution.

---

## Deployment

### Local

Open `index.html` directly in a browser.

### Static Hosting

Because the app is a single HTML file, it can be hosted on:

- GitHub Pages
- Netlify
- any static file host

No server runtime is required.

---

## Disclaimer

This dashboard is for informational and research purposes only. It is not
financial advice. Economic indicators are lagging or coincident by nature, and
no dashboard can reliably predict recessions in real time.
