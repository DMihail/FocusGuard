# Keept

Android app that helps reduce screen time by monitoring distracting apps, sending warnings, and enforcing limits you
configure.

Built with [React Native](https://reactnative.dev) **0.86** (New Architecture / Turbo Modules) and **React 19**.

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
├── testing/             `testIds` registry for unit tests
└── theme/               Colors, typography, spacing

android/.../com/focusguard/
├── apps/                Installed apps catalog
├── bridge/              RN mappers and lifecycle binding
├── monitor/             Permission helpers used by the tracking service
├── overlay/             WindowManager block UI
├── permissions/         Runtime permission requests and events
├── service/             FocusGuardMonitorService (FGS)
└── TrackingEngine.kt    Polling, warnings, block overlay
```

### Identity

| Layer             | Value                                                          |
| ----------------- | -------------------------------------------------------------- |
| Product name      | Keept — `android/.../strings.xml` → `app_name`                 |
| Play Store ID     | `com.keept`                                                    |
| Android namespace | `com.focusguard`                                               |
| Deep links        | `focusguard://dashboard`, `configure/:package`, `tracked-apps` |
| RN root component | `Keept` (`app.json`)                                           |

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

## Android Studio

1. Open the **`android/`** folder (not the repo root).
2. **JDK 17**, **Android SDK API 36**, NDK **27.1.12297006** (see SDK Manager).
3. Copy Firebase config: `android/app/google-services.json` (or `google-services.ci.json` for local smoke).
4. Start Metro from the repo root: `npm start`.
5. Build variants: **`debug`** (dev + Metro) or **`release`** (Play Store / R8).

| Task in AS                                     | Result                                |
| ---------------------------------------------- | ------------------------------------- |
| Run ▶ `app` debug                              | Dev install with Metro                |
| Build → Generate Signed Bundle / APK → release | `app-release.aab` after signing setup |

CLI equivalent:

```sh
npm run android:bundle:release   # AAB for Play Store
npm run android:assemble:release # APK smoke test
```

After native or Turbo Module changes: **Build → Clean Project**, then rebuild (or `./gradlew clean`).

## Getting started (CLI)

**Requirements:** Node.js ≥ 22.11, JDK 17, Android SDK (API 36).

```sh
npm ci
cp android/app/google-services.ci.json android/app/google-services.json
npm start
```

In another terminal:

```sh
npm run android
```

### Local files (not in git)

| File                               | Purpose                                                   |
| ---------------------------------- | --------------------------------------------------------- |
| `android/app/google-services.json` | Firebase config                                           |
| `android/keystore.properties`      | Release signing (copy from `keystore.properties.example`) |

## npm scripts

| Script                             | Description                   |
| ---------------------------------- | ----------------------------- |
| `npm start`                        | Metro bundler                 |
| `npm run android`                  | Run on device / emulator      |
| `npm run check`                    | lint + format + types + tests |
| `npm run test`                     | Jest unit tests               |
| `npm run test:ci`                  | Jest with CI flags            |
| `npm run android:bundle:release`   | Play Store AAB                |
| `npm run android:assemble:release` | Release APK                   |

## Testing

Jest uses `@react-native/jest-preset` (required since RN 0.86 — preset is no longer bundled inside `react-native`).

```sh
npm test              # local
npm run test:ci       # same as CI (watchman off, forceExit)
npm run check         # full gate
```

**157** unit tests across navigation, screens, stores, and native Turbo Module contracts.

## CI

GitHub Actions (`.github/workflows/ci.yml`): on every push / PR runs `npm run check`:

1. ESLint (`--max-warnings 0`)
2. Prettier
3. TypeScript (`tsc --noEmit`)
4. Jest (`test:ci` — limited workers, `forceExit` to avoid open-handle hangs)

Native Android builds are **not** run in CI — use Android Studio or `npm run android:bundle:release` locally.

## Tech stack

- React Native 0.86 — New Architecture, Hermes, Turbo Modules
- React 19.2, TypeScript, Zustand 5 + MMKV 4
- Reanimated 4, React Navigation 7
- Kotlin + Coroutines (Android)

## iOS

The iOS target loads the JS bundle but **monitoring is Android-only**. Not production-ready for the core feature set.
