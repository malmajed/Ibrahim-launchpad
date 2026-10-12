# Ibrahim's Launchpad

A personal learning app for Ibrahim, built around one goal: the CFA Level I exam (May 2027 window, 2027 curriculum).

- **CFA Level I** — study tracker on the official 2027 outline, practice simulator, Investment Foundations I missions (a01–a20).
- **MBA Core** — missions m01–m16 and four case-of-the-week studies.
- **Trading and Technical Analysis** — twelve missions with labs (coming in batch 3). Education only, not financial advice.
- **News Scan** — daily analyst-style headline scan with calibration scoring (coming in batch 4).

Interface in English or Arabic; missions and questions stay in English, the language of the exam.

## Build
```
python3 build/make.py v2      # always bump the version; rebuilds index.html and the service-worker cache name
```
The build stops on duplicate top-level names, duplicate lab keys or a syntax error.

## Test
```
python3 -m http.server 8765 &      # from the repo root
node build/test/mock.js &          # mock sync backend on 8767
node build/test/test.js            # every mission, lab and quiz at phone width, Arabic RTL, WCAG contrast, sync
```

## Sync backend
`build/Code.gs` is the Google Apps Script backend. The secret lives only in the script's **Script properties** (`SECRET`), never in this repo. After any change to the script: **Deploy → New deployment**.

## Deploy
Push to `main`. GitHub Actions publishes to GitHub Pages (Pages source: GitHub Actions).

CFA content is original. Topic names, weights and learning-module titles come from CFA Institute's published 2027 Level I topic outline (titles and outcome counts only).
