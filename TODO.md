- [x] Split font weights from font family tokens for easier CSS usage.

# TODO

- [x] Add WatchListPage and store actions for watch list.

- [x] Implement a unified network layer shared by mobile and web services.
- [x] Implement local WatchListRepository for web
- [x] Implement WatchListRepository for mobile
- [x] Expose syncWatchList via AppStateNotifier and PortfolioScreen
- [x] Refactor mobile (Flutter) services to use NetClient.
- [x] Implement a unified network layer shared by mobile and web services.
- [x] Introduce NetClient class in Dart services and update tests.

- [x] Resolved merge conflict in NOTES.md and preserved entry order.
- [x] Documented rule to keep NOTES.md chronological and reordered entries.
- [x] Removed leftover merge markers from NOTES.md entry on 2025-08-02 and combined summaries.

# Outstanding Tasks

- [x] Add parity tests for NewsService
- [x] Extend NewsService parity tests for TTL, ledger and RSS fallback
- [x] Implement RSS fallback in mobile NewsService

- [x] Implement `packages/core/net.ts` with 24h LRU cache and quota handling.
- [x] Start **shared-contracts** repo with spec and schema folders, then bundle the public APIs (`openapi.yaml`). (Repo hosted within main project)
- [x] Add JSON schema models with tests in shared-contracts.
- [x] Generate design tokens via style-dictionary for CSS and Dart.
- [x] Build Dart service package `smwa_services` using LruCache and ApiQuotaLedger.
- [x] Implement QuoteRepository (mobile & web)
- [x] Document tsconfig path requirement when importing packages to avoid TS6307.
- [x] Implement PortfolioRepository with IndexedDB persistence
- [x] Build TypeScript package `smwa-js-services` mirroring the Dart services.
- [x] Implement CredentialStore storing bcrypt hashes encrypted via AES in SharedPreferences.
- [x] Implement PortfolioRepository for Flutter using SharedPreferences
- [x] Build TypeScript package `smwa-js-services` mirroring the Dart services.
- [x] Fix CredentialStore bcrypt prefix bug (use gensalt prefix 2b)
- [x] Add GitHub CI and Netlify pipeline with Lighthouse checks.
- [x] Add a mobile-only CI workflow.
- [x] Repository work underway.
- [x] Implement GPS-based LocationService returning ISO codes.
- [x] Add CountrySettingRepository for the web using localStorage.
- [x] Implement CountrySettingRepository for web.
- [x] Integrate LocationService with web store and add tests.
- [x] Document tokens build dependency before Flutter analysis.
- [x] Added root analysis_options.yaml for repo-level analyzer.
- [x] Include packages/core in web tsconfig to fix vue-tsc list errors.
- [x] Exclude package tests directories when adding their sources to web tsconfig.
- [x] Add ttl parameter to NetClient and pass specific durations in services with tests.
- [x] Remove obsolete `web-app/packages/services` folder; services live in
      `web-app/src/services`.
- [x] Add tests for `useLoadTimeLogger` hook.
- [x] Add negative tests for AuthService login.
- [x] Install and maintain `@types/crypto-js` and `@types/bcryptjs` for web AuthService.

# In progress

- [x] Verify cross-platform behaviour of NetClient.
- [x] Verify cross-platform behaviour of LocationService.
- [x] Follow CI instructions for docs.
- [x] Monitor CI for cross-tool coverage.
- [x] Ensure CI passes with updated hashing.
- [x] Fix container build scripts.
- [ ] Monitor repo progress.
- [x] Integrate with AuthService.
- [x] Integrate into PortfolioScreen.
- [x] Implement refreshTotals and integrate with UI.
- [x] Extend repositories for other domains.
- [x] Enhance services to parse real API data.
- [x] Implement remaining repositories.
- [ ] Monitor for further API integration.
- [x] Use news data on NewsScreen.
- [ ] Expand store features.
- [x] Implement ranking for SymbolTrie suggestions.
- [x] Integrate helper in mobile services.
- [x] Flesh out real API calls.
- [ ] Expand state usage across app.
- [x] Expand to remaining service stubs.
- [ ] Wire Flutter store.
- [ ] Monitor CI runs.
- [x] Keep AGENTS.md up to date whenever CI tooling changes.

- [x] Enforce flutter analyze step in CI after dependencies install.
- [x] Add linter to verify NOTES.md entries start with a proper heading and remain newest-first.

- [x] Ensure packages tests run via `npm ci` and `npm test` in CI workflow.

- [x] Ensure packages tests run via `npm ci` and `npm test` in CI workflow; workflow reordered to install web-app deps first.

- [x] Ensure packages tests run via `npm ci` and `npm test` in CI workflow.
- [x] Document that packages tests depend on web utilities; run `npm ci` in `web-app/` before `packages` tests.

- [x] Remember `mobile-app/packages/services` tests require `flutter test`.
- [x] Integrate Riverpod and Pinia state stores.
- [x] Verify tsconfig paths whenever packages are added.
- [x] Document import rules for shared packages:
  - Files at `packages/<name>/` use `'../../web-app/src/...`'.
  - Files under `packages/<name>/src/` use `'../../../web-app/src/...`'.
- [x] Add check to ensure packages reference web utilities via '../../web-app/src/…' at the package root and '../../../web-app/src/…' inside `packages/<name>/src`.
- [x] Verify tsconfig excludes to ensure package tests are ignored.
- [x] Add vitest config in packages to ignore generated clients from coverage.
- [x] Moved coverage exclusions under test.coverage to fix generated clients in reports.
- [x] Investigate flutter analyze errors from generated-dart serializers
- [x] Update Flutter services to pass ttlMs to NetClient calls
- [x] Document running `flutter pub get -C mobile-app/packages/services` after REST client generation
- [x] Fix README CI badge links for markdown-link-check
- [x] Fix README CI badge links for markdown-link-check
- [x] Add start_env.sh script to automate local setup
- [x] Update CI workflows to pass API keys via `--dart-define`
- [x] Add type stubs for crypto libraries and document tsconfig changes
- [x] Document installing `@types` packages when adding new JS dependencies to avoid TS7016 errors.
- [x] Verify RSS fallback on mobile NewsService.
- [x] Document customizing the `<your-user>` placeholder after forking the repo.
- [x] Keep `packages/vitest.config.ts` exclude patterns in sync with README
      coverage instructions.
- [x] Keep `packages/vitest.config.ts` exclude patterns in sync with README
      coverage instructions.
- [x] Maintain >75% coverage for packages tests
- [x] Add linter or pre-test step that verifies vitest config syntax parses.
- [x] Add script to detect merge conflict markers and run it in CI.
- [x] Create web-prototype directory with placeholder HTML pages for design.
- [x] Import colours and fonts from `web-prototype/CSS/styleguide.css` into `web-app/design-tokens/tokens.json`.
- [x] Bundle prototype fonts in the PWA (verify licenses).
- [x] Rebuild Vue pages to match `web-prototype/*.html` using the new tokens.
- [x] Fix AppState register return type to map service credential to domain model.
