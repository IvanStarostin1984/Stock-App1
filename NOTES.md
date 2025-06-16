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
