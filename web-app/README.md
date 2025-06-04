# Web App

This directory hosts the Vue 3 Progressive Web App of **Stock-App1**. Ensure Node 20 is available on your machine.

## Install dependencies

```bash
npm install
```

## Run the development server

```bash
npm run dev
```

Vite will expose the PWA at http://localhost:5173.

## Configure environment variables

Create a `.env` file (mirrored in `mobile-app/`) containing:

```
VITE_MARKETSTACK_KEY=YOUR_MARKETSTACK_KEY
VITE_NEWSDATA_KEY=YOUR_NEWSDATA_KEY
LHCI_GITHUB_APP_TOKEN=YOUR_LHCI_TOKEN  # CI only
```

`Exchangerate.host` needs no API key. Never commit real credentials.

## Build design tokens

Run `npm run tokens` to generate `design-tokens/build/css/tokens.scss` and `design-tokens/build/dart/tokens.dart`. These files are regenerated automatically during `npm run build` and before tests.

