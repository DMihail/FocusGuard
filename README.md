<!-- @format -->

# Keept

Android app that helps reduce screen time by monitoring distracting apps, sending warnings, and enforcing limits you
configure.

Built with [React Native](https://reactnative.dev) 0.85 (New Architecture / Turbo Modules).

> **Note:** The npm package name (`FocusGuard`) and Android namespace (`com.focusguard`) are legacy identifiers. The
> user-facing product name and Play Store application ID are **Keept** (`com.keept`).

## Features

- **App usage monitoring** — tracks which app is in the foreground via a background foreground service
- **Usage warnings** — push notification when a tracked app exceeds its warning threshold
- **Hard block overlay** — full-screen block when daily limit is reached (5-minute snooze unless strict mode)
- **App selection** — choose apps to monitor from installed launchable applications, filterable by category
- **Per-app limits** — warning and hard-block thresholds per app, stored in MMKV and read by the native monitor
- **Persistent service** — keeps running after the app is closed; auto-restarts on device boot
- **Start / Stop control** — toggle monitoring from the dashboard

## Architecture

```
source/
├── constants/           App display name (from native `app_name`), support email
├── navigation/          Route resolution, permission guard, deep links (focusguard://)
├── screen/
│   ├── Onboarding/      Walkthrough pager
│   ├── EnablePermissions/  Permission cards (Usage Stats, Overlay, Battery, Notifications)
│   ├── Dashboard/       Tracked apps, Start/Stop monitoring
│   ├── ManageApps/      Search, category filters, app selection
│   ├── ConfigureLimits/ Per-app warning / block sliders
│   ├── TrackedApps/     All selected apps with usage
│   ├── Settings/        Notification toggle, legal links
│   └── Legal/           Data Privacy & Terms of Service
├── store/               Zustand stores persisted via MMKV
├── specs/               Turbo Module spec (NativeUsageStats) — Codegen bridge
└── theme/               Colors, typography, spacing

android/.../com/
├── nativeusagestats/    Thin Turbo Module (delegates to domain layer)
├── focusguard/
│   ├── apps/            InstalledAppsRepository, UsageStatsCatalogRepository, AppIconCache
│   ├── permissions/     PermissionChecker, PermissionRequester, PermissionEventEmitter
│   ├── bridge/          ReactBridgeMappers, PermissionsLifecycleBinding
│   ├── usage/           Shared UsageStats helpers
│   ├── platform/        AppInfo — reads `R.string.app_name` for JS via Turbo Module
│   ├── TrackingEngine   Foreground polling, warnings, block overlay
│   ├── ForegroundAppDetector
│   ├── TrackingConfigRepository  Reads tracked apps from MMKV
│   ├── service/         FocusGuardMonitorService (foreground service)
│   ├── monitor/         Permission checks, service start/stop
│   ├── overlay/         Block overlay activity & snooze store
│   └── receiver/        BootCompletedReceiver
```

### Identity mapping

| Layer                      | Value                                                                        |
| -------------------------- | ---------------------------------------------------------------------------- |
| Product name (UI)          | Keept — sourced from `android/.../res/values/strings.xml` (`app_name`)       |
| Marketing version          | `versionName` in `android/app/build.gradle` (exposed to JS via Turbo Module) |
| Play Store `applicationId` | `com.keept`                                                                  |
| Android `namespace`        | `com.focusguard`                                                             |
| Deep link scheme           | `focusguard://`                                                              |
| RN module name             | `Keept` (`app.json`)                                                         |
| Turbo Module               | `NativeUsageStats` (Codegen)                                                 |

### Data flow

1. User selects apps in **ManageApps** → saved to MMKV via Zustand (`selectedAppsStore`)
2. User configures limits in **ConfigureLimits** → `appLimitsStore` (MMKV)
3. User taps **Start** on the dashboard → `monitoringStore.toggle()` → native `startMonitorService()`
4. `FocusGuardMonitorService` runs as a foreground service with a persistent notification
5. `TrackingEngine` polls `ForegroundAppDetector` every second
6. `TrackingConfigRepository` reads tracked apps and limits from the same MMKV instance as JS
7. After **warning** threshold → high-priority push notification
8. After **hard block** threshold → home screen + full-screen block overlay

## Required permissions

| Permission                                              | Purpose                                       |
| ------------------------------------------------------- | --------------------------------------------- |
| `PACKAGE_USAGE_STATS`                                   | Read which app is in the foreground           |
| `SYSTEM_ALERT_WINDOW`                                   | Display block overlay when limits are reached |
| `POST_NOTIFICATIONS`                                    | Show warning notifications (API 33+)          |
| `REQUEST_IGNORE_BATTERY_OPTIMIZATIONS`                  | Prevent Doze from stopping the service        |
| `FOREGROUND_SERVICE` / `FOREGROUND_SERVICE_SPECIAL_USE` | Run the monitoring service                    |
| `RECEIVE_BOOT_COMPLETED`                                | Restart service after reboot                  |
| `QUERY_ALL_PACKAGES`                                    | List installed launchable apps (API 30+)      |

## Getting started

> Complete the [React Native environment setup](https://reactnative.dev/docs/set-up-your-environment) first.

```sh
npm install
npm start
```

In a separate terminal:

```sh
npm run android
```

After changing native Android code or Turbo Module config, clean Gradle caches if builds behave oddly:

```sh
cd android
./gradlew --stop
rm -rf app/build build .gradle/configuration-cache
./gradlew clean
cd ..
```

## Code quality

```sh
npm run lint          # ESLint (zero warnings policy)
npm run lint:fix      # ESLint + auto-fix
npm run format:check  # Prettier check
npm run format        # Prettier write
npm run typecheck     # TypeScript
npm test              # Jest (39 suites, 137+ tests)
```

Husky runs lint-staged on commit. Release builds strip `console.log` / `console.debug` / `console.info` via Babel when
`NODE_ENV=production`.

## CI/CD

GitHub Actions (`.github/workflows/ci.yml`) on every push and PR:

| Job         | When                                          | What                                  |
| ----------- | --------------------------------------------- | ------------------------------------- |
| **checks**  | Always                                        | ESLint, Prettier, TypeScript, Jest    |
| **android** | `main`, `dev`, `release/*`, or PRs into those | `assembleDebug`, uploads APK artifact |

Release AAB/APK signing is done **locally** with your upload keystore (`bundleRelease` / `assembleRelease`).

## Tech stack

- **React Native** 0.85 — New Architecture, Turbo Modules, Hermes
- **React** 19
- **TypeScript**
- **Zustand** 5 + **react-native-mmkv** 4 — cross-process persistence (JS ↔ native service)
- **@react-navigation/native-stack** 7
- **Kotlin** + **Coroutines** — Android domain layer and foreground service

## iOS status

The iOS target builds and loads the JS bundle (`withModuleName: "Keept"`), but **core monitoring features are
Android-only** (Usage Stats, overlay blocking, foreground service). iOS is not production-ready for the main value
proposition.
