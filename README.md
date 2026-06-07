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

## Architecture

```
source/
├── domain/              Native catalog loaders, permission snapshot, app metadata reconcile
├── navigation/          Routes, permission guard, deep links (focusguard://)
├── screen/              Onboarding, permissions, dashboard, manage apps, limits, settings
├── store/               Zustand + MMKV, including shared trackedUsageStore
├── specs/               Turbo Module (NativeUsageStats)
├── hooks/               Shared screen hooks (usage rows, prefetch, app state)
└── theme/               Colors, typography, spacing

android/.../com/focusguard/
├── apps/                Installed apps + usage stats catalogs
├── permissions/         Permission checks and settings intents
├── bridge/              RN mappers and lifecycle binding
├── TrackingEngine       Polling, warnings, block overlay
├── service/             FocusGuardMonitorService (FGS)
└── overlay/             WindowManager block UI
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
6. On focus / pull-to-refresh, JS reloads installed apps and per-package usage via `getPackageUsageToday`, then
   reconciles selected-app metadata
7. Dashboard and Tracked Apps read the same `trackedUsageStore` state
8. Warning → push notification; hard block → overlay via `WindowManager`

### JS performance notes

- Heavy native reads (`getInstalledApplications`, `getPackageUsageToday`) run through catalog loaders deferred with
  `requestIdleCallback` (fallback: `setTimeout`)
- Manage Apps uses `@shopify/flash-list` for large installed-app lists
- Dashboard and Tracked Apps share `trackedUsageStore` for daily usage (same source as the native monitor)
- Permission checks are cached in `domain/permissionSnapshot.ts` and invalidated on foreground / native events

## Required permissions

| Permission                             | Purpose                         |
| -------------------------------------- | ------------------------------- |
| `PACKAGE_USAGE_STATS`                  | Foreground app detection        |
| `SYSTEM_ALERT_WINDOW`                  | Block overlay                   |
| `POST_NOTIFICATIONS`                   | Warning notifications (API 33+) |
| `REQUEST_IGNORE_BATTERY_OPTIMIZATIONS` | Reduce Doze kills               |
| `FOREGROUND_SERVICE` / `SPECIAL_USE`   | Monitoring service              |
| `RECEIVE_BOOT_COMPLETED`               | Restart after reboot            |
| `QUERY_ALL_PACKAGES`                   | List launchable apps (API 30+)  |

## Getting started

[Set up the React Native environment](https://reactnative.dev/docs/set-up-your-environment), then:

```sh
npm install
npm start
```

In another terminal:

```sh
npm run android
```

Place `android/app/google-services.json` locally for Firebase (CI uses `google-services.ci.json`).

After native or Turbo Module changes:

```sh
cd android && ./gradlew clean && cd ..
```

## Code quality

```sh
npm run lint          # ESLint (zero warnings)
npm run typecheck     # TypeScript
npm test              # Jest
npm run format:check  # Prettier
```

Husky runs lint-staged on commit. Production builds strip `console.log` / `console.debug` / `console.info` via Babel.

## CI

GitHub Actions (`.github/workflows/ci.yml`) on push/PR:

| Job         | What                               |
| ----------- | ---------------------------------- |
| **checks**  | ESLint, Prettier, TypeScript, Jest |
| **android** | `assembleDebug`, APK artifact      |

Release signing is local (`bundleRelease` / `assembleRelease`).

## Tech stack

- React Native 0.85 — New Architecture, Hermes, Turbo Modules
- React 19
- TypeScript
- Zustand 5 + react-native-mmkv 4
- @shopify/flash-list 2
- @react-navigation/native-stack 7
- Kotlin + Coroutines (Android domain layer)

## iOS

The iOS target loads the JS bundle but **monitoring is Android-only** (Usage Stats, overlay, FGS). Not production-ready
for the core feature set.
