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

Vite will expose the PWA at `http://localhost:5173`.

## Configure environment variables

Create a `.env` file (mirrored in `mobile-app/`) containing:

```
VITE_MARKETSTACK_KEY=YOUR_MARKETSTACK_KEY
VITE_NEWSDATA_KEY=YOUR_NEWSDATA_KEY
LHCI_GITHUB_APP_TOKEN=YOUR_LHCI_TOKEN  # CI only
```

`Exchangerate.host` needs no API key. Never commit real credentials.

If the NewsData request fails, `NewsService` falls back to the public RSS feed
`https://rss.theguardian.com/business/markets/index.xml`. Parsed headlines are
cached for 12 hours just like the API data.

## Build design tokens

Run `npm run tokens` to generate `design-tokens/build/css/tokens.scss` and `design-tokens/build/dart/tokens.dart`. These files are regenerated automatically during `npm run build` and before tests.

Tokens come from `web-prototype/CSS/styleguide.css`. Copy its colour and font variables into `design-tokens/tokens.json` and use them via the generated CSS variables. Font tokens now separate family and weight, for example `font-family-sf_pro_display` and `font-weight-bold`.

Run this command (or `npm test`, which also triggers it) **before** running any
Flutter analysis or build steps so `tokens.dart` exists.

## Determine user location

Call the `initLocation` action from `appStore` once on startup. It invokes
`LocationService`, which uses `navigator.geolocation` to resolve the user's
country and stores the ISO code in `CountrySettingRepository` (localStorage).
Example:

```ts
import { useAppStore } from './stores/appStore';

const store = useAppStore();
store.initLocation();
```


## Unlock Pro with stripe-mock

The `ProPage` calls `upgradePro()` from `appStore`. This method uses
`ProUpgradeService.checkoutMock()` to POST to
`http://localhost:12111/v1/checkout/sessions` provided by `stripe-mock`.
When the request succeeds the store flag `isPro` is set to `true`.

