# TODO

- [x] Implement a unified network layer shared by mobile and web services.
- [x] Refactor mobile (Flutter) services to use NetClient.
- [x] Implement a unified network layer shared by mobile and web services.
- [x] Introduce NetClient class in Dart services and update tests.

# Outstanding Tasks

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

# In progress
- [x] Verify cross-platform behaviour of NetClient.
- [x] Verify cross-platform behaviour of LocationService.
- [x] Follow CI instructions for docs.
- [ ] Monitor CI for cross-tool coverage.
- [ ] Ensure CI passes with updated hashing.
- [ ] Fix container build scripts.
- [ ] Monitor repo progress.
 - [x] Integrate with AuthService.
- [ ] Integrate into PortfolioScreen.
 - [x] Implement refreshTotals and integrate with UI.
- [ ] Extend repositories for other domains.
- [ ] Implement remaining repositories.
- [ ] Enhance services to parse real API data.
- [ ] Monitor for further API integration.
- [ ] Use news data on NewsScreen.
- [ ] Expand store features.
- [x] Implement ranking for SymbolTrie suggestions.
- [x] Integrate helper in mobile services.
- [ ] Flesh out real API calls.
- [ ] Expand state usage across app.
- [ ] Expand to remaining service stubs.
- [ ] Wire Flutter store.
- [ ] Monitor CI runs.
- [x] Keep AGENTS.md up to date whenever CI tooling changes.

- [x] Ensure packages tests run via `npm ci` and `npm test` in CI workflow.

- [x] Ensure packages tests run via `npm ci` and `npm test` in CI workflow; workflow reordered to install web-app deps first.

- [x] Ensure packages tests run via `npm ci` and `npm test` in CI workflow.
- [x] Document that packages tests depend on web utilities; run `npm ci` in `web-app/` before `packages` tests.

- [x] Remember `mobile-app/packages/services` tests require `flutter test`.
- [x] Integrate Riverpod and Pinia state stores.
- [ ] Verify tsconfig paths whenever packages are added.
- [ ] Document that `packages/<pkg>/src` must import web utilities using '../../../web-app/src/'.
- [ ] Add check to ensure packages reference web utilities via '../../web-app/src/…' at the package root and '../../../web-app/src/…' inside `packages/<name>/src`.
- [ ] Verify tsconfig excludes to ensure package tests are ignored.
- [ ] Investigate flutter analyze errors from generated-dart serializers
- [x] Update Flutter services to pass ttlMs to NetClient calls
- [x] Document running `flutter pub get -C mobile-app/packages/services` after REST client generation
- [x] Fix README CI badge links for markdown-link-check
- [x] Fix README CI badge links for markdown-link-check
- [x] Add start_env.sh script to automate local setup
- [x] Document installing `@types` packages when adding new JS dependencies to avoid TS7016 errors.
