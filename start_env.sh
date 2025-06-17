#!/usr/bin/env bash
set -euo pipefail

# install Flutter SDK if missing
if ! command -v flutter >/dev/null; then
  echo "Flutter not found. Installing Flutter 3.22.2..."
  git clone --depth 1 --branch 3.22.2 https://github.com/flutter/flutter.git flutter-sdk
  export PATH="$PWD/flutter-sdk/bin:$PATH"
  flutter precache --universal
fi

# install web-app dependencies
npm ci -C web-app

# install shared package dependencies
npm ci -C packages

# fetch Flutter dependencies
flutter pub get -C mobile-app
flutter pub get -C mobile-app/packages/services
