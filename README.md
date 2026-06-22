# Keept

Cross-platform mobile app (Android + iOS) that helps reduce screen time: track distracting apps, send warnings when you
approach limits, and block access when limits are reached.

Built with [React Native](https://reactnative.dev) **0.86** (New Architecture, Turbo Modules) and **React 19**.

> **Repo vs product name:** the repository folder is still `FocusGuard`, while the product, store IDs, and deep links
> use **Keept**. Legacy Kotlin package `com.focusguard` and Xcode target `FocusGuard` remain for build compatibility.

## Features

| Capability       | Android                                          | iOS                                  |
| ---------------- | ------------------------------------------------ | ------------------------------------ |
| Usage monitoring | Foreground service + `UsageStatsManager`         | DeviceActivity monitor extension     |
| Soft warnings    | Local notification                               | Local notification                   |
| Hard block       | Full-screen overlay (`SYSTEM_ALERT_WINDOW`)      | ManagedSettings shield               |
| App selection    | Installed-apps catalog                           | `FamilyActivityPicker` (Screen Time) |
| Per-app limits   | Warning + hard-block sliders, strict mode        | Same JS UI                           |
| Dashboard        | Focus score, distracting apps, monitoring toggle | Same JS UI                           |
| Boot / resume    | `BootCompletedReceiver`, service restore         | Scheduler + App Group state          |

All limit and selection data stays on device. No account or cloud sync.

## User flow

```
Onboarding → Enable Permissions → Dashboard
                    ↓
         Manage Apps → Configure Limits
                    ↓
              Tracked Apps / Settings / Legal
```

Entry route is resolved after onboarding hydration (`resolveEntryRoute`): permissions gate on Android, Screen Time
authorization on iOS.

## Tech stack

| Layer          | Choices                                                                     |
| -------------- | --------------------------------------------------------------------------- |
| UI             | React 19.2, TypeScript 5.8, Reanimated 4, React Navigation 7 (static stack) |
| State          | Zustand 5 + `react-native-mmkv` 4 (Nitro Modules)                           |
| Android native | Kotlin, foreground service, overlay manager, Turbo Module                   |
| iOS native     | Swift, Family Controls, DeviceActivity + Report extensions                  |
| Quality        | ESLint, Prettier, Husky, lint-staged, Jest                                  |

**Requirements:** Node **≥ 22.11**, JDK **17** (Android), Xcode **16+** (iOS), CocoaPods.

## Project layout

```
source/                         # TypeScript / React application
├── components/                 # Shared UI (AppIcon, ScreenSafeArea, …)
├── domain/                     # Permissions, catalogs, app keys, usage loaders
├── hooks/                      # App state, refresh, catalog prefetch
├── navigation/                 # Static stack, deep links, permission guard
├── screen/                     # Feature screens (Dashboard, ManageApps, …)
├── specs/                      # Turbo Module contract (`NativeUsageStats`)
├── store/                      # Zustand stores, MMKV, native snapshot sync
├── theme/                      # Colors, typography, spacing
└── assets/                     # Fonts, SVG icons

android/app/src/main/java/com/focusguard/   # Monitor, overlay, permissions (legacy package)
android/app/src/main/java/com/nativeusagestats/  # Codegen Turbo Module entry
ios/
├── FocusGuard/                 # Main app target (legacy name)
├── KeeptMonitor/               # DeviceActivityMonitor extension
├── KeeptReport/                # DeviceActivity report extension
└── Shared/                     # App Group stores, Screen Time bridge
```

Platform-specific TypeScript uses Metro / `moduleSuffixes`: `.ios.ts`, `.android.ts` (see `tsconfig.json`). Path alias:
`@/*` → `source/*`.

## Identity

| Layer                         | Value                                                                    |
| ----------------------------- | ------------------------------------------------------------------------ |
| Product name                  | Keept                                                                    |
| Store bundle / application ID | `com.keept`                                                              |
| Android namespace (Kotlin)    | `com.focusguard` (legacy)                                                |
| iOS App Group                 | `group.com.keept.shared`                                                 |
| Monitor extension             | `com.keept.monitor`                                                      |
| Report extension              | `com.keept.report`                                                       |
| Deep links                    | `keept://dashboard`, `keept://tracked-apps`, `keept://configure/:appKey` |

## Getting started

```sh
npm ci
npm start          # Metro bundler (separate terminal)
npm run android    # or: npm run ios
```

### Android

1. Device or emulator with API 24+ (target SDK 36).
2. For local release-style builds that expect Firebase config:
   ```sh
   cp android/app/google-services.ci.json android/app/google-services.json
   ```
3. Grant special permissions in-app (Usage Access, Display over other apps, battery exemption). Notifications are
   optional.

**Release builds**

```sh
npm run android:assemble:release   # APK
npm run android:bundle:release     # Play Store AAB
```

Or open `android/` in Android Studio (JDK 17, compile SDK 36, NDK 27.1.12297006).

#### Android permissions

| Permission                             | Role                         |
| -------------------------------------- | ---------------------------- |
| `PACKAGE_USAGE_STATS`                  | Detect foreground app        |
| `SYSTEM_ALERT_WINDOW`                  | Block overlay                |
| `POST_NOTIFICATIONS`                   | Limit warnings (API 33+)     |
| `REQUEST_IGNORE_BATTERY_OPTIMIZATIONS` | Reduce Doze kills            |
| `FOREGROUND_SERVICE` / `SPECIAL_USE`   | Monitoring service           |
| `RECEIVE_BOOT_COMPLETED`               | Restart monitor after reboot |

### iOS

Screen Time integration uses Family Controls (self-control / `.individual` auth mode).

| Item                  | Value                              |
| --------------------- | ---------------------------------- |
| App Group             | `group.com.keept.shared`           |
| Flat snapshot key     | `ios-tracking-snapshot-v2`         |
| Family selection blob | `ios-family-activity-selection-v1` |
| Daily usage           | `ios-daily-usage-v1`               |

```sh
cd ios && pod install && cd ..
npm run ios
```

**Family Controls** entitlement must be enabled on your Apple Developer team for physical devices. Free personal teams
can still use the simulator. CI builds the simulator target with `CODE_SIGNING_ALLOWED=NO`.

## Architecture

### JavaScript ↔ native bridge

Turbo Module **`NativeUsageStats`** (`source/specs/`) exposes:

- Permission checks and settings intents
- Installed apps + daily usage catalogs
- Monitor start/stop / running state
- `syncTrackingConfig(snapshotJson)` — push flat tracking snapshot to native

Client code imports `@/specs` (API wrappers), not the codegen files directly.

### Storage

```text
Zustand persist ──► MMKV "keept-storage" ◄── Android monitor (Kotlin)
                         │
                         ├── native-tracking-snapshot-v1 (flat JSON)
                         └── Zustand JSON blobs (fallback for native)

iOS main app ──syncTrackingConfig──► App Group UserDefaults
                                           │
                                    KeeptMonitor / KeeptReport
```

Contract source of truth: `source/store/persistSchema.ts` ↔ `android/.../PersistSchema.kt` ↔
`ios/Shared/KeeptAppGroup.swift`.

On Android, the monitor reads the flat snapshot first, then can parse Zustand persist keys. Usage Access grant uses a
native MMKV latch (`usage-access-granted-v1`) to survive OEM AppOps flicker when returning from other permission
screens.

### Runtime services (Android)

- `FocusGuardMonitorService` — polls foreground app, enforces limits
- `BlockOverlayManager` — hard block UI
- `TrackingEngine` — limit evaluation, snooze, daily warnings
- `BootCompletedReceiver` — restore monitoring after reboot

`RootNavigationGate` wires splash handoff, catalog prefetch, permission guard, monitoring session restore, and native
snapshot sync when navigation becomes ready.

## npm scripts

| Script                                    | Description                                 |
| ----------------------------------------- | ------------------------------------------- |
| `npm start`                               | Metro bundler                               |
| `npm run android` / `npm run ios`         | Run on device / simulator                   |
| `npm run check`                           | lint + format + typecheck + tests (CI gate) |
| `npm run lint` / `npm run lint:fix`       | ESLint                                      |
| `npm run format` / `npm run format:check` | Prettier                                    |
| `npm run typecheck`                       | `tsc --noEmit`                              |
| `npm test` / `npm run test:ci`            | Jest                                        |
| `npm run android:bundle:release`          | Release AAB                                 |
| `npm run android:assemble:release`        | Release APK                                 |

Pre-commit hooks (Husky + lint-staged) run ESLint, Prettier, and related tests on staged `source/` and `__tests__/`
files.

## Testing

```sh
npm test              # local
npm run test:ci       # CI (no watchman, forceExit)
npm run check         # full gate
```

Unit tests cover navigation, stores, permissions, usage math, and screen flows. Jest defaults to `.ios.ts` resolution;
Android-specific modules are imported explicitly in tests (e.g. `permissionStatus.android.ts`).

## CI

GitHub Actions (`.github/workflows/ci.yml`), New Architecture enabled:

1. **js** — `npm run check` on Node 22
2. **android** — `assembleDebug` after SDK/NDK install (API 36)
3. **ios** — `xcodebuild` for iOS Simulator (no code signing)

## Contributing notes

- Bump persist versions in `persistSchema.ts` and native counterparts when changing stored shapes.
- Prefer `syncNativeTrackingSnapshot()` over writing MMKV snapshot keys from JS.
- Turbo Module spec files in `source/specs/NativeUsageStats*.ts` must keep `TurboModuleRegistry.get` in the same file as
  `Spec` (codegen requirement).
- Do not rename legacy `com.focusguard` Kotlin package or `FocusGuard` Xcode target without a coordinated rename.
