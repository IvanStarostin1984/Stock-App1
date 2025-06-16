# TODO

- Implement a unified network layer shared by mobile and web services.
- [x] Introduce NetClient class in Dart services and update tests.

# Outstanding Tasks

- [x] Implement `packages/core/net.ts` with 24h LRU cache and quota handling.
- [x] Start **shared-contracts** repo with spec and schema folders, then bundle the public APIs (`openapi.yaml`). (Repo hosted within main project)
- [x] Add JSON schema models with tests in shared-contracts.
- [x] Generate design tokens via style-dictionary for CSS and Dart.
- [x] Build Dart service package `smwa_services` using LruCache and ApiQuotaLedger.
- [x] Implement QuoteRepository (mobile & web)
- [x] Implement PortfolioRepository with IndexedDB persistence
- [x] Build TypeScript package `smwa-js-services` mirroring the Dart services.
- [x] Implement CredentialStore storing bcrypt hashes encrypted via AES in SharedPreferences.
- [x] Implement PortfolioRepository for Flutter using SharedPreferences
- [x] Build TypeScript package `smwa-js-services` mirroring the Dart services.
- [x] Fix CredentialStore bcrypt prefix bug (use gensalt prefix 2b)
- [x] Add GitHub CI and Netlify pipeline with Lighthouse checks.
- [x] Add a mobile-only CI workflow.
- [ ] Repository work underway.
- [x] Implement GPS-based LocationService returning ISO codes.


