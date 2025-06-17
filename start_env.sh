#!/usr/bin/env bash
set -euo pipefail

# install web-app dependencies
npm ci -C web-app

# install shared package dependencies
npm ci -C packages

# fetch Flutter dependencies
flutter pub get -C mobile-app
flutter pub get -C mobile-app/packages/services
