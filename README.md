# Keept

Android app that helps reduce screen time by monitoring distracting apps, sending warnings, and enforcing limits you
configure.

Built with [React Native](https://reactnative.dev) 0.85 (New Architecture / Turbo Modules) and **React 19**.

> The npm package name (`FocusGuard`) and Android namespace (`com.focusguard`) are legacy identifiers. The user-facing
> product name and Play Store application ID are **Keept** (`com.keept`).

## Features

- **App usage monitoring** — foreground service tracks which app is active
- **Usage warnings** — notification when a tracked app passes its warning threshold
- **Hard block overlay** — full-screen block at the daily cap (5-minute snooze unless strict mode)
- **App selection** — pick launchable apps, filter by category or search
- **Per-app limits** — warning and hard-block sliders, synced to native via MMKV
- **Persistent service** — survives app close; restarts on boot when monitoring is on
- **Dashboard** — focus score, top distracting apps, pull-to-refresh

## Project layout

```
source/
├── components/          Shared UI (AppUsageRow, ProgressBar, ScreenSafeArea, …)
├── domain/              Native catalog loaders, permission snapshot, metadata reconcile
├── hooks/               Shared hooks (usage rows, prefetch, app state, pull-to-refresh)
├── navigation/          Stack, deep links (`focusguard://`), permission guard
├── screen/              Feature screens (Onboarding → Dashboard → Settings)
├── specs/               Turbo Module contract (`NativeUsageStats`)
├── store/               Zustand + MMKV persistence
├── testing/             `testIds` registry for Detox / unit tests
└── theme/               Colors, typography, spacing

android/.../com/focusguard/
├── apps/                Installed apps + usage stats catalogs
├── bridge/              RN mappers and lifecycle binding
├── e2e/                 Detox launch-arg bootstrap (debug / e2eRelease only)
├── monitor/             Permission helpers used by the tracking service
├── overlay/             WindowManager block UI
├── permissions/         Runtime permission requests and events
├── service/             FocusGuardMonitorService (FGS)
└── TrackingEngine.kt    Polling, warnings, block overlay

e2e/
├── helpers/             launch presets, wait/tap, deep links
├── screens/             Page Objects
├── tests/               smoke, onboarding, permissions, navigation
└── testIds.js           JS mirror of `source/testing/testIds.ts`
```

### Identity

| Layer             | Value                                                          |
| ----------------- | -------------------------------------------------------------- |
| Product name      | Keept — `android/.../strings.xml` → `app_name`                 |
| Play Store ID     | `com.keept`                                                    |
| Android namespace | `com.focusguard`                                               |
| Deep links        | `focusguard://dashboard`, `configure/:package`, `tracked-apps` |
| RN root component | `Keept` (`app.json`)                                           |

### Data flow

1. **ManageApps** — user selects apps → `selectedAppsStore` (MMKV)
2. **ConfigureLimits** — limits per package → `appLimitsStore` (MMKV)
3. **Dashboard Start** — `monitoringStore` → native `startMonitorService()`
4. **FocusGuardMonitorService** — FGS + `TrackingEngine` (1s poll)
5. Native reads the same MMKV keys as JS (`TrackingConfigRepository`)
6. On focus / pull-to-refresh, JS reloads usage via `getPackageUsageToday` and reconciles app metadata
7. Dashboard and Tracked Apps share `trackedUsageStore`
8. Warning → push notification; hard block → overlay via `WindowManager`

## Required permissions

| Permission                             | Purpose                         |
| -------------------------------------- | ------------------------------- |
| `PACKAGE_USAGE_STATS`                  | Foreground app detection        |
| `SYSTEM_ALERT_WINDOW`                  | Block overlay                   |
| `POST_NOTIFICATIONS`                   | Warning notifications (API 33+) |
| `REQUEST_IGNORE_BATTERY_OPTIMIZATIONS` | Reduce Doze kills               |
| `FOREGROUND_SERVICE` / `SPECIAL_USE`   | Monitoring service              |
| `RECEIVE_BOOT_COMPLETED`               | Restart after reboot            |
| `<queries>` (launcher intent)          | List launchable apps (API 30+)  |

## Getting started

**Requirements:** Node.js ≥ 22.11, JDK 17, Android SDK (API 36). See the
[React Native environment guide](https://reactnative.dev/docs/set-up-your-environment).

```sh
npm ci
cp android/app/google-services.ci.json android/app/google-services.json   # or your Firebase file
npm start
```

In another terminal:

```sh
npm run android
```

After native or Turbo Module changes:

```sh
cd android && ./gradlew clean && cd ..
```

### Local files (not in git)

| File                               | Purpose                                                   |
| ---------------------------------- | --------------------------------------------------------- |
| `android/app/google-services.json` | Firebase config (CI copies `google-services.ci.json`)     |
| `android/keystore.properties`      | Release signing (copy from `keystore.properties.example`) |
| `android/keystores/*.jks`          | Upload keystore (see [RELEASE.md](./RELEASE.md))          |
| `.env`                             | Optional local overrides                                  |

IDE folders (`.idea/`, `.vscode/`, `.cursor/`) and build outputs are gitignored — see `.gitignore`.

## npm scripts

| Script                             | Description                                               |
| ---------------------------------- | --------------------------------------------------------- |
| `npm start`                        | Metro bundler                                             |
| `npm run android` / `ios`          | Run on device / simulator                                 |
| `npm run lint`                     | ESLint (zero warnings)                                    |
| `npm run lint:fix`                 | ESLint with autofix                                       |
| `npm run typecheck`                | `tsc --noEmit`                                            |
| `npm test`                         | Jest unit tests                                           |
| `npm run format` / `format:check`  | Prettier                                                  |
| `npm run check`                    | lint + format + types + tests (same as CI **checks** job) |
| `npm run e2e:sync-testids`         | Validate `e2e/testIds.js` vs `source/testing/testIds.ts`  |
| `npm run android:bundle:release`   | Play Store AAB (`app-release.aab`)                        |
| `npm run android:assemble:release` | Release APK (local smoke test)                            |

Husky runs lint-staged on commit. Release builds strip `console.log` / `console.debug` / `console.info` via Babel.

## Testing

### Unit tests

```sh
npm test
```

### Detox (E2E)

**Launch presets** (via `launchArgs` → native `E2EBootstrap`):

| Preset        | Effect                                                             |
| ------------- | ------------------------------------------------------------------ |
| `fresh`       | Clears MMKV → Onboarding                                           |
| `permissions` | Skip onboarding → Enable Permissions                               |
| `dashboard`   | Skip onboarding + mock permissions + seed tracked apps → Dashboard |

```sh
# Terminal 1 — required for debug E2E
npm start

# Terminal 2 — emulator already running
npm run e2e:build:android:attached
npm run e2e:test:android:attached

# Or let Detox start the AVD (set DETOX_AVD_NAME if needed)
npm run e2e:android

# Release-like build (bundled JS, no Metro)
npm run e2e:android:e2eRelease
```

**Tips**

- Use `e2e:test:android:attached` when an emulator is already open (Detox cannot start a second AVD).
- Prefer `element(by.id(...))` from `e2e/testIds.js`. Detox uses `exposeGlobals: false` — import from `detox`.
- After changing `source/testing/testIds.ts`, run `npm run e2e:sync-testids`.
- Instrumentation harness: `android/app/src/androidTest/java/com/focusguard/DetoxTest.java`.

## CI

GitHub Actions (`.github/workflows/ci.yml`) on push/PR:

| Job         | What                                                          |
| ----------- | ------------------------------------------------------------- |
| **checks**  | ESLint, Prettier, TypeScript, Jest                            |
| **android** | `assembleDebug`, APK artifact (main / dev / release branches) |

Run the same checks locally:

```sh
npm run check
```

Release builds: see **[RELEASE.md](./RELEASE.md)** (`npm run android:bundle:release`).

## Tech stack

- React Native 0.85 — New Architecture, Hermes, Turbo Modules
- React 19
- TypeScript
- Zustand 5 + react-native-mmkv 4
- @react-navigation/native-stack 7
- Kotlin + Coroutines (Android domain layer)
- Detox 20 (Android E2E)

## iOS

The iOS target loads the JS bundle but **monitoring is Android-only** (Usage Stats, overlay, FGS). Not production-ready
for the core feature set.
