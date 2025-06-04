# Contributor Guidelines for Stock-App1

This repository hosts a cross-platform stock market app with a Flutter mobile front‑end and a Vue 3 web PWA.  Follow these rules when adding or updating code.

# Important — Not authoritative:
1. This file is only a quick-start contributor guide.
2. For any requirement or design decision, /docs (SRS_v1.md, SDD_v1.md, original_assignment.md) is the sole authority; this file is only a convenience summary.
3. Always consult those documents first and treat AGENTS.md as secondary.

## Required Tools
- **Node 20** for the web app.
- **Flutter 3.22** for the mobile app.
- `openapi-generator-cli` (`openapitools.json` pins version 7.13.0) to refresh API clients under `packages/`.
- Charting stack is fixed to **Chart.js 4.4.9 (UMD, SRI-pinned)** and **fl_chart 0.66.x**; CI fails on drift.

## Setup & Build
1. Clone the repo and generate REST clients:
   ```bash
   cd packages
   npx @openapitools/openapi-generator-cli generate -i openapi.yaml -g typescript-fetch -o generated-ts
   npx @openapitools/openapi-generator-cli generate -i openapi.yaml -g dart-dio -o generated-dart
   cd ..
   ```
2. Mobile app:
   ```bash
   cd mobile-app
   flutter pub get && flutter run
   ```
3. Web app:
   ```bash
   cd web-app
   npm install && npm run dev
   ```

Create identical `.env` files in `mobile-app/` and `web-app/` containing:
```
VITE_MARKETSTACK_KEY=YOUR_MARKETSTACK_KEY
VITE_NEWSDATA_KEY=YOUR_NEWSDATA_KEY
VITE_EXCHANGERATE_KEY=YOUR_EXCHANGERATE_KEY
LHCI_GITHUB_APP_TOKEN=YOUR_LHCI_TOKEN  # CI only
```

## API hygiene
All external calls go through `/packages/core/net.ts` which  
* applies a **24 h LRU cache**,  
* throws **429** when > 100 Marketstack/FX calls · month⁻¹ or > 200 NewsData calls · day⁻¹.  
(See *docs/SRS_v1.md § 9.6.7 Limitations*.)

## Coding Standards
- One domain concept per file; no cyclic imports.
- Functions should stay under 20 lines with at most 2 nesting levels.
- Favour composition over inheritance and keep variables scoped tightly.
- Validate inputs early and throw on bad data.
- Secrets must remain in `.env`; never commit real API keys.
- Use 2‑space indentation, single quotes and end files with a newline.
- Document each public API/function with a doc comment.
- Log `loadTimeMs` and external API latency in debug builds.
- State management: Riverpod (Flutter) and Pinia (Vue) – avoid global singletons.

## Testing & CI
- Run `dart format`, `flutter analyze`, `flutter test`, `eslint --fix`, and `npm test` before committing.
- Provide at least one positive and one negative unit test per public API, aiming for ≥75 % branch coverage.
- GitHub Actions in `.github/workflows/ci.yml` will build the web app, run tests, trigger a Netlify deployment and execute Lighthouse CI. Keep the pipeline green.

# Quality gates
* **Lighthouse** perf & a11y ≥ 90 or CI fails.  
* **Core Web Vitals** budget: LCP ≤ 2.5 s, CLS < 0.10.  
* **Axe-core** a11y violations = 0.  
* **Flutter** frame time ≤ 16 ms (DevTools trace).  
* WCAG 2.1 AA colour contrast verified via axe-lint.

## Contributing Workflow
- Fork then branch off `main` using the pattern `feat/<topic>`.
- Ensure local tests pass before opening a PR.
- Each PR requires at least one reviewer.

Refer to `README.md` and full documentation in `docs/` for further details on features and architecture.
