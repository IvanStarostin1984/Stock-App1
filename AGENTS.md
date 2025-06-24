# Contributor Guidelines for Stock-App1

This repository hosts a cross-platform stock market app with a Flutter mobile front‑end and a Vue 3 web PWA.  Follow these rules when adding or updating code.

# Important — Not authoritative:
1. This file is only a quick-start contributor guide.
2. For any requirement or design decision, /docs (SRS_v1.md, SDD_v1.md, original_assignment.md) is the sole authority; this file is only a convenience summary.
3. If following SRS_v1.md, SDD_v1.md produces a conflict, or not working code, treat original_assignment.md as single source of truth. Inform end-user about such situation with *IMPORTANT* disclaimer.
4. Always consult those documents first and treat AGENTS.md as secondary.
5. End-user of codex may explicitly ask to modify SRS_v1.md and/or SDD_v1.md, in that case comply.

#Distinct-files rule:
1. Every concurrent task must confine its edits to a unique list of code or data files.
2. Shared exceptions: any task may append (never rewrite) the markdown logs NOTES.md, TODO.md, and this AGENTS.md.
3. If two or more open PRs would touch the same non-markdown file, cancel or re-scope one of them before continuing.

## Required Tools
- **Node 20** for the web app.
- **Flutter 3.22** for the mobile app.
- `openapi-generator-cli` (`openapitools.json` pins version 7.13.0) to refresh API clients under `packages/`.
- Charting stack is fixed to **Chart.js 4.4.9 (UMD, SRI-pinned)** and **fl_chart 0.66.x**; CI fails on drift.

## Setup & Build
1. Clone the repo and generate REST clients:
   ```bash
   cd packages
   npm run gen:clients
   npm ci
   cd ..
   ```
   This script replaces running `npm run gen:ts` and `npm run gen:dart` separately.
2. Install dependencies:
   ```bash
   ./start_env.sh
   ```
3. Mobile app:
   ```bash
   cd mobile-app
   flutter run
   ```
4. Web app:
   ```bash
   cd web-app
   npm install && npm run dev
   ```
`start_env.sh` installs all Node and Flutter dependencies,
including running `flutter pub get -C mobile-app/packages/services` so
the shared packages are ready for tests and analysis.
4. When TypeScript files outside `web-app/src/` are imported (e.g. under
   `packages/`), update `web-app/tsconfig.json` to include those paths and
   exclude `../packages/**/tests` so vue-tsc skips package tests.
   Missing entries cause TS6307 build failures.
   Files inside `packages/<name>/src` are three levels deep, so imports of web
   utilities must use `'../../../web-app/src/…'`. Files at the package root use
   `'../../web-app/src/…'`.

Create identical `.env` files in `mobile-app/` and `web-app/` containing:
```
VITE_MARKETSTACK_KEY=YOUR_MARKETSTACK_KEY
VITE_NEWSDATA_KEY=YOUR_NEWSDATA_KEY
LHCI_GITHUB_APP_TOKEN=YOUR_LHCI_TOKEN  # CI only
```
(Exchangerate.host is key-less – no variable needed.)

## Shared Packages
- When creating a new package under `packages/`, add its `src` folder to
  `web-app/tsconfig.json` under `compilerOptions.paths`.
- Keep `../packages/**/tests` listed in `exclude` so `vue-tsc` ignores package
  tests.
- Files directly inside a package import utilities from the web app with
  `'../../web-app/src/…'` while files under `packages/<name>/src/` use
  `'../../../web-app/src/…'`.

## Design Reference
The folder `web-prototype/` contains HTML/CSS exported from Figma. Treat it as read-only. Colours and font names in `web-app/design-tokens/tokens.json` are parsed from `web-prototype/CSS/styleguide.css`. Copy layout cues manually when building Vue pages.

## API hygiene
(API requests are implemented in service classes under `web-app/src/services/`.)
Each service uses `LruCache`, `ApiQuotaLedger` and the shared `NetClient`
wrapper. MarketstackService and FxService cache results for 24 h while
NewsService caches data for only 12 h. The TTL must be passed to
`NetClient.get`/`fetchJson` when calling the API to enforce the correct
caching period. Free‑tier quotas remain ≤ 100 Marketstack/FX calls · month⁻¹,
≤ 200 NewsData calls · day⁻¹.
(See *docs/SRS_v1.md § 9.6.7 Limitations*.)

## Coding Standards
- One domain concept per file; no cyclic imports.
- Functions should stay under 20 lines with at most 2 nesting levels.
- Favour composition over inheritance and keep variables scoped tightly.
- Validate inputs early and throw on bad data.
- Secrets must remain in `.env`; never commit real API keys.
- Use 2‑space indentation, single quotes and end files with a newline.
- Document each public API/function with a doc comment.
- When introducing new JS packages in `web-app`, also install the matching
  `@types/...` package (or provide a custom `.d.ts`) to prevent TS7016
  compilation errors.
- Log `loadTimeMs` and external API latency in debug builds.
- State management: Riverpod (Flutter) and Pinia (Vue) – avoid global singletons.
- The generic parameter of `NetClient.get<T>` must match the transform function's
  return type.
- Pass an explicit `ttl` to `NetClient.get` when services need a different
  cache duration.
(These frameworks are planned; current code does not yet use them.)

## Testing & CI
- Run `dart format`, `flutter analyze`, `flutter test`, `eslint --fix`, and `npm test` before committing.
- `flutter analyze` at the repo root uses `analysis_options.yaml` which includes
  `mobile-app/analysis_options.yaml` and excludes generated design tokens.
- Run `npm install` in `web-app/` before tests so the style-dictionary build step works.
- Package tests import utilities from `web-app/src/`, so run `npm ci` in `web-app/` before executing tests in `packages/`.
- After setting up Node, run `npm ci` and `npm test` in `packages/` to verify the
  shared client packages.
- After generating REST clients, run `flutter pub get -C mobile-app/packages/services` so
  the service package has its dependencies ready.
- Run `npm run tokens` (or run tests) before any Flutter analysis or build steps so `tokens.dart` exists.
- Run `npm run tokens` before web tests if you invoke `npx vitest` or `npx jest` directly. Their pretest hook does not run automatically.
- Flutter tests require API keys via `--dart-define`. CI passes a dummy NewsData key:
  `flutter test --dart-define=VITE_NEWSDATA_KEY=test`.
  Include `--dart-define=VITE_MARKETSTACK_KEY=dummy` locally if Marketstack API calls run in tests.
- `mobile-app/packages/services` uses Flutter plugins, so its tests must run via `flutter test` (not `dart test`).
- The shared packages under `packages/` install via `npm ci` and run `npm test` in CI.
- Run the documentation link check with Node 20 (use `-y` to skip prompts):
  `npx -y markdown-link-check README.md`.
- CI runs this check via `.github/workflows/docs.yml`. Run it locally whenever you edit README or other docs files.
- Ensure the OpenAPI spec reports zero warnings: `npx openapi lint spec/openapi.yaml`.
- Provide at least one positive and one negative unit test per public API, aiming for ≥75 % branch coverage.
- Add parity tests under `web-app/tests/*Parity.test.ts` and
  `mobile-app/packages/services/test/*_parity_test.dart` to keep mobile and web
  implementations consistent. These tests must cover cache expiry, ledger usage
  and error handling across platforms.
- GitHub Actions in `.github/workflows/ci.yml` will build the web app, run tests, trigger a Netlify deployment and execute Lighthouse CI. Keep the pipeline green.
- Coverage is enforced in CI using `vitest --coverage` and `flutter test --coverage`; each must report ≥75 % or the job fails. Coverage reports upload as artifacts.
- Generated REST clients under `packages/generated-ts` and `packages/generated-dart` are excluded from coverage.
- Coverage also excludes shared utilities under `packages/core/src/**` and the
  config file `packages/vitest.config.ts`. Keep this list in sync with the
  README and `packages/vitest.config.ts` itself.
 - After editing `packages/vitest.config.ts` (or any vitest config), run `npm run lint:vitest-config` to ensure it parses.
   This command relies on Vitest's built‑in `dot` reporter, so avoid
   overriding `--reporter` when editing it.
 - CI runs this script right after installing package dependencies so broken config files fail early.

# Quality gates
* **Lighthouse** perf & a11y ≥ 90 or CI fails.  
* **Core Web Vitals** budget: LCP ≤ 2.5 s, CLS < 0.10.  
* **Axe-core** a11y violations = 0.  
* **Flutter** frame time ≤ 16 ms (DevTools trace).  
* WCAG 2.1 AA colour contrast verified via axe-lint.

### Requirement traceability

* **Always comment generated code with requirement IDs** (`FR-`, `US-`, `QR-`, etc).  
  Example:
  ```dart
  /// FR-123 – Place trade order
  /// US-04  – “As a user, I can buy stocks…”
  /// QR-02  – < 200 ms round-trip
  ```

## Contributing Workflow
- **Fork** then branch off `main` using the pattern `feat/<topic>`.
- **Ensure local tests pass** before opening a PR.
- Run `npx -y markdown-link-check README.md` whenever docs are updated to avoid prompts and keep the docs CI job green.
- Update the `<your-user>` placeholder in README badges and clone commands with your GitHub username after forking.
- **Each PR requires at least one reviewer.**

## Decision & Progress Logging
To keep project history and reasoning transparent **and** trace every change back to official documentation,  
**every contribution must include**:

### PR Decision Checklist *(in the PR description)*
- **Major design decisions** and their rationale  
- **Any deviations** from `/docs` (`SRS_v1.md`, `SDD_v1.md`) or this `AGENTS.md`  
- **Blockers / limitations**, e.g., failing tests or unmet dependencies  
- **Requirements addressed**: list the exact IDs touched, e.g.  
  `FR-01`, `US-03`, `QR-02` <br>
  *(Use the IDs defined in `SRS_v1.md` § 4 “Functional Requirements”, § 5 “User Stories”,  
  and `SDD_v1.md` § 7 “Quality Requirements”.)*

### Progress Log (`Notes.md`)
Append **one new section at the top of `NOTES.md`** (newest entry first) using this template:

```markdown
## YYYY-MM-DD PR #<number>
- **Summary**: …
- **Stage**: …
- **Requirements addressed**: FR-01, US-03, QR-02
- **Deviations/Decisions**: …
- **Next step**: …
- **Notes**: … (optional)
```
- Older entries must never precede newer ones; keep the log newest first.
Agents MUST consult Notes.md and the referenced requirement IDs before starting work
to understand the current stage, past decisions, and open questions tied to the spec.

Refer to `README.md` and full documentation in `docs/` for further details on features and architecture.
