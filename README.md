<!-- @format -->

# FocusGuard

Android app that helps reduce screen time by monitoring distracting apps and reminding you to take a break.

Built with [React Native](https://reactnative.dev) 0.85 (New Architecture / Turbo Modules).

## Features

- **App usage monitoring** — tracks which app is in the foreground via a background service
- **Usage warnings** — sends a push notification after 60 seconds of continuous use of a tracked app
- **App selection** — choose which apps to monitor from the full list of installed applications, filterable by category
- **Per-app limits** — warning threshold (push) and hard block duration per selected app, stored in MMKV and read by the
  native monitor
- **Persistent service** — keeps running after the app is closed; auto-restarts on device boot
- **Start / Stop control** — toggle monitoring from the dashboard with a single tap

## Architecture

```
source/
├── navigation/          Route resolution, permission guard, app loader
├── screen/
│   ├── Onboarding/      Walkthrough pager (3 steps)
│   ├── EnablePermissions/  Permission cards (Usage Stats, Overlay, Battery, Notifications)
│   ├── Dashboard/       Distracting apps list, Start/Stop button
│   ├── ManageApps/      Search, category filters, app selection
│   ├── Settings/        Notification toggle, legal links
│   └── Legal/           Data Privacy & Terms of Service
├── store/               Zustand stores persisted via MMKV
├── specs/               Turbo Module bridge to native Android APIs
└── theme/               Colors, typography, spacing

android/.../com/focusguard/
├── TrackingEngine        Polling loop — detects foreground app, tracks session duration
├── ForegroundAppDetector UsageStatsManager queries (events + stats fallback)
├── TrackingConfigRepository  Reads tracked apps from MMKV (shared with JS)
├── service/              FocusGuardMonitorService (foreground service)
├── monitor/              Permission checks, service start/stop helpers
└── receiver/             BootCompletedReceiver (auto-restart on boot)
```

### Data flow

1. User selects apps in **ManageApps** → saved to MMKV via Zustand (`selectedAppsStore`)
2. User taps **Start** on the dashboard → `monitoringStore.toggle()` calls native `startMonitorService()`
3. `FocusGuardMonitorService` starts as a foreground service with a persistent notification
4. `TrackingEngine` polls `ForegroundAppDetector` every second
5. `TrackingConfigRepository` reads the tracked apps list directly from the same MMKV instance
6. After the app's **warning** limit → high-priority push notification
7. After the app's **hard block** limit → home screen + full-screen block overlay (5-minute snooze unless strict mode)

## Required permissions

| Permission                                              | Purpose                                   |
| ------------------------------------------------------- | ----------------------------------------- |
| `PACKAGE_USAGE_STATS`                                   | Read which app is in the foreground       |
| `SYSTEM_ALERT_WINDOW`                                   | Display overlay (reserved for future use) |
| `POST_NOTIFICATIONS`                                    | Show warning notifications (API 33+)      |
| `REQUEST_IGNORE_BATTERY_OPTIMIZATIONS`                  | Prevent Doze from stopping the service    |
| `FOREGROUND_SERVICE` / `FOREGROUND_SERVICE_SPECIAL_USE` | Run the monitoring service                |
| `RECEIVE_BOOT_COMPLETED`                                | Restart service after reboot              |
| `QUERY_ALL_PACKAGES`                                    | List all installed apps                   |

## Getting started

> Make sure you have completed the
> [React Native environment setup](https://reactnative.dev/docs/set-up-your-environment).

```sh
npm install
npm start
```

In a separate terminal:

```sh
npm run android
```

## Code quality

```sh
npm run lint          # ESLint (zero warnings policy)
npm run lint:fix      # ESLint + auto-fix (import sort, type imports)
npm run format:check  # Prettier check
npm run format        # Prettier write
npm run typecheck     # TypeScript
npm test
```

After `npm install`, **Husky** runs **lint-staged** on every commit for staged `*.{js,jsx,ts,tsx}`: ESLint fix,
Prettier, then Jest tests related to those files. Markdown/JSON/YAML get Prettier only.

**Release builds:** `babel-plugin-transform-remove-console` strips `console.log` / `console.debug` / `console.info` when
`NODE_ENV=production` (keeps `console.warn` and `console.error`, same as ESLint).

**ESLint highlights:** mandatory semicolons, no `any`, sorted imports (libraries → `@/` → relative → `components`),
React Hooks rules, `consistent-type-imports` / `consistent-type-exports`.

## Testing

```sh
npm test
```

29 test suites covering navigation, screens, stores, specs, and utilities.

## CI/CD

GitHub Actions workflow (`.github/workflows/ci.yml`) runs on **every** push and pull request.

| Job                 | When                                                               | What it does                                |
| ------------------- | ------------------------------------------------------------------ | ------------------------------------------- |
| **checks**          | Always (any branch)                                                | ESLint, Prettier, TypeScript, Jest          |
| **android**         | `main`, `dev`, `release/*`, or PRs into those branches; manual run | `assembleDebug`, uploads debug APK artifact |
| **android-release** | Push to `main`, `dev`, `release/*`, or tag `v*` (see above)        | Signed `bundleRelease` AAB (secrets below)  |

Feature branches (e.g. `app-settings`) run **checks** only (lint, format, types, tests). Android jobs run on `main` /
`dev` / `release/*` or when opening a PR into those branches.

Manual run: **Actions → CI → Run workflow**.

### Release signing secrets

For `android-release`, add these repository secrets:

| Secret                      | Description                           |
| --------------------------- | ------------------------------------- |
| `ANDROID_KEYSTORE_BASE64`   | Release keystore file, base64-encoded |
| `ANDROID_KEYSTORE_PASSWORD` | Keystore password                     |
| `ANDROID_KEY_ALIAS`         | Key alias                             |
| `ANDROID_KEY_PASSWORD`      | Key password                          |

Encode keystore locally:

```sh
base64 -i your-release.keystore | pbcopy
```

## Tech stack

- **React Native** 0.85 (New Architecture, Turbo Modules)
- **React** 19
- **TypeScript**
- **Zustand** 5 — state management with MMKV persistence
- **react-native-mmkv** 4 — cross-process key-value storage
- **@react-navigation/native-stack** 7 — native stack navigation
- **Kotlin** — Android native modules and services
- **Kotlin Coroutines** — background polling in TrackingEngine
