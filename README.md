# Recession Risk Monitor

A single-file, browser-based dashboard that computes a real-time **12-indicator composite recession risk score** using live data from the Federal Reserve's FRED API. No backend, no server, no build step required.

**Live score · Reconstructed 25-year history · NBER recession shading · Data freshness indicators**

---

## Quick Start

1. Open `index.html` in any modern browser
2. Enter your free FRED API key when prompted (see below)
3. Click **Load Live Data**

Your key is saved in your browser's `localStorage` — you only need to enter it once per browser.

---

## Getting a FRED API Key

The dashboard uses the St. Louis Federal Reserve's FRED API, which is **completely free** for personal and research use.

1. Go to **[fred.stlouisfed.org/docs/api/api_key.html](https://fred.stlouisfed.org/docs/api/api_key.html)**
2. Click "Request or view your API keys"
3. Create a free account (name + email)
4. Your API key appears immediately on the next screen — it looks like: `abcdef1234567890abcdef1234567890`
5. Copy it and paste it into the dashboard banner

**That's it.** The entire process takes under 2 minutes. No credit card, no approval process.

---

## How the Composite Score Works

The dashboard computes a single **0–100 composite score** by scoring each of 10 economic indicators on a 0–100 scale and taking a weighted average.

| Score Range | Regime | Interpretation |
|---|---|---|
| **> 70** | 🟢 Low Risk | Economy expanding, recession unlikely in next 12 months |
| **50–70** | 🟡 Elevated Risk | Warning signs present, monitor closely |
| **< 50** | 🔴 High Risk | Multiple indicators signalling recession |

---

## The 10 Indicators

### 1. Yield Curve — 10yr minus 3-month Spread (Weight: 20%)
**FRED series:** `DGS10` minus `TB3MS`

The spread between the 10-year Treasury yield and the 3-month T-bill rate. When short-term rates exceed long-term rates (an "inverted" yield curve), it signals that markets expect the Fed to cut rates due to an economic downturn ahead. The yield curve has preceded every US recession since 1960 with a typical 6–18 month lead time, making it the single most reliable long-horizon indicator.

- **Green:** Spread > +1% (normal, healthy)
- **Amber:** Spread 0–1% (flattening, watch closely)
- **Red:** Spread < 0% (inverted — recession warning)

---

### 2. Chicago Fed National Financial Conditions Index (Weight: 15%)
**FRED series:** `NFCI`

The Chicago Fed's National Financial Conditions Index measures the tightness or looseness of financial conditions across three categories: risk (volatility and funding risk), credit (debt and lending conditions), and leverage (balance sheet conditions). A reading of **0** represents average financial conditions; **negative values** mean conditions are looser than average (supportive of growth); **positive values** mean conditions are tighter than average (headwind to growth). Updated weekly, going back to 1971.

This replaced the OECD Composite Leading Indicator (`USALOLITONOSTSAM`) which stopped updating on FRED's free tier in early 2024, which itself replaced the Conference Board LEI (`USSLIND`) which was removed from FRED in 2020.

- **Green:** NFCI < 0 (looser than average — supportive conditions)
- **Amber:** NFCI 0 to +0.5 (tightening but not yet stress)
- **Red:** NFCI > +0.5 (significant financial stress)

---

### 3. Credit Conditions — Senior Loan Officer Survey (Weight: 10%)
**FRED series:** `DRTSCILM`

Net percentage of banks tightening lending standards for commercial and industrial (C&I) loans, from the Federal Reserve's quarterly Senior Loan Officer Opinion Survey. When banks tighten standards broadly, credit becomes scarce and investment slows — historically a reliable leading indicator of recession.

- **Green:** Net easing (banks loosening standards, < 0%)
- **Amber:** Modest tightening (0–20%)
- **Red:** Severe tightening (> 20%)

*Note: Released quarterly, typically with a 2-month lag.*

---

### 4. Sahm Rule Real-Time Indicator (Weight: 10%)
**FRED series:** `SAHMREALTIME`

Developed by economist Claudia Sahm at the Federal Reserve, this indicator triggers when the 3-month average unemployment rate rises 0.5 percentage points or more above its 12-month low. It has triggered in every recession since 1970 with zero false positives and typically fires within 1–2 months of recession onset — making it the most reliable *coincident* recession indicator.

- **Green:** Reading < 0.10 (labour market stable)
- **Amber:** Reading 0.10–0.50 (labour market weakening)
- **Red:** Reading ≥ 0.50 (Sahm Rule triggered — recession signal)

---

### 5. CFNAI — Chicago Fed National Activity Index (Weight: 10%)
**FRED series:** `CFNAI`

The Chicago Fed National Activity Index is a weighted average of **85 monthly economic indicators** drawn from four categories: production & income, employment, personal consumption & housing, and sales & orders. Because it synthesises so much data, it is one of the primary tools used by the NBER Business Cycle Dating Committee when officially identifying recessions. A three-month average below −0.70 is the standard recession threshold.

- **Green:** Reading > 0 (above-trend growth)
- **Amber:** Reading −0.70 to 0 (below-trend, no recession)
- **Red:** Reading < −0.70 (recession threshold breached)

---

### 6. Housing Permits — Year-over-Year Change (Weight: 10%)
**FRED series:** `PERMIT`

New residential building permits issued, year-over-year percentage change. Housing is one of the most rate-sensitive sectors of the economy and leads the business cycle — permit declines typically precede broader slowdowns by 6–12 months. Included in the Conference Board's LEI as a standalone component.

- **Green:** YoY change > 0% (expanding)
- **Amber:** YoY change −10% to 0% (contracting modestly)
- **Red:** YoY change < −10% (sharp contraction)

---

### 7. Consumer Sentiment — UMich Z-Score (Weight: 7.5%)
**FRED series:** `UMCSENT`

University of Michigan Consumer Sentiment Index, expressed as a **z-score relative to the trailing 10-year average**. Using a z-score rather than the raw index normalises for structural level shifts over time and makes the signal comparable across different periods. Sustained negative sentiment leads to reduced consumer spending, which drives roughly 70% of US GDP.

- **Green:** Z-score > 0 (sentiment above historical average)
- **Amber:** Z-score −1σ to 0 (below average but not extreme)
- **Red:** Z-score < −1σ (significantly depressed sentiment)

---

### 8. Corporate Profits — NIPA Year-over-Year (Weight: 7.5%)
**FRED series:** `CP`

Pre-tax corporate profits from the Bureau of Economic Analysis National Income and Product Accounts (NIPA), year-over-year change. Profit downturns precede layoffs and investment cuts, which then feed into the broader economy. Back-to-back quarterly declines are a classic recession leading indicator.

- **Green:** YoY growth > 0%
- **Amber:** YoY change −5% to 0%
- **Red:** YoY decline > −5%

*Note: Released quarterly with approximately a 1-month lag.*

---

### 9. Industrial Production — 6-Month Change (Weight: 5%)
**FRED series:** `INDPRO`

Federal Reserve index of US industrial output (manufacturing, mining, utilities), 6-month percentage change. Industrial production is a key NBER coincident indicator and one of the four series the committee weights most heavily when dating business cycle peaks and troughs.

- **Green:** 6-month change ≥ 0%
- **Amber:** 6-month change −1% to 0%
- **Red:** 6-month change < −1% and declining

---

### 10. NY Fed Recession Probability Model (Weight: 5%)
**FRED series:** `RECPROUSM156N`

The Federal Reserve Bank of New York's model-based probability of the US economy being in recession 12 months ahead, derived from the yield curve. Unlike the raw yield curve spread, this series converts the spread into a calibrated probability using a probit model estimated over the full post-war sample.

- **Green:** Probability < 20%
- **Amber:** Probability 20–40%
- **Red:** Probability > 40%

---

## Historical Chart

After the live indicators load, the dashboard fetches full historical data (~25 years) for all 10 series and **reconstructs what the composite score would have been each month from January 2000 to today**. This is a backtest — the model is applied retroactively using today's weights and thresholds.

The chart includes:
- **NBER official recession shading** (grey bands) from FRED series `USREC`
- **Color-coded composite line** — green above 70, amber 50–70, red below 50
- **Real year labels** on the x-axis

You should be able to see the composite drop clearly during the **2001 recession**, **2008–09 financial crisis**, and **2020 COVID recession**.

---

## Data Freshness

Each indicator card displays a colour-coded pill showing how old the most recent data point is:

| Colour | Age | Typical cause |
|---|---|---|
| 🟢 Green | 0–7 days | Yield curve (daily data) |
| 🔵 Blue | 8–35 days | Monthly releases (jobs, production, etc.) |
| 🟡 Amber | 36–95 days | Monthly data between releases |
| 🔴 Red | 95+ days | Quarterly series (Corporate Profits, Credit Conditions) |

**When to reload for new data:** The most meaningful time to refresh is on the **first Friday of each month** (after the BLS Employment Situation report), and again around the **third week of the month** when industrial production and housing data drop. Reloading daily will only update the yield curve.

---

## Sparklines

Each indicator card contains a small trend line showing the recent history of that indicator's **raw value** (not the score). The duration shown varies by how frequently each series is released:

| Indicator | Sparkline Shows | Duration | Notes |
|---|---|---|---|
| Yield Curve | Monthly 10yr−3m spread | 24 months | Daily data downsampled to one point per month |
| LEI | Index level | 24 months | |
| Credit Conditions | Net % tightening (inverted) | 12 quarters (3 years) | Quarterly data — up = easing (good) |
| Sahm Rule | Reading (inverted) | 24 months | Up = lower reading (good) |
| CFNAI | Index level | 24 months | |
| Housing Permits | Raw permit count | 24 months | |
| Consumer Sentiment | Raw index level | 24 months | |
| Corporate Profits | Raw profit level | 12 quarters (3 years) | Quarterly data |
| Industrial Production | Index level | 24 months | |
| Recession Probability | Probability % | 24 months | |

A few things worth knowing about how to read them:

**Credit Conditions and Sahm Rule are inverted** — the line goes up when conditions are improving, not when the raw value is rising. This keeps the visual intuition consistent across all cards: a rising sparkline always means "getting better."

**Quarterly series (Credit Conditions, Corporate Profits) show 3 years** rather than 2, since 24 months would only be 8 data points — not enough to see a meaningful trend. The freshness pill on those cards will tell you when the last quarterly reading was.

**The sparkline range auto-scales** to fit the min and max of the visible window, so the line always fills the card vertically. A flat-looking line means the value has been relatively stable; a line that fills the full height means there has been significant movement in the period shown.

The duration shown in each card's freshness pill (e.g. `14d ago · 24mo trend`) confirms exactly what the sparkline is displaying.

---

## Technical Notes

- **Single HTML file** — no dependencies, no npm, no build step
- **CORS proxy** — all FRED API calls are routed through `corsproxy.io` with `allorigins.win` as fallback, allowing the file to run locally from `file://` without a server
- **Two-phase loading** — live indicators render within ~3 seconds; historical reconstruction runs in the background (~15–30 seconds depending on connection)
- **API key storage** — stored in browser `localStorage`, never in the source code or transmitted anywhere except directly to FRED's API

---

## Deployment

### GitHub Pages (recommended)
1. Create a new **public** GitHub repository
2. Upload `index.html` (rename from `recession-live.html`)
3. Go to **Settings → Pages**, select branch `main`, click **Save**
4. Your dashboard is live at `https://yourusername.github.io/your-repo-name`

### Netlify (drag & drop — 30 seconds)
1. Go to [app.netlify.com](https://app.netlify.com)
2. Drag the HTML file onto the deploy area
3. Done — you get a live URL instantly

### Local
Just open the file directly in any browser. No server needed.

---

## Data Sources

All data is sourced from the **Federal Reserve Bank of St. Louis FRED API** (`api.stlouisfed.org`).

| Series | Description | Source Agency |
|---|---|---|
| `DGS10` | 10-Year Treasury Constant Maturity Rate | US Treasury / Fed |
| `TB3MS` | 3-Month Treasury Bill Secondary Market Rate | US Treasury / Fed |
| `NFCI` | Chicago Fed National Financial Conditions Index | Chicago Fed |
| `DRTSCILM` | Sr. Loan Officer Survey — C&I Tightening | Federal Reserve |
| `SAHMREALTIME` | Sahm Rule Real-Time Recession Indicator | Federal Reserve |
| `CFNAI` | Chicago Fed National Activity Index | Chicago Fed |
| `PERMIT` | New Privately-Owned Housing Units Authorized | Census Bureau |
| `UMCSENT` | University of Michigan Consumer Sentiment | U of Michigan |
| `CP` | Corporate Profits After Tax (NIPA) | BEA |
| `INDPRO` | Industrial Production Index | Federal Reserve |
| `RECPROUSM156N` | NY Fed 12-Month Recession Probability | NY Fed |
| `BAMLH0A0HYM2` | ICE BofA US High Yield Option-Adjusted Spread | ICE / BofA |
| `ICSA` | Initial Claims for Unemployment Insurance | US Dept of Labor |

---

*Disclaimer: This dashboard is for informational and research purposes only. It is not financial advice. Economic indicators are inherently backward-looking and no model reliably predicts recessions in real time.*
