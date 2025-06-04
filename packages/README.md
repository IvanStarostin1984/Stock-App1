# Packages

This folder contains shared API contracts and generated clients for both
the web and mobile apps. `openapi.yaml` defines a minimal spec that is used
to generate TypeScript and Dart client stubs.

```
npx @openapitools/openapi-generator-cli generate -i openapi.yaml -g typescript-fetch -o generated-ts
npx @openapitools/openapi-generator-cli generate -i openapi.yaml -g dart-dio -o generated-dart
```
