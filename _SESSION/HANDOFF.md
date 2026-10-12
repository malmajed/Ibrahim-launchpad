# Ibrahim's Launchpad — session handoff

Last updated: 2026-10-12 · Status: **Batch 1 DONE (build v1).** Single-user fork of Majed's Launchpad: CFA Level I + MBA Core live, Trading track stubbed (titles only), blue/yellow palette, English/Arabic interface.

## Owner decisions (Phase 0, approved 2026-10-12)
- Ibrahim (owner's nephew), finance graduate, sits **CFA Level I in the May 2027 window → 2027 curriculum** (`cfa_outline.js` already 2027; 102 modules). Re-confirm on cfainstitute.org in batch 2 (third-party source said Nov 2026 is the last 2026-curriculum window).
- **US-first** market focus (default tickers, news order, market-hours examples).
- **Interface English + Arabic** (switch in header and Settings, RTL). Missions, cases, CFA questions stay **English only** (exam language). Wrap content in `EN()`.
- **No Follow page** for the owner. No family profiles, PIN, rooms, weekly email.
- Owner instructions: English only, one step at a time, objective first, clean copy-paste.
- Approved plans: Trading missions t01–t12 (titles in `TRACKS` in app.js); news sources (below); CFA question bank Q1–Q7 (below); palette (below).

## Batches
1. ✅ Fork, cleanup, palette, single user, Arabic shell (v1).
2. ⏭ CFA home and tracker: make `study.js` the home screen; verify curriculum year; weekly pace to exam date (May 2027); translate tracker labels; readiness/focus-next/due lists already exist in study.js.
3. Trading track t01–t12 + labs (chart with indicators, paper-trading replay, position-size calculator, backtester with costs + out-of-sample, trade journal). Verify a data source whose licence allows bundling daily OHLCV (Yahoo forbids redistribution). US-first tickers; Tadawul via CSV import if no licensed source.
4. News Scan + Apps Script RSS fetcher (timer ~2 h, headline/source/link/time only), daily 5-headline scan, 1-day/5-day follow-up, Brier score, economic calendar (editable list), weekly review. Add news scans + journal entries to weekly goals. Swap the Case tab for News.
5. CFA question bank (three options, distractor explanations, tagged `cfa1:<topic>:<moduleIndex>` so accuracy feeds `state.cfa.m`): Q1 FI 60, Q2 FSA 60, Q3 Ethics 50, Q4 Quant 45, Q5 Equities 45, Q6 PM 30 + Derivatives 30, Q7 optional Eco/CI/Alt 60. Every calculation checked by script.

## Approved news sources (tested 2026-10-12 from the workspace; re-test from Apps Script in batch 4)
Works: Argaam EN `https://www.argaam.com/en/rss/ho-main-news?sectionid=1524`; Fed `https://www.federalreserve.gov/feeds/press_all.xml`; ECB `https://www.ecb.europa.eu/rss/press.html`; EIA `https://www.eia.gov/rss/todayinenergy.xml`; OilPrice `https://oilprice.com/rss/main`; WSJ Markets `https://feeds.a.dj.com/rss/RSSMarketsMain.xml`; BBC Business `https://feeds.bbci.co.uk/news/business/rss.xml`; Investing.com `https://www.investing.com/rss/news_25.rss`; Google News RSS queries for Saudi Exchange, SAMA, OPEC+ (`https://news.google.com/rss/search?q=<q>+when:2d&hl=en-US&gl=US&ceid=US:en`).
Rejected: CNBC, BLS, IMF, opec.org (403); Arab News, Zawya, SPA (no RSS); Argaam AR (empty); saudiexchange.sa (403).

## Palette (tokens in style.css line 1–3)
Navy #0B2545, royal #1F4FD8, sky #5DA9E9, sunflower #F5C518, amber #FFB000, pale yellow #FFF4CC, sun-ink #8A5A00 (yellow-family text on light). Legacy names kept so old code works: `--gold` = text accent (royal in light, sunflower in dark), `--gold2` = fill accent (sunflower) with navy text. Track colours `--c-cfa/--c-mba/--c-trade/--c-news`; text on track fills uses `--on-tc` (white light, navy dark). Never yellow text on white. Sunflower on royal is 4.1:1: large text/icons only.

## Files
- `build/src/core.js` — single user (`USER='ibrahim'`, `LSKEY='ilp-state'`), sync, notebook photos. Duel/rooms removed.
- `build/src/i18n.js` — `LANG`, `t()`, `AR` dictionary, `setLang`, `applyLang`, `localize` (data-i18n). Add every new shell string to `AR`.
- `build/src/app.js` — router, views, goals (`GDEF`: cfaHours, questions, reviews, missions), badges, SRS, case of the week, settings. `qAdd()/qSince()` count practice questions per day; `classifyLab` and `CUST` moved here.
- `icons.js` (TC colours, MICON incl. t01–t12, `flag`/`award` icons), `labs_cfa1.js`, `data_cfa1.js`, `labs_mba.js`, `data_mba.js`, `cases_mba.js` (w05–w08), `exam.js` (cfa1 only), `study.js` (cfa1 only), `cfa_outline.js` (cfa1 only).
- `build/make.py vN` → `index.html` + sw cache `ilp-vN`. Fails on duplicate top-level names, duplicate LABS keys, syntax errors (node --check).
- `build/Code.gs` — v5 single user; **SECRET in Script properties**, not in code.
- Tests: `build/test/mock.js` (port 8767, key `test`), `build/test/test.js` (all missions/labs/quizzes, routes, phone-width overflow, Arabic RTL, WCAG contrast light+dark, sync). Run with `NODE_PATH=/opt/npm-tools/node_modules PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers`, server on 8765.

## Gotchas
- All sources concatenate into one script: unique top-level names (build checks). `INV()` already prefixes `terms/`. Investopedia blocks automated checks. `reveal()` keeps Next clear of the phone nav. Tests match quiz options by textContent.
- Apostrophes inside single-quoted JS strings must be escaped (`\'`) — build now catches it.
- Apps Script: **Deploy → New deployment** after code changes; the URL changes, re-enter it in Settings (or use the device link).
- Playwright screenshots: block service workers or reloads abort.

## Owner setup status
- Repo renamed to lowercase `ibrahim-launchpad` (was created as `Ibrahim-launchpad`). Pages on (Source: GitHub Actions). Live: https://malmajed.github.io/ibrahim-launchpad/ (Pages paths are case-sensitive).
- Google Sheet "Ibrahim Launchpad Progress" created. Next: Apps Script (Code.gs v5), SECRET in Script properties, Deploy → New deployment, enter URL + secret in Settings.

## Next action
Finish owner setup (Apps Script backend), then batch 2.
