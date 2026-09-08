#!/usr/bin/env node
// ── FRED DATA SNAPSHOT BUILDER ───────────────────────────────────────────
// Runs in GitHub Actions (see .github/workflows/update-data.yml). Fetches
// every series the dashboard needs directly from FRED — no CORS proxies,
// no browser — and writes a single static JSON snapshot that index.html
// loads same-origin from GitHub Pages.
//
// The FRED API key comes from the FRED_API_KEY repo secret and never
// reaches the client.
//
// The four groups below mirror loadData()/loadHistory() in index.html.
// Keep them in sync: same series ids, same limits, same key names.

import { mkdir, writeFile } from 'node:fs/promises';

const FRED_URL = 'https://api.stlouisfed.org/fred/series/observations';
const API_KEY = process.env.FRED_API_KEY;
const OUT_PATH = new URL('../data/fred-data.json', import.meta.url);

if (!API_KEY) {
  console.error('FRED_API_KEY is not set.');
  process.exit(1);
}

const GROUPS = {
  live: {
    DGS10: 760, TB3MS: 760, NFCI: 104, DRTSCILM: 12, SAHMREALTIME: 24, CFNAI: 24,
    PERMIT: 28, UMCSENT: 144, CP: 12, INDPRO: 24, RECPROUSM156N: 24, USREC: 48,
    BAMLH0A0HYM2: 760, ICSA: 110,
  },
  hardshipLive: {
    W875RX1: 28, PSAVERT: 24, LNS12032194: 24, DRCCLACBS: 12, RSXFS: 28,
    CIVPART: 24, UMCSENT: 144, LES1252881600Q: 12,
  },
  hist: {
    GS10: 600, TB3MS: 600, NFCI: 2800, DRTSCILM: 200, SAHMREALTIME: 600, CFNAI: 600,
    PERMIT: 600, UMCSENT: 600, CP: 200, INDPRO: 600, RECPROUSM156N: 600, USREC: 600,
    BAMLH0A0HYM2: 7800, ICSA: 3000,
  },
  hardshipHist: {
    W875RX1: 600, PSAVERT: 600, LNS12032194: 600, DRCCLACBS: 200, RSXFS: 600,
    CIVPART: 600, UMCSENT: 600, LES1252881600Q: 200,
  },
};

const sleep = ms => new Promise(r => setTimeout(r, ms));

// One network call per (series, limit) pair, cached so series that appear in
// more than one group (UMCSENT, TB3MS, …) are only fetched once per limit.
const cache = new Map();

async function fetchSeries(seriesId, limit, attempt = 1) {
  const key = `${seriesId}:${limit}`;
  if (cache.has(key)) return cache.get(key);
  const url = `${FRED_URL}?series_id=${seriesId}&api_key=${API_KEY}&file_type=json&sort_order=desc&limit=${limit}`;
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'recession-risk-monitor' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (json.error_message) throw new Error(`FRED: ${json.error_message}`);
    const rows = (json.observations || [])
      .filter(o => o.value !== '.' && o.value !== '')
      .map(o => ({ date: o.date, value: parseFloat(o.value) }));
    cache.set(key, rows);
    return rows;
  } catch (e) {
    if (attempt < 3) {
      await sleep(attempt * 2000);
      return fetchSeries(seriesId, limit, attempt + 1);
    }
    throw new Error(`${seriesId} (limit ${limit}): ${e.message}`);
  }
}

const snapshot = { generatedAt: new Date().toISOString(), failed: [] };

for (const [group, limits] of Object.entries(GROUPS)) {
  snapshot[group] = {};
  for (const [seriesId, limit] of Object.entries(limits)) {
    try {
      const rows = await fetchSeries(seriesId, limit);
      snapshot[group][seriesId] = rows;
      console.log(`${group}/${seriesId}: ${rows.length} observations`);
    } catch (e) {
      snapshot.failed.push(`${group}/${e.message}`);
      console.warn(`FAILED ${group}/${seriesId}: ${e.message}`);
    }
  }
}

// A run that loses most of the data would publish a broken dashboard — treat
// that as a failure and leave the previous snapshot in place.
const fetched = Object.keys(GROUPS).reduce((n, g) => n + Object.keys(snapshot[g]).length, 0);
const expected = Object.values(GROUPS).reduce((n, l) => n + Object.keys(l).length, 0);
if (fetched < expected * 0.8) {
  console.error(`Only ${fetched}/${expected} series fetched — refusing to write snapshot.`);
  process.exit(1);
}

await mkdir(new URL('../data/', import.meta.url), { recursive: true });
await writeFile(OUT_PATH, JSON.stringify(snapshot) + '\n');
console.log(`Wrote ${fetched}/${expected} series to data/fred-data.json`);
