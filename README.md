<!-- @format -->

# FocusGuard

Android app that helps reduce screen time by monitoring distracting apps and reminding you to take a break.

Built with [React Native](https://reactnative.dev) 0.85 (New Architecture / Turbo Modules).

## Features

- **App usage monitoring** — tracks which app is in the foreground via a background service
- **Usage warnings** — sends a push notification after 60 seconds of continuous use of a tracked app
- **App selection** — choose which apps to monitor from the full list of installed applications, filterable by category
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
6. After 60 seconds of a tracked app in the foreground → high-priority warning notification

## Required permissions

| Permission | Purpose |
|---|---|
| `PACKAGE_USAGE_STATS` | Read which app is in the foreground |
| `SYSTEM_ALERT_WINDOW` | Display overlay (reserved for future use) |
| `POST_NOTIFICATIONS` | Show warning notifications (API 33+) |
| `REQUEST_IGNORE_BATTERY_OPTIMIZATIONS` | Prevent Doze from stopping the service |
| `FOREGROUND_SERVICE` / `FOREGROUND_SERVICE_SPECIAL_USE` | Run the monitoring service |
| `RECEIVE_BOOT_COMPLETED` | Restart service after reboot |
| `QUERY_ALL_PACKAGES` | List all installed apps |

## Getting started

> Make sure you have completed the [React Native environment setup](https://reactnative.dev/docs/set-up-your-environment).

```sh
npm install
npm start
```

In a separate terminal:

```sh
npm run android
```

## Testing

```sh
npm test
```

29 test suites covering navigation, screens, stores, specs, and utilities.

## Tech stack

- **React Native** 0.85 (New Architecture, Turbo Modules)
- **React** 19
- **TypeScript**
- **Zustand** 5 — state management with MMKV persistence
- **react-native-mmkv** 4 — cross-process key-value storage
- **@react-navigation/native-stack** 7 — native stack navigation
- **Kotlin** — Android native modules and services
- **Kotlin Coroutines** — background polling in TrackingEngine
