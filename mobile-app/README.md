# Flutter Mobile App

This directory contains the Flutter implementation of the Stock App.

## Running

1. Install Flutter 3.22.
2. From this folder run `flutter pub get` to fetch packages.
3. Copy `.env.example` to `.env` and fill in your API keys.
4. Launch the app with `flutter run --dart-define VITE_NEWSDATA_KEY=YOUR_KEY`.
5. Services share a `NetClient` wrapper with the web app for quota-aware HTTP calls.
6. NewsService falls back to an RSS feed if the NewsData API fails.
