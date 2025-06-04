# Coding-Guard – Stock-App1

## General
1. **One domain concept per file** – one widget, service, or repository each.
2. **No cyclic imports**; remove unused imports (`dart fix`, `eslint --fix`).
3. **DRY** – extract any ≥ 3-line repetition into a helper.
4. **Small units** – functions ≤ 20 LOC, ≤ 2 nesting levels.
5. **Intent-revealing names** – `QuoteRepository`, not `DataMgr`.

## Safety & quality
6. Validate inputs first; `throw` on invalid data (fail-fast).
7. No hidden side-effects; keep variables at narrowest scope.
8. Prefer composition over inheritance.
9. **Secrets stay in `.env`**; never hard-code API keys.
10. Run `dart format`, `flutter analyze`, `eslint --fix`, `npm test`, `flutter test` before pushing.
11. Each public API/function has a doc-comment (Dart `///`, TS `/** … */`).
12. Write at least **one positive & one negative unit test** per public API; target ≥ 75 % branch coverage.
13. Log `loadTimeMs` and external-API latency (`apiCallMs`) in *debug* builds.
14. Use static typing everywhere; no `dynamic`/`any`.
15. Use Riverpod (Flutter) & Pinia (Vue) for state – avoid global mutable singletons.

## Environment & config
16. Runtime config ONLY via env-vars / secrets manager – `MARKETSTACK_KEY`, `NEWSDATA_KEY`, etc.
17. Lint-defined code style: 2-space indent, single quotes, trailing newline.

*(CI enforces CVE scans, licence checks, coverage threshold, and prettier formatting – see `.github/workflows/`.)*
