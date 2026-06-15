# Keept

Cross-platform app (Android + iOS) that helps reduce screen time by monitoring distracting apps, sending warnings, and
enforcing limits you configure.

Built with [React Native](https://reactnative.dev) **0.86** (New Architecture / Turbo Modules) and **React 19**.

> Legacy identifiers (`FocusGuard`, `com.focusguard`, `focus-guard-storage`) are being migrated — see
> [docs/MIGRATION_KEEPT.md](docs/MIGRATION_KEEPT.md).

## Features

| Feature          | Android                      | iOS                          |
| ---------------- | ---------------------------- | ---------------------------- |
| Usage monitoring | Foreground service           | DeviceActivity monitor       |
| Warnings         | Notification                 | Local notification           |
| Hard block       | Full-screen overlay          | ManagedSettings shield       |
| App selection    | Installed-apps catalog       | FamilyActivityPicker         |
| Per-app limits   | Sliders → MMKV snapshot      | Sliders → App Group snapshot |
| Dashboard        | Focus score, pull-to-refresh | Same JS UI                   |

## Project layout

```
source/
├── components/          Shared UI
├── domain/              Catalog loaders, permissions, app keys
├── hooks/               Shared hooks
├── navigation/          Stack, deep links (`keept://` + legacy `focusguard://`)
├── screen/              Feature screens
├── specs/               Turbo Module contract (`NativeUsageStats`)
├── store/               Zustand + MMKV persistence
└── theme/               Colors, typography, spacing

android/.../com/focusguard/   Kotlin monitor, overlay, Turbo Module
ios/                          Screen Time bridge + extensions
```

Platform-specific logic uses `.ios.ts` / `.android.ts` module suffixes (see `tsconfig.json` → `moduleSuffixes`).

### Identity

| Layer             | Value                                                |
| ----------------- | ---------------------------------------------------- |
| Product name      | Keept                                                |
| Store IDs         | `com.keept` (Android + iOS)                          |
| Android namespace | `com.focusguard` (legacy)                            |
| Deep links        | `keept://dashboard`, `configure/:id`, `tracked-apps` |
| Legacy deep links | `focusguard://…` (still supported)                   |

## Android

### Required permissions

| Permission                             | Purpose                         |
| -------------------------------------- | ------------------------------- |
| `PACKAGE_USAGE_STATS`                  | Foreground app detection        |
| `SYSTEM_ALERT_WINDOW`                  | Block overlay                   |
| `POST_NOTIFICATIONS`                   | Warning notifications (API 33+) |
| `REQUEST_IGNORE_BATTERY_OPTIMIZATIONS` | Reduce Doze kills               |
| `FOREGROUND_SERVICE` / `SPECIAL_USE`   | Monitoring service              |
| `RECEIVE_BOOT_COMPLETED`               | Restart after reboot            |

### Build

```sh
npm ci
cp android/app/google-services.ci.json android/app/google-services.json
npm start          # Metro
npm run android    # device / emulator
```

Release: `npm run android:bundle:release` or open `android/` in Android Studio (JDK 17, API 36).

## iOS

Screen Time monitoring via Family Controls — see [ios/docs/FAMILY_CONTROLS.md](ios/docs/FAMILY_CONTROLS.md).

| Item              | Value                                |
| ----------------- | ------------------------------------ |
| App Group         | `group.com.keept.shared`             |
| Monitor extension | `KeeptMonitor` (`com.keept.monitor`) |
| Report extension  | `KeeptReport` (`com.keept.report`)   |
| Auth mode         | Self-control (`.individual`)         |
| Snapshot key      | `ios-tracking-snapshot-v2`           |

**Family Controls entitlement** must be approved in Apple Developer before device builds succeed. Personal (free) teams
can use the simulator.

```sh
npm run ios
```

## npm scripts

| Script                            | Description                   |
| --------------------------------- | ----------------------------- |
| `npm start`                       | Metro bundler                 |
| `npm run android` / `npm run ios` | Run on device / simulator     |
| `npm run check`                   | lint + format + types + tests |
| `npm run test:ci`                 | Jest with CI flags            |
| `npm run android:bundle:release`  | Play Store AAB                |

## Testing

```sh
npm test              # local
npm run test:ci       # CI (watchman off, forceExit)
npm run check         # full gate
```

**184+** unit tests across navigation, screens, stores, permissions, and Turbo Module contracts.

Jest resolves `.ios.ts` by default; Android-specific tests import `.android` modules explicitly.

## CI

GitHub Actions (`.github/workflows/ci.yml`) — один job:

1. JS: ESLint, Prettier, TypeScript, Jest (`npm run check`)
2. Android: `assembleDebug` (native compile smoke)

## Native bridge

| Channel                                 | Purpose                                                         |
| --------------------------------------- | --------------------------------------------------------------- |
| **Turbo Module (`NativeUsageStats`)**   | Permissions, catalogs, monitor start/stop, `syncTrackingConfig` |
| **Shared MMKV (`focus-guard-storage`)** | Zustand persist + Android flat snapshot                         |
| **iOS App Group**                       | Screen Time snapshot, selection, daily usage                    |

Storage keys: `source/store/persistSchema.ts` ↔ `PersistSchema.kt` ↔ `ios/Shared/`.

## Tech stack

- React Native 0.86, React 19.2, TypeScript, Zustand 5 + MMKV 4
- Reanimated 4, React Navigation 7
- Kotlin + Coroutines (Android), Swift (iOS Screen Time)
