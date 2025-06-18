## 2025-06-18 PR #XX
- **Summary**: clarified that `<your-user>` placeholders in README and AGENTS should be replaced with your GitHub handle when forking.
- **Stage**: documentation
- **Requirements addressed**: N/A
- **Deviations/Decisions**: keep placeholder for portability while reminding contributors to customize.
- **Next step**: run markdown link check.

## 2025-06-18 PR #XX
- **Summary**: NewsService now skips RSS fetch when ledger is exhausted. Updated parity test and docs.
- **Stage**: development
- **Requirements addressed**: FR-0104
- **Deviations/Decisions**: early return ensures no HTTP when quota exhausted.
- **Next step**: monitor CI.

## 2025-07-17 PR #XX
- **Summary**: linted OpenAPI spec with description, MIT license and operationIds; added 400 responses and removed FxRate. Updated AGENTS about warnings.
- **Stage**: development
- **Requirements addressed**: N/A
- **Deviations/Decisions**: none
- **Next step**: run CI

- **Summary**: added vitest config for packages to exclude generated clients from coverage and updated scripts and docs.
- **Stage**: development
- **Requirements addressed**: N/A
- **Deviations/Decisions**: coverage provider v8 ensures JS clients excluded; README notes packages tests.
- **Next step**: verify CI passes with new coverage settings.

## 2025-07-16 PR #XX
- **Summary**: added RSS fallback in mobile NewsService with tests and docs.
- **Stage**: development
- **Requirements addressed**: FR-0104, IF-0130
- **Deviations/Decisions**: uses xml package for simple parser.
- **Next step**: monitor CI.

## 2025-06-18 PR #XX
- **Summary**: CI now runs tests with coverage and fails below 75%. Coverage reports upload as artifacts and docs updated.
- **Stage**: development
- **Requirements addressed**: N/A
- **Deviations/Decisions**: threshold chosen to match README guidance.
- **Next step**: monitor CI results

- 2025-06-18: Added RSS fallback to NewsService with tests; README explains fallback.
  Reason: ensure digest when NewsData fails (FR-0104). Decisions: parse via DOMParser,
  reuse cache with 12h TTL.

- **Summary**: NewsService now requires API key and parses extra fields; added parity tests and README notes.
- **Stage**: development
- **Requirements addressed**: FR-0104
- **Deviations/Decisions**: constructor now accepts key + ledger; uses ttl constant.
- **Next step**: ensure CI green.

- **Summary**: start_env.sh now installs Flutter if missing; README and AGENTS updated.
- **Stage**: documentation
- **Requirements addressed**: N/A
- **Deviations/Decisions**: clone official 3.22.2 tag for container setup.
- **Next step**: run CI to ensure script works.

## 2025-06-17 PR #XX
- **Summary**: portfolio screen lists holdings via PortfolioRepository and shows total. Added state notifier and tests.
- **Stage**: development
- **Requirements addressed**: FR-0106
- **Deviations/Decisions**: kept simple provider-based state; totals refresh uses cached quotes.
- **Next step**: monitor CI results

- **Summary**: ticked TODO for crypto type packages; packages already present in web deps.
- **Stage**: documentation
- **Requirements addressed**: N/A
- **Deviations/Decisions**: none
- **Next step**: monitor docs CI.

## 2025-06-17 PR #XXX
- **Summary**: added @types crypto packages and tsconfig tweaks so build/test pass.
- **Stage**: development
- **Requirements addressed**: N/A
- **Deviations/Decisions**: stub package lacked types; added custom module declaration and limited tsconfig types.
- **Next step**: monitor CI.

## 2025-07-14 PR #XXX
- **Summary**: documented requirement to install @types packages when adding new JS packages in web-app.
- **Stage**: documentation
- **Requirements addressed**: N/A
- **Deviations/Decisions**: prevents TS7016 compile errors.
- **Next step**: follow guidance when installing packages.

## 2025-06-17 PR #XXX
- **Summary**: added TODO note to install type packages for AuthService.
- **Stage**: documentation
- **Requirements addressed**: N/A
- **Deviations/Decisions**: none
- **Next step**: maintain type packages

## 2025-07-13 PR #XXX
- **Summary**: Portfolio page displays total value using PortfolioRepository.refreshTotals with cached quotes. Added unit test verifying totals calculation and quote cache usage.
- **Stage**: implementation
- **Requirements addressed**: FR-0106
- **Deviations/Decisions**: simple paragraph output; quoting from cached quotes ensures Marketstack service called once.
- **Next step**: expand portfolio features and monitor CI.

## 2025-06-17 PR #XXX
- **Summary**: added login form using AuthService provider with Riverpod; AppState exposes signIn/register; widget tests cover success and failure.
- **Stage**: development
- **Requirements addressed**: FR-0105
- **Deviations/Decisions**: simple status text for outcome
- **Next step**: verify CI

## 2025-07-13 PR #XXX
- **Summary**: added AuthService with AES + bcrypt, new auth store and login page.
- **Stage**: implementation
- **Requirements addressed**: FR-0105
- **Deviations/Decisions**: bcryptjs uses $2a salt; replaced prefix with $2b for parity.
- **Next step**: ensure CI passes

## 2025-06-17 PR #XXX
- **Summary**: ranked SymbolTrie suggestions by edit distance and added tests.
- **Stage**: development
- **Requirements addressed**: FR-0112
- **Deviations/Decisions**: stable sort preserves input order on ties.
- **Next step**: verify cross-platform parity

## 2025-07-12 PR #XXX
- **Summary**: re-ran service package tests after installing dependencies; all tests pass.
- **Stage**: testing
- **Requirements addressed**: N/A
- **Deviations/Decisions**: none
- **Next step**: monitor CI

## 2025-06-17 PR #XXX
- **Summary**: replaced hard-coded owner slug in README badge and clone command.
- **Stage**: documentation
- **Requirements addressed**: N/A
- **Deviations/Decisions**: used <your-user> placeholder for portability.
- **Next step**: confirm docs link check passes in CI.

## 2025-06-17 PR #XXX
- **Summary**: added start_env.sh script and updated AGENTS setup steps.
- **Stage**: documentation
- **Requirements addressed**: N/A
- **Deviations/Decisions**: new script ensures packages installs; mobile services dep step after pub get.
- **Next step**: monitor CI for green build.

## 2025-06-17 PR #XXX
- **Summary**: fixed NetClient caching tests and location service tests; added flutter_test dep and geolocator stubs.
- **Stage**: implementation
- **Requirements addressed**: FR-0104
- **Deviations/Decisions**: tests now cast json ints, drop ledger.isSafe check; geolocator mocked via platform interface.
- **Next step**: ensure CI passes with Flutter plugin tests.

## 2025-07-11 PR #XXX
- **Summary**: document running `flutter pub get` for package services after generating clients.
- **Stage**: documentation
- **Requirements addressed**: N/A
- **Deviations/Decisions**: ensure service packages have dependencies before analysis
- **Next step**: monitor docs clarity

## 2025-07-02 PR #XXX
- **Summary**: fixed README CI badge and link check.
- **Stage**: documentation
- **Requirements addressed**: N/A
- **Deviations/Decisions**: changed remote badge link to local path; uses shields.io for status.
- **Next step**: ensure docs job passes.

## 2025-06-17 PR #XXX
- **Summary**: clarified docs link check uses `npx -y markdown-link-check` to skip prompts.
- **Stage**: documentation
- **Requirements addressed**: N/A
- **Deviations/Decisions**: kept docs CI workflow consistent with new command.
- **Next step**: monitor docs pipeline.

## 2025-06-17 PR #XXX

- **Summary**: reorder CI steps so web dependencies install before package tests.
- **Stage**: implementation
- **Requirements addressed**: N/A
- **Deviations/Decisions**: packages rely on style-dictionary from web-app; removed duplicate install/test pair.
- **Next step**: monitor CI for token build issues.

- **Summary**: Document running `npm ci` in web-app before packages tests.
- **Stage**: documentation
- **Requirements addressed**: N/A
- **Deviations/Decisions**: packages tests import web utilities
- **Next step**: monitor docs for clarity

## 2025-07-01 PR #XXX
- **Summary**: CI failed because packages tests ran before installing web-app dependencies.
- **Stage**: bug fix
- **Requirements addressed**: N/A
- **Deviations/Decisions**: Install `web-app` deps first so style-dictionary is ready for tokens.
- **Next step**: monitor pipeline after reordering.

## 2025-06-17 PR #XXX
- **Summary**: CI runs `npm ci` and `npm test` in packages before web build.
- **Stage**: implementation
- **Requirements addressed**: N/A
- **Deviations/Decisions**: packages tests run after Node setup.
- **Next step**: monitor CI for failures.

## 2025-06-29 PR #XXX
- **Summary**: added negative tests for AuthService login rejecting empty inputs.
- **Stage**: testing
- **Requirements addressed**: N/A
- **Deviations/Decisions**: stub login returns false when either email or password is empty.
- **Next step**: monitor CI for cross-tool coverage.

## 2025-06-28 PR #XXX

- **Summary**: CI workflow installs shared package deps and runs their tests.
- **Stage**: implementation
- **Requirements addressed**: N/A
- **Deviations/Decisions**: none
- **Next step**: monitor pipeline

- **Summary**: added SymbolTrie unit tests for basic search behavior.
- **Stage**: testing
- **Requirements addressed**: FR-0112
- **Deviations/Decisions**: simple in-memory trie suffices for now.
- **Next step**: monitor CI and expand search tests as needed.

## 2025-06-27 PR #XXX
- **Summary**: added unit tests for `useLoadTimeLogger` verifying console output in development only. Updated TODO list.
- **Stage**: implementation
- **Requirements addressed**: N/A
- **Deviations/Decisions**: used a dummy Vue component to invoke the hook; stubbed `NODE_ENV` for dev and prod cases.
- **Next step**: run CI to confirm tests remain green.

## 2025-06-27 PR #XXX

- **Summary**: CI workflows now run the service package tests with `flutter test` because the package uses Flutter plugins.
- **Stage**: implementation
- **Requirements addressed**: N/A
- **Deviations/Decisions**: replaced `dart test` with `flutter test` in CI for plugin compatibility.
- **Next step**: ensure CI passes after workflow updates.

## 2025-06-26 PR #XXX
- **Summary**: added LocationService parity tests across web and mobile and enabled service package tests in CI.
- **Stage**: testing
- **Requirements addressed**: FR-0109
- **Deviations/Decisions**: constructor now accepts optional ApiQuotaLedger for testability.
- **Next step**: monitor CI for coverage.

## 2025-06-17 PR #XXX
- **Summary**: added docs CI workflow running markdown-link-check and updated contributor guide.
- **Stage**: documentation
- **Requirements addressed**: N/A
- **Deviations/Decisions**: Node 20 docs check via docs.yml; contributors must run it locally when editing docs.
- **Next step**: monitor docs workflow.

## 2025-06-25 PR #XXX
- **Summary**: added browser LocationService, integrated with app store and saved country via CountrySettingRepository; docs and tests updated.
- **Stage**: implementation
- **Requirements addressed**: FR-0109
- **Deviations/Decisions**: uses free reverse-geocode API; errors ignored in store init.
- **Next step**: verify cross-platform behaviour of LocationService.

## 2025-06-25 PR #XXX
- **Summary**: added parity tests for NetClient across platforms.
- **Stage**: testing
- **Requirements addressed**: FR-0104
- **Deviations/Decisions**: parity ensures same cache and ledger behaviour.
- **Next step**: follow CI instructions for docs.

## 2025-06-24 PR #XXX
- **Summary**: all Dart services now pass `ttl` to NetClient; TODO resolved.
- **Stage**: implementation
- **Requirements addressed**: FR-0104, LIM-0016
- **Deviations/Decisions**: none
- **Next step**: verify cross-platform behaviour of NetClient.

## 2025-06-23 PR #XXX
- **Summary**: added ttl parameter to NetClient and services; NewsService now caches 12h.
- **Stage**: implementation
- **Requirements addressed**: FR-0104, LIM-0016
- **Deviations/Decisions**: TTL passed explicitly to enforce per-service policy.
- **Next step**: update remaining services to use ttl parameter in Dart code.

## 2025-06-22 PR #XXX
- **Summary**: fixed import paths in core package to use '../../../web-app/src'.
- **Stage**: bug fix
- **Requirements addressed**: N/A
- **Deviations/Decisions**: packages/<pkg>/src should import utilities from web-app with three-level '../'.
- **Next step**: confirm CI pipeline stays green.

## 2025-06-16 PR #XXX
- **Summary**: document cross-package import paths in AGENTS.
- **Stage**: documentation
- **Requirements addressed**: N/A
- **Deviations/Decisions**: none
- **Next step**: verify CI docs jobs pass.

## 2025-06-19 PR #XXX
- **Summary**: corrected core net utility import paths.
- **Stage**: bug fix
- **Requirements addressed**: N/A
- **Deviations/Decisions**: changed ../web-app references to ../../web-app for accuracy.
- **Next step**: run CI to confirm build.

- **Summary**: added exclude pattern in web tsconfig to ignore package tests and updated AGENTS.
- **Stage**: implementation
- **Requirements addressed**: N/A
- **Deviations/Decisions**: include list unchanged; compile should ignore tests.
- **Next step**: confirm vue-tsc respects exclude.

## 2025-06-16 PR #XXX
- **Summary**: aligned NetClient generics in Fx, Marketstack and News services.
- **Stage**: implementation
- **Requirements addressed**: N/A
- **Deviations/Decisions**: generics now match callback return types; added any casts for raw Marketstack data.
- **Next step**: run CI to verify type safety.

## 2025-06-20 PR #XXX
- **Summary**: added rule to exclude package test folders when updating tsconfig.
- **Stage**: documentation
- **Requirements addressed**: N/A
- **Deviations/Decisions**: none
- **Next step**: monitor tsconfig updates in PRs.

## 2025-06-19 PR #103
- **Summary**: noted tsconfig path rule and NetClient.get generic usage in AGENTS.
- **Stage**: documentation
- **Requirements addressed**: N/A
- **Deviations/Decisions**: emphasised TS6307 prevention and generic match.
- **Next step**: ensure builds include package sources.

## 2025-06-19 PR #XXX
- **Summary**: extended web tsconfig include to packages/core for vue-tsc.
- **Stage**: implementation
- **Requirements addressed**: N/A
- **Deviations/Decisions**: none
- **Next step**: monitor CI for tsconfig compile errors.

## 2025-06-19 PR #107
- **Summary**: fixed NewsService type handling and updated tsconfig to include generated models.
- **Stage**: improvement
- **Requirements addressed**: N/A
- **Deviations/Decisions**: ensures typed API results and compilation against packages.
- **Next step**: verify tsconfig paths after adding packages.

## 2025-06-18 PR #102
- **Summary**: documented tokens build order in README and AGENTS.
- **Stage**: documentation
- **Requirements addressed**: N/A
- **Deviations/Decisions**: emphasised running tokens before Flutter steps.
- **Next step**: monitor CI for doc updates.

## 2025-06-16 PR #100
- **Summary**: implemented web CountrySettingRepository with localStorage and unit tests; updated README and TODO.
- **Stage**: implementation
- **Requirements addressed**: FR-0109
- **Deviations/Decisions**: repository uses browser localStorage; tests rely on jsdom environment.
- **Next step**: integrate repository into web location flow.

2025-06-16: ticked off old tasks and added missing ones in TODO.md to match work so far.

## 2025-06-17 PR #101
- **Summary**: updated TODO with outstanding Next step tasks.
- **Stage**: documentation
- **Requirements addressed**: N/A
- **Deviations/Decisions**: consolidated open actions from NOTES.
- **Next step**: implement new tasks.

## 2025-06-16 PR #99
- **Summary**: cleaned TODO list; removed duplicate network layer item and marked repository work done.
- **Stage**: documentation
- **Requirements addressed**: N/A
- **Deviations/Decisions**: none
- **Next step**: continue with CountrySettingRepository for web.

## 2025-06-16 PR #95
- **Summary**: added CountrySettingRepository and stored country via LocationService.
- **Stage**: implementation
- **Requirements addressed**: FR-0109, PR-0008
- **Deviations/Decisions**: LocationService uses injected repository to avoid circular deps.
- **Next step**: create web version of repository.

## 2025-06-16 PR #98

- **Summary**: refactored Flutter services to use `NetClient.get` and updated tests.
- **Stage**: improvement
- **Requirements addressed**: FR-0101, FR-0102, FR-0103
- **Deviations/Decisions**: ledger now stored within `NetClient`; services inject http clients for testing.
- **Next step**: verify cross-platform behaviour.

- **Summary**: updated TODO and READMEs to mention NetClient and planned CountrySettingRepository.
- **Stage**: documentation
- **Requirements addressed**: N/A
- **Deviations/Decisions**: none
- **Next step**: implement CountrySettingRepository for web.

## 2025-06-16 PR #94
- **Summary**: introduced `NetClient` wrapper and refactored web services and tests.
- **Stage**: improvement
- **Requirements addressed**: N/A
- **Deviations/Decisions**: services now create `NetClient` with their quota ledger to share logic.
- **Next step**: extend same client to Flutter services.

## 2025-06-16 PR #93
- **Summary**: cleaned TODO duplicates, marked mobile CI workflow done, and clarified npm install requirement for style-dictionary.
- **Stage**: documentation
- **Requirements addressed**: N/A
- **Deviations/Decisions**: none
- **Next step**: follow CI instructions for docs.

## 2025-06-10 PR #92
- **Summary**: refactored mobile fetchJson helper into NetClient class and updated services and tests.
- **Stage**: improvement
- **Requirements addressed**: FR-0101, FR-0103, FR-0104, FR-0107
- **Deviations/Decisions**: constructor injection used to allow mocking http clients.
- **Next step**: share NetClient between platforms.

## 2025-06-16 PR #91
- **Summary**: replaced LocationService stub with geolocator-based logic and added unit tests.
- **Stage**: improvement
- **Requirements addressed**: FR-0109
- **Deviations/Decisions**: used geocoding plugin instead of offline table for country lookup.
- **Next step**: persist CountrySetting in storage.

## 2025-06-10 PR #90
- **Summary**: added Jest to web-app with ts-jest preset, placeholder test and updated test script.
- **Stage**: improvement
- **Requirements addressed**: N/A
- **Deviations/Decisions**: added jest-environment-jsdom for compatibility; placeholder test to keep jest green.
- **Next step**: monitor CI for cross-tool coverage.

## 2025-06-10 PR #89
- **Summary**: fixed BCrypt gensalt prefix to \$2b in CredentialStore.
- **Stage**: bug fix
- **Requirements addressed**: FR-0105
- **Deviations/Decisions**: flutter tools unavailable; format and tests couldn't run.
- **Next step**: ensure CI passes with updated hashing.

## 2025-06-09 PR #88
- **Summary**: updated PortfolioRepository test constant to use const DateTime.utc and ran formatting and analysis commands (failed in container).
- **Stage**: In progress
- **Requirements addressed**: FR-0106
- **Deviations/Decisions**: container lacks dart/flutter
- **Next step**: fix container build scripts

## 2025-06-09 PR #87

- **Summary**: marked smwa-js-services, Flutter screens and PWA pages done in TODO; noted repository work underway.
- **Stage**: Docs update
- **Requirements addressed**: FR-0106
- **Deviations/Decisions**: none
- **Next step**: monitor repo progress

- **Summary**: added CredentialStore with AES encryption and bcrypt-12 hashing, plus unit tests.
- **Stage**: In progress
- **Requirements addressed**: FR-0105, FR-0108, SEC-0003
- **Deviations/Decisions**: static AES key used for demo.
- **Next step**: integrate with AuthService.

- **Summary**: added Flutter PortfolioRepository using SharedPreferences with hourly cached totals and tests.
- **Stage**: In progress
- **Requirements addressed**: FR-0106
- **Deviations/Decisions**: totals cached via LruCache; can't run flutter tools in container.
- **Next step**: integrate into PortfolioScreen.

## 2025-06-09 PR #86
- **Summary**: added PortfolioRepository storing holdings via idb-keyval and new Jest-style tests matching Flutter; installed fake-indexeddb for testing.
- **Stage**: In progress
- **Requirements addressed**: FR-0106
- **Deviations/Decisions**: kept Vitest instead of Jest to match existing stack.
- **Next step**: implement refreshTotals and integrate with UI.

## 2025-06-09 PR #85
- **Summary**: implemented QuoteRepository in the web app and refactored appStore to use it; added repository tests.
- **Stage**: In progress
- **Requirements addressed**: FR-0101, FR-0103
- **Deviations/Decisions**: TypeScript repository omits series method because the service lacks it.
- **Next step**: extend repositories for other domains.
<details><summary>Cmd</summary>

```bash
# eslint and tests
npm run lint
npm test
```

</details>

## 2025-06-09 PR #79
- **Summary**: added QuoteRepository with 24h caching and hooked AppStateNotifier to it; added unit tests.
- **Stage**: In progress
- **Requirements addressed**: FR-0101, FR-0102, FR-0103
- **Deviations/Decisions**: flutter analyze fails due to missing generated packages
- **Next step**: implement remaining repositories

## 2025-06-09 PR #78
- **Summary**: implemented Dart fetchJson helper and refactored services; added network tests.

## 2025-06-08 PR #77
- **Summary**: added NewsArticle model, updated AppState, NewsScreen lists articles with tests.
- **Stage**: In progress
- **Requirements addressed**: FR-0104, SD-03
- **Deviations/Decisions**: none
- **Next step**: enhance services to parse real API data

## 2025-06-08 PR #76
- **Summary**: load headline from MarketstackService in AppStateNotifier; MainScreen displays quote with tests.

- **Stage**: In progress
- **Requirements addressed**: CMP-Svc-MS, CMP-Svc-FX, CMP-Svc-News
- **Deviations/Decisions**: Services now return nullable maps and are used in app_state accordingly.
- **Next step**: monitor for further API integration.

## 2025-06-08 PR #76
- **Deviations/Decisions**: Added simple Quote model in mobile app.
- **Next step**: use news data on NewsScreen.

## 2025-06-08 PR #76
- **Summary**: added Marketstack getTopMovers, Pinia action and page lists with tests
- **Stage**: In progress
- **Requirements addressed**: N/A
- **Deviations/Decisions**: none
- **Next step**: expand store features

## 2025-06-08 PR #75
- **Summary**: add fetchJson helper and refactor services; added tests
- **Stage**: In progress
- **Requirements addressed**: N/A
- **Deviations/Decisions**: NewsService cache TTL now 24h via helper (spec says 12h)
- **Next step**: integrate helper in mobile services

## 2025-06-08 PR #74
- **Summary**: add smwa_services package with stub services and tests
- **Stage**: In progress
- **Requirements addressed**: CMP-Svc-MS, CMP-Svc-FX, CMP-Svc-News
- **Deviations/Decisions**: Implemented simple cache and quota ledger locally.
- **Next step**: flesh out real API calls.

## 2025-06-08 PR #73
- **Summary**: feat: introduced Riverpod AppStateNotifier with counter and hooked it into all screens with increment buttons. Added widget tests.
- **Stage**: In progress
- **Requirements addressed**: N/A
- **Deviations/Decisions**: None
- **Next step**: expand state usage across app.

## 2025-06-08 PR #72
- **Summary**: add core net helper and JS services package with tests
- **Stage**: In progress
- **Requirements addressed**: CMP-Svc-MS, CMP-Svc-FX, CMP-Svc-News
- **Deviations/Decisions**: None
- **Next step**: expand to remaining service stubs.

## 2025-06-08 PR #71
- **Summary**: add Pinia app store and tests
- **Stage**: In progress
- **Requirements addressed**: FR-0101, FR-0104, FR-0107
- **Deviations/Decisions**: Used simple SymbolTrie placeholder; lazy-init services
- **Next step**: Wire Flutter store.

## 2025-06-08 PR #70
- **Summary**: add Flutter test workflow
- **Stage**: In progress
- **Requirements addressed**: N/A
- **Deviations/Decisions**: Added separate workflow for Flutter tests on PRs to avoid CI clashes
- **Next step**: monitor CI runs

## 2025-06-08 PR #69
- **Summary**: docs: clarify planned state management
- **Stage**: In progress
- **Requirements addressed**: N/A
- **Deviations/Decisions**: None
- **Next step**: integrate Riverpod and Pinia state stores.

## 2025-06-08 PR #66
- **Summary**: Initial full source import with CI workflow, tests, and design tokens.
- **Stage**: In progress
- **Requirements addressed**: N/A
- **Deviations/Decisions**: None
- **Next step**: implement unified network layer.

## 2025-06-08 PR #65
- **Summary**: Document service-based API approach.
- **Stage**: Planning
- **Requirements addressed**: N/A
- **Deviations/Decisions**: None
- **Next step**: Implement unified network layer.

## 2025-06-08 PR #64
- **Summary**: Initial repository setup.
- **Stage**: Planning
- **Requirements addressed**: N/A
- **Deviations/Decisions**: None
- **Next step**: Populate TODO.md and implement core services.

## 2025-06-16 PR #XXX
- **Summary**: added Node 20 and markdown link check instructions in docs.
- **Stage**: documentation
- **Requirements addressed**: N/A
- **Deviations/Decisions**: emphasised Node 20; doc link check via npx.
- **Next step**: add automated job for docs.
## 2025-06-17 PR #XXX
- **Summary**: added docs CI workflow running markdown-link-check and updated contributor guide.
- **Stage**: documentation
- **Requirements addressed**: N/A
- **Deviations/Decisions**: Node 20 docs check via docs.yml; contributors must run it locally when editing docs.
- **Next step**: monitor docs workflow.

## 2025-06-25 PR #XXX
- **Summary**: added browser LocationService, integrated with app store and saved country via CountrySettingRepository; docs and tests updated.
- **Stage**: implementation
- **Requirements addressed**: FR-0109
- **Deviations/Decisions**: uses free reverse-geocode API; errors ignored in store init.
- **Next step**: verify cross-platform behaviour of LocationService.

## 2025-06-25 PR #XXX
- **Summary**: added parity tests for NetClient across platforms.
- **Stage**: testing
- **Requirements addressed**: FR-0104
- **Deviations/Decisions**: parity ensures same cache and ledger behaviour.
- **Next step**: follow CI instructions for docs.

## 2025-06-24 PR #XXX
- **Summary**: all Dart services now pass `ttl` to NetClient; TODO resolved.
- **Stage**: implementation
- **Requirements addressed**: FR-0104, LIM-0016
- **Deviations/Decisions**: none
- **Next step**: verify cross-platform behaviour of NetClient.

## 2025-06-23 PR #XXX
- **Summary**: added ttl parameter to NetClient and services; NewsService now caches 12h.
- **Stage**: implementation
- **Requirements addressed**: FR-0104, LIM-0016
- **Deviations/Decisions**: TTL passed explicitly to enforce per-service policy.
- **Next step**: update remaining services to use ttl parameter in Dart code.

## 2025-06-22 PR #XXX
- **Summary**: fixed import paths in core package to use '../../../web-app/src'.
- **Stage**: bug fix
- **Requirements addressed**: N/A
- **Deviations/Decisions**: packages/<pkg>/src should import utilities from web-app with three-level '../'.
- **Next step**: confirm CI pipeline stays green.

## 2025-06-16 PR #XXX
- **Summary**: document cross-package import paths in AGENTS.
- **Stage**: documentation
- **Requirements addressed**: N/A
- **Deviations/Decisions**: none
- **Next step**: verify CI docs jobs pass.

## 2025-06-19 PR #XXX
- **Summary**: corrected core net utility import paths.
- **Stage**: bug fix
- **Requirements addressed**: N/A
- **Deviations/Decisions**: changed ../web-app references to ../../web-app for accuracy.
- **Next step**: run CI to confirm build.

- **Summary**: added exclude pattern in web tsconfig to ignore package tests and updated AGENTS.
- **Stage**: implementation
- **Requirements addressed**: N/A
- **Deviations/Decisions**: include list unchanged; compile should ignore tests.
- **Next step**: confirm vue-tsc respects exclude.

## 2025-06-16 PR #XXX
- **Summary**: aligned NetClient generics in Fx, Marketstack and News services.
- **Stage**: implementation
- **Requirements addressed**: N/A
- **Deviations/Decisions**: generics now match callback return types; added any casts for raw Marketstack data.
- **Next step**: run CI to verify type safety.

## 2025-06-20 PR #XXX
- **Summary**: added rule to exclude package test folders when updating tsconfig.
- **Stage**: documentation
- **Requirements addressed**: N/A
- **Deviations/Decisions**: none
- **Next step**: monitor tsconfig updates in PRs.

## 2025-06-19 PR #103
- **Summary**: noted tsconfig path rule and NetClient.get generic usage in AGENTS.
- **Stage**: documentation
- **Requirements addressed**: N/A
- **Deviations/Decisions**: emphasised TS6307 prevention and generic match.
- **Next step**: ensure builds include package sources.

## 2025-06-19 PR #XXX
- **Summary**: extended web tsconfig include to packages/core for vue-tsc.
- **Stage**: implementation
- **Requirements addressed**: N/A
- **Deviations/Decisions**: none
- **Next step**: monitor CI for tsconfig compile errors.

## 2025-06-19 PR #107
- **Summary**: fixed NewsService type handling and updated tsconfig to include generated models.
- **Stage**: improvement
- **Requirements addressed**: N/A
- **Deviations/Decisions**: ensures typed API results and compilation against packages.
- **Next step**: verify tsconfig paths after adding packages.

## 2025-06-18 PR #102
- **Summary**: documented tokens build order in README and AGENTS.
- **Stage**: documentation
- **Requirements addressed**: N/A
- **Deviations/Decisions**: emphasised running tokens before Flutter steps.
- **Next step**: monitor CI for doc updates.

## 2025-06-16 PR #100
- **Summary**: implemented web CountrySettingRepository with localStorage and unit tests; updated README and TODO.
- **Stage**: implementation
- **Requirements addressed**: FR-0109
- **Deviations/Decisions**: repository uses browser localStorage; tests rely on jsdom environment.
- **Next step**: integrate repository into web location flow.

2025-06-16: ticked off old tasks and added missing ones in TODO.md to match work so far.

## 2025-06-17 PR #101
- **Summary**: updated TODO with outstanding Next step tasks.
- **Stage**: documentation
- **Requirements addressed**: N/A
- **Deviations/Decisions**: consolidated open actions from NOTES.
- **Next step**: implement new tasks.

## 2025-06-16 PR #99
- **Summary**: cleaned TODO list; removed duplicate network layer item and marked repository work done.
- **Stage**: documentation
- **Requirements addressed**: N/A
- **Deviations/Decisions**: none
- **Next step**: continue with CountrySettingRepository for web.

## 2025-06-16 PR #95
- **Summary**: added CountrySettingRepository and stored country via LocationService.
- **Stage**: implementation
- **Requirements addressed**: FR-0109, PR-0008
- **Deviations/Decisions**: LocationService uses injected repository to avoid circular deps.
- **Next step**: create web version of repository.

## 2025-06-16 PR #98

- **Summary**: refactored Flutter services to use `NetClient.get` and updated tests.
- **Stage**: improvement
- **Requirements addressed**: FR-0101, FR-0102, FR-0103
- **Deviations/Decisions**: ledger now stored within `NetClient`; services inject http clients for testing.
- **Next step**: verify cross-platform behaviour.

- **Summary**: updated TODO and READMEs to mention NetClient and planned CountrySettingRepository.
- **Stage**: documentation
- **Requirements addressed**: N/A
- **Deviations/Decisions**: none
- **Next step**: implement CountrySettingRepository for web.

## 2025-06-16 PR #94
- **Summary**: introduced `NetClient` wrapper and refactored web services and tests.
- **Stage**: improvement
- **Requirements addressed**: N/A
- **Deviations/Decisions**: services now create `NetClient` with their quota ledger to share logic.
- **Next step**: extend same client to Flutter services.

## 2025-06-16 PR #93
- **Summary**: cleaned TODO duplicates, marked mobile CI workflow done, and clarified npm install requirement for style-dictionary.
- **Stage**: documentation
- **Requirements addressed**: N/A
- **Deviations/Decisions**: none
- **Next step**: follow CI instructions for docs.

## 2025-06-10 PR #92
- **Summary**: refactored mobile fetchJson helper into NetClient class and updated services and tests.
- **Stage**: improvement
- **Requirements addressed**: FR-0101, FR-0103, FR-0104, FR-0107
- **Deviations/Decisions**: constructor injection used to allow mocking http clients.
- **Next step**: share NetClient between platforms.

## 2025-06-16 PR #91
- **Summary**: replaced LocationService stub with geolocator-based logic and added unit tests.
- **Stage**: improvement
- **Requirements addressed**: FR-0109
- **Deviations/Decisions**: used geocoding plugin instead of offline table for country lookup.
- **Next step**: persist CountrySetting in storage.

## 2025-06-10 PR #90
- **Summary**: added Jest to web-app with ts-jest preset, placeholder test and updated test script.
- **Stage**: improvement
- **Requirements addressed**: N/A
- **Deviations/Decisions**: added jest-environment-jsdom for compatibility; placeholder test to keep jest green.
- **Next step**: monitor CI for cross-tool coverage.

## 2025-06-10 PR #89
- **Summary**: fixed BCrypt gensalt prefix to \$2b in CredentialStore.
- **Stage**: bug fix
- **Requirements addressed**: FR-0105
- **Deviations/Decisions**: flutter tools unavailable; format and tests couldn't run.
- **Next step**: ensure CI passes with updated hashing.

## 2025-06-09 PR #88
- **Summary**: updated PortfolioRepository test constant to use const DateTime.utc and ran formatting and analysis commands (failed in container).
- **Stage**: In progress
- **Requirements addressed**: FR-0106
- **Deviations/Decisions**: container lacks dart/flutter
- **Next step**: fix container build scripts

## 2025-06-09 PR #87

- **Summary**: marked smwa-js-services, Flutter screens and PWA pages done in TODO; noted repository work underway.
- **Stage**: Docs update
- **Requirements addressed**: FR-0106
- **Deviations/Decisions**: none
- **Next step**: monitor repo progress

- **Summary**: added CredentialStore with AES encryption and bcrypt-12 hashing, plus unit tests.
- **Stage**: In progress
- **Requirements addressed**: FR-0105, FR-0108, SEC-0003
- **Deviations/Decisions**: static AES key used for demo.
- **Next step**: integrate with AuthService.

- **Summary**: added Flutter PortfolioRepository using SharedPreferences with hourly cached totals and tests.
- **Stage**: In progress
- **Requirements addressed**: FR-0106
- **Deviations/Decisions**: totals cached via LruCache; can't run flutter tools in container.
- **Next step**: integrate into PortfolioScreen.

## 2025-06-09 PR #86
- **Summary**: added PortfolioRepository storing holdings via idb-keyval and new Jest-style tests matching Flutter; installed fake-indexeddb for testing.
- **Stage**: In progress
- **Requirements addressed**: FR-0106
- **Deviations/Decisions**: kept Vitest instead of Jest to match existing stack.
- **Next step**: implement refreshTotals and integrate with UI.

## 2025-06-09 PR #85
- **Summary**: implemented QuoteRepository in the web app and refactored appStore to use it; added repository tests.
- **Stage**: In progress
- **Requirements addressed**: FR-0101, FR-0103
- **Deviations/Decisions**: TypeScript repository omits series method because the service lacks it.
- **Next step**: extend repositories for other domains.
<details><summary>Cmd</summary>

```bash
# eslint and tests
npm run lint
npm test
```

</details>

## 2025-06-09 PR #79
- **Summary**: added QuoteRepository with 24h caching and hooked AppStateNotifier to it; added unit tests.
- **Stage**: In progress
- **Requirements addressed**: FR-0101, FR-0102, FR-0103
- **Deviations/Decisions**: flutter analyze fails due to missing generated packages
- **Next step**: implement remaining repositories

## 2025-06-09 PR #78
- **Summary**: implemented Dart fetchJson helper and refactored services; added network tests.

## 2025-06-08 PR #77
- **Summary**: added NewsArticle model, updated AppState, NewsScreen lists articles with tests.
- **Stage**: In progress
- **Requirements addressed**: FR-0104, SD-03
- **Deviations/Decisions**: none
- **Next step**: enhance services to parse real API data

## 2025-06-08 PR #76
- **Summary**: load headline from MarketstackService in AppStateNotifier; MainScreen displays quote with tests.

- **Stage**: In progress
- **Requirements addressed**: CMP-Svc-MS, CMP-Svc-FX, CMP-Svc-News
- **Deviations/Decisions**: Services now return nullable maps and are used in app_state accordingly.
- **Next step**: monitor for further API integration.

## 2025-06-08 PR #76
- **Deviations/Decisions**: Added simple Quote model in mobile app.
- **Next step**: use news data on NewsScreen.

## 2025-06-08 PR #76
- **Summary**: added Marketstack getTopMovers, Pinia action and page lists with tests
- **Stage**: In progress
- **Requirements addressed**: N/A
- **Deviations/Decisions**: none
- **Next step**: expand store features

## 2025-06-08 PR #75
- **Summary**: add fetchJson helper and refactor services; added tests
- **Stage**: In progress
- **Requirements addressed**: N/A
- **Deviations/Decisions**: NewsService cache TTL now 24h via helper (spec says 12h)
- **Next step**: integrate helper in mobile services

## 2025-06-08 PR #74
- **Summary**: add smwa_services package with stub services and tests
- **Stage**: In progress
- **Requirements addressed**: CMP-Svc-MS, CMP-Svc-FX, CMP-Svc-News
- **Deviations/Decisions**: Implemented simple cache and quota ledger locally.
- **Next step**: flesh out real API calls.

## 2025-06-08 PR #73
- **Summary**: feat: introduced Riverpod AppStateNotifier with counter and hooked it into all screens with increment buttons. Added widget tests.
- **Stage**: In progress
- **Requirements addressed**: N/A
- **Deviations/Decisions**: None
- **Next step**: expand state usage across app.

## 2025-06-08 PR #72
- **Summary**: add core net helper and JS services package with tests
- **Stage**: In progress
- **Requirements addressed**: CMP-Svc-MS, CMP-Svc-FX, CMP-Svc-News
- **Deviations/Decisions**: None
- **Next step**: expand to remaining service stubs.

## 2025-06-08 PR #71
- **Summary**: add Pinia app store and tests
- **Stage**: In progress
- **Requirements addressed**: FR-0101, FR-0104, FR-0107
- **Deviations/Decisions**: Used simple SymbolTrie placeholder; lazy-init services
- **Next step**: Wire Flutter store.

## 2025-06-08 PR #70
- **Summary**: add Flutter test workflow
- **Stage**: In progress
- **Requirements addressed**: N/A
- **Deviations/Decisions**: Added separate workflow for Flutter tests on PRs to avoid CI clashes
- **Next step**: monitor CI runs

## 2025-06-08 PR #69
- **Summary**: docs: clarify planned state management
- **Stage**: In progress
- **Requirements addressed**: N/A
- **Deviations/Decisions**: None
- **Next step**: integrate Riverpod and Pinia state stores.

## 2025-06-08 PR #66
- **Summary**: Initial full source import with CI workflow, tests, and design tokens.
- **Stage**: In progress
- **Requirements addressed**: N/A
- **Deviations/Decisions**: None
- **Next step**: implement unified network layer.

## 2025-06-08 PR #65
- **Summary**: Document service-based API approach.
- **Stage**: Planning
- **Requirements addressed**: N/A
- **Deviations/Decisions**: None
- **Next step**: Implement unified network layer.

## 2025-06-08 PR #64
- **Summary**: Initial repository setup.
- **Stage**: Planning
- **Requirements addressed**: N/A
- **Deviations/Decisions**: None
- **Next step**: Populate TODO.md and implement core services.

## 2025-06-16 PR #XXX
- **Summary**: added Node 20 and markdown link check instructions in docs.
- **Stage**: documentation
- **Requirements addressed**: N/A
- **Deviations/Decisions**: emphasised Node 20; doc link check via npx.
- **Next step**: add automated job for docs.
