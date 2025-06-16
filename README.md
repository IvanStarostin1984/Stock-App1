# Stock-App1 · **SMWA – Stock Market Mobile & Web Application**

[![CI • unit → build → Lighthouse](https://github.com/IvanStarostin1984/Stock-App1/actions/workflows/ci.yml/badge.svg)](https://github.com/IvanStarostin1984/Stock-App1/actions)

> **One code-base → two front-ends**: a Flutter 3 .22 mobile app **and** a responsive Vue-powered PWA that surface *end-of-day* market data **without** busting free-tier API limits.

---
## ==== External API tokens (never commit real values) ====
VITE_MARKETSTACK_KEY=YOUR_MARKETSTACK_KEY
VITE_NEWSDATA_KEY=YOUR_NEWSDATA_KEY
LHCI_GITHUB_APP_TOKEN=YOUR_LHCI_TOKEN  # CI only

## ✨ Features (MVP = 6 mobile screens · 6 web pages)

| Screen ↔ Page | What you get | FR / PF ref. |
| ------------- | ------------ | ------------ |
| **Main** | 📈 *Headline index* with Δ % & colour-/shape-safe ▲▼ cues | PF-001·FR-0101 |
| **Search** (omnipresent) | 🔍 *Global autocomplete* across 10 k tickers (0 external calls) | PF-012·FR-0112 |
| **Detail** | 🕰 *Interactive OHLC charts* (1 d / 1 m / 3 m / 1 y) | PF-002·FR-0102 |
| **News + Prices** | 💹 *Top 5 gainers & losers* · 📰 *News digest* (NewsData.io → RSS fallback) | PF-003/004·FR-0103/0104 |
| **Portfolio** | 👜 *Local tracker* with hourly auto-refresh; EUR ↔ USD ↔ local toggle | PF-006/007·FR-0106/0107 |
| **Pro** | ⭐ *Mock “Pro” upgrade* via `stripe-mock` | PF-008·FR-0108 |

> **Exam-spec quirks covered**<br>
> • 6 distinct screens/pages • App Bar with titles • unique launcher icon & rotation-safe assets

---

## 🏗 Tech Stack

| Layer         | Tech                                                                         |
| ------------- | ---------------------------------------------------------------------------- |
| **Mobile**    | Flutter 3 .22 / Dart 3 .3 · [`fl_chart`](https://pub.dev/packages/fl_chart) |
| **Web**       | Vite + Vue 3 / Pinia · Bootstrap 5 · Chart.js 4                               |
| **Data**      | Marketstack · Exchangerate.host (key-less) · NewsData.io                      |
| **Storage**   | IndexedDB / SharedPrefs · **LruCache** · **ApiQuotaLedger**                   |
| **Networking**| Reusable **NetClient** shared between mobile and web |
| **CI / CD**   | GitHub Actions → Netlify (free) · Lighthouse CLI ≥ 90/100                    |

---

### Prerequisites
Before running the apps ensure the correct toolchains are installed:
* **Node 20** for the web app
* **Flutter 3.22** for the mobile app
Detailed setup steps live in `AGENTS.md`.

## 🚚 Quick Start

```bash
# 1 · Clone
git clone https://github.com/IvanStarostin1984/Stock-App1.git
cd Stock-App1

# 2 · Generate REST clients
cd packages
npm run gen:clients   # runs gen:ts and gen:dart
cd ..

# 3 · Mobile (Flutter)
cd mobile-app
flutter pub get && flutter run        # launches Android emulator

# 4 · Web (PWA)
cd ../web-app
npm install && npm run dev            # ⇒ http://localhost:5173
Required env vars (MVP)
Variable	Example	Purpose
VITE_MARKETSTACK_KEY	9b3e…	EoD quotes
VITE_NEWSDATA_KEY	pub_123…	News digest
LHCI_GITHUB_APP_TOKEN gh_abc…   Lighthouse CI (CI only)

Create identical .env files in mobile-app/ and web-app/.
(Exchangerate.host is key-less – no variable needed.)

The Flutter app resolves your country once on startup and stores it in
`SharedPreferences` via `CountrySettingRepository`. The web PWA uses a
matching repository backed by `localStorage`.

📂 Repo Layout
packages/           shared DTOs + generated REST clients
mobile-app/         Flutter application (6 screens)
web-app/            PWA (Vue 3 + Vite, 6 pages)
.github/workflows/  CI → unit → build → Lighthouse → Netlify deploy
docs/               full ISO/IEC 29148 SRS, architecture, slides
🔒 Free-Tier Guardrails (LIM-0003 … 0007 / 0016)
API	Hard limit	Guard-rail (enforced by ApiQuotaLedger)
Marketstack	100 req / month	24 h LRU cache · ≤ 3 calls day-¹
Exchangerate.host	100 req / month	24 h cache · EUR↔USD pre-warm
NewsData.io	200 req / day	12 h cache · automatic RSS fallback

Toast warning at ≥ 90 % of any quota.

### Network client
`packages/core/net.ts` exposes `NetClient` to standardise HTTP calls.
Services pass a cache and transform function:

```ts
const client = new NetClient(new ApiQuotaLedger(100));
client.get(url, cache, json => json.value);
```
The Flutter app uses the same abstraction via `packages/services/lib/src/fetch_json.dart`.
The PWA's services now live directly under `web-app/src/services/`; the old
`web-app/packages/services/` package has been removed.

⚙️ Useful Scripts
Task	Mobile	Web
Dev hot-reload	flutter run	npm run dev
Unit tests      flutter test (in mobile-app/)    npm test (in web-app/)
Lint / format	dart format .	npm run lint
REST clients    –               npm run gen:clients (in packages/)
Build (CI)	GitHub Action → Netlify preview	(same)
`npm run lint` in `web-app/` runs ESLint with auto-fix enabled for all TypeScript and Vue files. The linter is configured via `eslint.config.js`, enforcing 2-space indentation and single quotes.

🛣 Road-map / OPT-Later
🌩 Cloud watch-list sync (Supabase REST)

💳 Server-side checkout (Netlify Edge Fn + Stripe test)
These components are feature-flagged (backendMode = remote) and kept out of the free-tier MVP.

🤝 Contributing
Fork → branch feat/<topic>

Run tests from each app before pushing:
```bash
cd mobile-app && flutter test
cd ../web-app && npm test
```

flutter test and npm test – keep CI green

PR → main, 1 reviewer min.

📜 License
MIT. Third-party icons/images retain their original licenses (see /docs/ATTRIBUTION.md).

README kept intentionally lean – the complete ISO/IEC 29148-compliant SRS & architecture live in /docs.
