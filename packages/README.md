# Packages

This folder contains shared API contracts and generated clients for both
web and mobile apps. `openapi.yaml` defines a minimal spec used to produce
TypeScript and Dart client stubs.

Run the following script from this directory to regenerate both REST clients:

```bash
npm run gen:clients
```

This command replaces the previous `npm run gen:ts` and `npm run gen:dart` pair.
