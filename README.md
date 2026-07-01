# Keept

Cross-platform screen-time app: track distracting apps, warn before limits, and block when limits are reached.

Built with React Native **0.86** (New Architecture, Turbo Modules) and React **19**.

> **Repo vs product:** the folder is still `FocusGuard`; the product, store IDs, and deep links use **Keept**. Legacy
> Kotlin namespace `com.focusguard` and Xcode target `FocusGuard` remain for build compatibility.

## Features

| Capability       | Android                                     | iOS                                  |
| ---------------- | ------------------------------------------- | ------------------------------------ |
| Usage monitoring | Foreground service + `UsageStatsManager`    | DeviceActivity monitor extension     |
| Soft warnings    | Local notification                          | Local notification                   |
| Hard block       | Full-screen overlay (`SYSTEM_ALERT_WINDOW`) | ManagedSettings shield               |
| App selection    | Installed-apps catalog                      | `FamilyActivityPicker` (Screen Time) |
| Per-app limits   | Warning + hard-block sliders, strict mode   | Same JS UI                           |
| Dashboard        | Focus score, distracting apps, monitoring   | Same JS UI                           |
| Statistics       | Usage history charts, focus trend, top apps | Same JS UI                           |
| Home widget      | Next-block countdown (Android)              | —                                    |
| Boot / resume    | `BootCompletedReceiver`, service restore    | Scheduler + App Group state          |

All limit and selection data stays on device. No account or cloud sync.

## Tech stack

| Layer          | Choices                                                                   |
| -------------- | ------------------------------------------------------------------------- |
| UI             | React 19, TypeScript 5.8, Reanimated 4, React Navigation 7 (static stack) |
| State          | Zustand 5 + `react-native-mmkv` 4 (Nitro Modules)                         |
| i18n           | i18next, react-i18next, react-native-localize (en / ru)                   |
| Android native | Kotlin, FGS, overlay manager, Turbo Module, App Widget                    |
| iOS native     | Swift, Family Controls, DeviceActivity + Report extensions                |
| Quality        | ESLint, Prettier, Husky, lint-staged, Jest                                |

**Requirements:** Node **≥ 22.11**, JDK **17** (Android), Xcode **16+** (iOS), CocoaPods.

## Project layout

```
source/                         # TypeScript / React application
├── App.tsx                     # Root providers
├── components/                 # Shared UI
├── constants/                  # Branding, platform app name/version
├── context/                    # Dashboard row selection provider
├── crashlytics/                # Firebase bootstrap + reportError
├── domain/                     # Permissions, catalogs, reconcile logic
├── hooks/                      # Refresh, hydration, theme, usage sync
├── i18n/                       # Locales (en/ru), LanguageSync
├── layout/                     # Content layout metrics
├── list/                       # FlatList helpers
├── navigation/                 # Stack, linking, gates, native sync hooks
├── runtime/                    # Shared AppState foreground bus
├── screen/                     # Feature screens
├── setup/                      # Reanimated logger config
├── specs/                      # Turbo Module contract + API wrappers
├── store/                      # Zustand + MMKV + native snapshot sync
├── theme/                      # ThemeProvider, palettes, typography
└── utils/                      # Usage math, permissions, scheduleMicrotask

android/app/src/main/java/
├── com/focusguard/             # Monitor, overlay, widget, usage, receivers
└── com/nativeusagestats/       # Codegen Turbo Module entry

ios/
├── FocusGuard/                 # Main app target (legacy name)
├── KeeptMonitor/               # DeviceActivityMonitor extension
├── KeeptReport/                # DeviceActivity report extension
└── Shared/                     # App Group stores, event dispatchers, schedulers
```

Platform-specific TypeScript resolves via Metro / `moduleSuffixes`: `.ios.ts`, `.android.ts`. Path alias: `@/*` →
`source/*`.

## Identity

| Layer                         | Value                                                                    |
| ----------------------------- | ------------------------------------------------------------------------ |
| Product name                  | Keept                                                                    |
| Marketing version             | `1.0.2` (`package.json`, Android `versionName`)                          |
| Android build number          | `7` (`versionCode` in `android/app/build.gradle`)                        |
| Store bundle / application ID | `com.keept`                                                              |
| Android namespace (Kotlin)    | `com.focusguard` (legacy)                                                |
| iOS App Group                 | `group.com.keept.shared`                                                 |
| Monitor extension             | `com.keept.monitor`                                                      |
| Report extension              | `com.keept.report`                                                       |
| Deep links                    | `keept://dashboard`, `keept://tracked-apps`, `keept://configure/:appKey` |

> **Note:** iOS `MARKETING_VERSION` / `CURRENT_PROJECT_VERSION` in Xcode may differ until bumped for App Store release.
> In-app version on iOS reads `package.json` via `source/constants/appVersion.ios.ts`.

## Getting started

```sh
npm ci
npm start          # Metro (separate terminal)
npm run android    # or: npm run ios
```

### Android

1. Device or emulator with API 24+ (target SDK 36).
2. Firebase Crashlytics stub for local/CI builds:
   ```sh
   cp android/app/google-services.ci.json android/app/google-services.json
   ```
   For Play Store builds, use the real `google-services.json` from Firebase Console for `com.keept`.
3. Grant special permissions in-app (Usage Access, Display over other apps, battery exemption). Notifications are
   optional.

**Release builds**

```sh
cp android/keystore.properties.example android/keystore.properties   # gitignored
# Edit passwords/alias; place upload keystore in android/keystores/
npm run android:release:check   # keystore + full npm check
npm run android:bundle:release  # Play Store AAB
npm run android:assemble:release
```

Regenerate launcher PNG mipmaps after changing shield artwork:

```sh
android/scripts/generate-launcher-icons.sh
```

| Permission                             | Role                         |
| -------------------------------------- | ---------------------------- |
| `PACKAGE_USAGE_STATS`                  | Detect foreground app        |
| `SYSTEM_ALERT_WINDOW`                  | Block overlay                |
| `POST_NOTIFICATIONS`                   | Limit warnings (API 33+)     |
| `REQUEST_IGNORE_BATTERY_OPTIMIZATIONS` | Reduce Doze kills            |
| `FOREGROUND_SERVICE` / `SPECIAL_USE`   | Monitoring service           |
| `RECEIVE_BOOT_COMPLETED`               | Restart monitor after reboot |

### iOS

Screen Time uses Family Controls (self-control / `.individual` auth mode).

```sh
cp ios/FocusGuard/GoogleService-Info.ci.plist ios/FocusGuard/GoogleService-Info.plist
cd ios && pod install && cd ..
npm run ios
```

| Item                  | Value                              |
| --------------------- | ---------------------------------- |
| App Group             | `group.com.keept.shared`           |
| Flat snapshot key     | `ios-tracking-snapshot-v2`         |
| Family selection blob | `ios-family-activity-selection-v1` |
| Daily usage           | `ios-daily-usage-v1`               |

Family Controls entitlement is required on a paid Apple Developer team for physical devices. Simulator works with a free
team. **CI does not build iOS** — run Xcode locally.

## Architecture

### Design principles

```
Background / blocking / day rollover  →  native loop, AlarmManager, or FGS
React UI state                        →  Turbo Module event emitters
Caches                                →  event invalidation + short TTL safety net
JavaScript                            →  subscriptions only (no production timers)
```

Agent rule with frozen native components: `.cursor/rules/native-events-architecture.mdc`.

### JavaScript ↔ native bridge

Turbo Module **`NativeUsageStats`** (`source/specs/`) exposes permissions, catalogs, monitor control, and
`syncTrackingConfig(snapshotJson)`.

App bootstrap (`index.js`):

1. Crashlytics bootstrap
2. `bootstrapNativeUsageEvents()` — registers native listeners via `createNativeEventHub`

Event subscriptions (production):

| Event                          | Native emitters (Android / iOS)             | JS consumer                |
| ------------------------------ | ------------------------------------------- | -------------------------- |
| `onPermissionsChanged`         | MainActivity, module resume, auth callbacks | `usePermissionsSync`       |
| `onLocalDayChanged`            | AlarmManager midnight, timezone, foreground | `useLocalDayChangeRefresh` |
| `onMonitorServiceStateChanged` | FGS start/stop / monitoring scheduler       | `useMonitoringServiceSync` |

Import `@/specs` in app code, not codegen files directly.

`appForegroundBus` (`source/runtime/`) is a shared `AppState` subscription for UI-only foreground refresh (language,
monitoring reconcile) — not a substitute for missing native events.

### Storage

```text
Zustand persist ──► MMKV "keept-storage"
                         │
                         ├── native-tracking-snapshot-v1 (Android flat JSON)
                         ├── ios-tracking-snapshot-v2 (via syncTrackingConfig)
                         └── Zustand JSON blobs (selected apps, limits, monitoring, …)

Android monitor reads flat snapshot + MMKV persist keys.
iOS extensions read App Group UserDefaults written by main app.
```

Contract source of truth: `source/store/persistSchema.ts` ↔ `android/.../PersistSchema.kt` ↔
`ios/Shared/KeeptAppGroup.swift`.

`RootNavigationGate` wires splash, catalog prefetch, permission guard, monitoring restore, usage history sync
(`GlobalUsageHistorySync`), and native snapshot sync.

### Android runtime

| Component                       | Role                                                       |
| ------------------------------- | ---------------------------------------------------------- |
| `FocusGuardMonitorService`      | Foreground service host                                    |
| `TrackingEngine`                | Poll loop (1s active / 2.5s idle), limit evaluation, block |
| `UsageEventsForegroundObserver` | API 35+ wake on foreground change (poll stays fallback)    |
| `BlockOverlayManager`           | Hard block UI                                              |
| `WidgetUpdater`                 | Home-screen widget (throttled; skips when no widgets)      |
| `LocalDayChangeScheduler`       | `AlarmManager` midnight + timezone receiver                |
| `TurboModuleEventDispatchers`   | Routes native signals to Turbo Module listeners            |

### iOS runtime

| Component                          | Role                                     |
| ---------------------------------- | ---------------------------------------- |
| `KeeptMonitoringScheduler`         | DeviceActivity schedule + monitor events |
| `KeeptMonitor` extension           | Warnings + ManagedSettings shields       |
| `KeeptReport` extension            | Daily usage into App Group               |
| `KeeptTurboModuleEventDispatchers` | Routes lifecycle signals to Turbo Module |
| `KeeptLocalDayChangeScheduler`     | Midnight timer + extension pending flag  |

## npm scripts

| Script                              | Description                              |
| ----------------------------------- | ---------------------------------------- |
| `npm start`                         | Metro bundler                            |
| `npm run android` / `npm run ios`   | Run on device / simulator                |
| `npm run check`                     | CI gate: lint, format, types, tests      |
| `npm test`                          | Jest                                     |
| `npm run lint` / `npm run lint:fix` | ESLint                                   |
| `npm run format` / `format:check`   | Prettier                                 |
| `npm run typecheck`                 | `tsc --noEmit`                           |
| `npm run android:bundle:release`    | Release AAB                              |
| `npm run android:assemble:release`  | Release APK                              |
| `npm run android:release:check`     | Requires `keystore.properties` + `check` |

**Git hooks:** pre-commit runs lint-staged on staged files; pre-push runs Jest `--findRelatedTests` for changed TS/JS
only (full gate is in CI).

## Testing

```sh
npm test              # local
npm run check         # same gate as CI
cd android && ./gradlew testDebugUnitTest   # Kotlin unit tests
```

Coverage focus:

- Domain & stores — permissions, catalogs, MMKV snapshots, usage math
- Navigation — entry route, deep links, bootstrap gate
- Architecture guard — no `setTimeout` / `setInterval` in `source/`
- Kotlin — `NextBlockResolver`, `LocalDayKey`, event dispatchers

Jest defaults to `.ios.ts` resolution; Android modules are imported explicitly in tests.

## Localization

English and Russian via i18next (`source/i18n/`). Settings → Language (`system` | `en` | `ru`). Legal: English under
`source/screen/Legal/data/`, Russian under `source/i18n/legal/ru/`.

## CI

GitHub Actions (`.github/workflows/ci.yml`), New Architecture enabled:

1. **check** — `npm run check` on Node 22
2. **android** — `assembleDebug` + `testDebugUnitTest` (API 36, NDK 27.1.12297006)

Android runs only after **check** passes. Husky is disabled in CI (`HUSKY=0`).

## Contributing notes

- Bump persist versions in `persistSchema.ts` and native counterparts when stored shapes change.
- Prefer `syncNativeTrackingSnapshot()` over writing MMKV snapshot keys from JS.
- Turbo Module spec files must keep `TurboModuleRegistry.get` in the same file as `Spec` (codegen requirement).
- Do not add JS polling timers — use native events or `scheduleMicrotask`.
- Do not rename legacy `com.focusguard` Kotlin package or `FocusGuard` Xcode target without a coordinated migration.
