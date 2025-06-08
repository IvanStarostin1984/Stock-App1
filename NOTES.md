## 2025-06-08 PR #76
- **Summary**: load headline from MarketstackService in AppStateNotifier; MainScreen displays quote with tests.
- **Stage**: In progress
- **Requirements addressed**: VM-01
- **Deviations/Decisions**: Added simple Quote model in mobile app.
- **Next step**: use news data on NewsScreen.

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

