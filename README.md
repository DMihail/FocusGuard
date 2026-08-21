# Keept

Cross-platform screen-time app: track distracting apps, warn before limits, and block when limits are reached.

Built with React Native **0.87** (New Architecture, Turbo Modules) and React **19**.

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
FocusGuard/                          # repo folder (product / store ID: Keept)
├── index.js                         # entry: crashlytics + keeptTurboModule event bootstrap
├── app.json                         # RN app name registered with AppRegistry
├── package.json                     # codegenConfig → KeeptTurboModuleSpec
├── babel.config.js / metro.config.js / tsconfig.json
├── jest.config.js / jest.setup.js
├── firebase.json                    # Crashlytics mapping
├── .cursor/rules/                   # native-events architecture (agent guidance)
│
├── source/                          # TypeScript / React application (@/* alias)
│   ├── App.tsx                      # root providers + navigation shell
│   ├── assets/                      # fonts, svg icons
│   ├── components/                  # ErrorBoundary, GlobalUsageHistorySync, AppUsageRow, …
│   ├── constants/                   # app display name + version (per platform)
│   ├── context/                     # CoreStoresHydrationProvider, SelectedDashboardAppRowsProvider
│   ├── crashlytics/                 # bootstrapCrashlytics, reportError
│   ├── domain/                      # permissions, catalogs, reconcile, app keys, usage loaders
│   ├── hooks/                       # useTrackedAppRows, useScreenRefresh, useUsageHistorySync, …
│   ├── i18n/                        # locales (en/ru), legal copy
│   ├── layout/                      # tablet column width metrics
│   ├── list/                        # FlatList key extractors + render helpers
│   ├── navigation/                  # stack, linking, lazyScreens, RootNavigationGate, sync hooks
│   ├── runtime/                     # appForegroundBus (shared AppState subscription)
│   ├── screen/                      # feature screens
│   │   ├── Onboarding/
│   │   ├── EnablePermissions/
│   │   ├── Dashboard/
│   │   ├── TrackedApps/
│   │   ├── ManageApps/              # FamilyActivityPicker on iOS; installed-apps catalog on Android
│   │   ├── ConfigureLimits/
│   │   ├── Statistics/              # gifted-charts trend + usage/saved bars
│   │   ├── Settings/
│   │   └── Legal/
│   ├── setup/                       # Reanimated logger config
│   ├── specs/                       # Turbo Module codegen + typed bridge wrappers
│   │   ├── NativeKeeptTurboModule*.ts   # RN codegen schema (do not import from app code)
│   │   ├── keeptTurboModuleApi.*         # permissions, catalogs, monitor, events
│   │   ├── keeptTurboModuleClient.*      # thin TurboModuleRegistry accessors
│   │   ├── keeptUiThemeClient.*          # native theme bridge
│   │   └── createNativeEventHub.ts       # event hub with retry + fan-out
│   ├── store/                       # Zustand + MMKV persist
│   │   ├── persistSchema.ts         # cross-platform storage contract
│   │   ├── *Store.ts                # selected apps, limits, monitoring, usage history, …
│   │   ├── trackedUsageStore.ts     # coalesced native usage refresh
│   │   ├── usageDayChangeCoordinator.ts
│   │   └── nativeTrackingSnapshot.ts / *TrackingSnapshot.ts
│   ├── testing/                     # testIDs + Jest fixtures
│   ├── theme/                       # ThemeProvider, palettes, typography
│   └── utils/                       # usage math, permissions, scheduleMicrotask
│
├── __tests__/                       # Jest (31 suites; mirrors source/ layout)
│   ├── architecture/                # productionTimers guard (no JS polling)
│   ├── domain/ / store/ / hooks/ / navigation/ / specs/
│   └── screen/                      # screen-level hook + component tests
│
├── android/app/src/main/java/
│   ├── com/focusguard/              # legacy Kotlin namespace
│   │   ├── TrackingEngine.kt      # poll loop, block evaluation
│   │   ├── DailyUsageRepository.kt  # incremental queryEvents cursor
│   │   ├── LiveUsageEstimator.kt    # live session overlay on persisted usage
│   │   ├── ForegroundAppDetector.kt
│   │   ├── apps/                    # InstalledAppsRepository, AppIconCache
│   │   ├── crashlytics/             # NativeErrorReporter
│   │   ├── monitor/                 # FGS helper, ForegroundPollWake, poll policy
│   │   ├── overlay/                 # BlockOverlayManager, snooze + warning stores
│   │   ├── permissions/             # system settings intents
│   │   ├── react/                   # TurboModuleEventDispatchers, KeeptUiThemeModule
│   │   ├── receiver/                # boot, midnight alarm, timezone
│   │   ├── service/                 # FocusGuardMonitorService
│   │   ├── storage/                 # MMKV, PersistSchema, native snapshot
│   │   ├── usage/                   # DailyUsageAggregator, LocalDayChangeScheduler
│   │   └── widget/                  # home-screen next-block widget
│   └── com/keept/turbomodule/       # KeeptTurboModule (codegen entry)
│
└── ios/
    ├── FocusGuard/                  # main app target (legacy name)
    │   ├── KeeptTurboModule/        # RCTKeeptTurboModule
    │   ├── KeeptUiTheme/            # theme bridge
    │   └── ScreenTime/              # Family Controls, picker, usage reports
    ├── KeeptMonitor/                # DeviceActivityMonitor extension
    ├── KeeptReport/                 # DeviceActivity report extension
    └── Shared/                      # App Group stores, schedulers, event dispatchers
```

Platform-specific TypeScript resolves via Metro / `moduleSuffixes`: `.ios.ts`, `.android.ts`, `.native.ts`. Path alias:
`@/*` → `source/*`. Import the native bridge from `@/specs`, not `NativeKeeptTurboModule*.ts` directly.

## Identity

| Layer                         | Value                                                                    |
| ----------------------------- | ------------------------------------------------------------------------ |
| Product name                  | Keept                                                                    |
| npm / JS version              | `1.0.9` (`package.json`)                                                 |
| Android store version         | `1.0.9` (`versionName` in `android/app/build.gradle`)                    |
| Android build number          | `14` (`versionCode` in `android/app/build.gradle`)                       |
| iOS marketing version         | `1.0.0` (`MARKETING_VERSION` in Xcode)                                   |
| iOS build number              | `1` (`CURRENT_PROJECT_VERSION` — first App Store cut may stay at 1)      |
| Store bundle / application ID | `com.keept`                                                              |
| Android namespace (Kotlin)    | `com.focusguard` (legacy)                                                |
| iOS App Group                 | `group.com.keept.shared`                                                 |
| Monitor extension             | `com.keept.monitor`                                                      |
| Report extension              | `com.keept.report`                                                       |
| Deep links                    | `keept://dashboard`, `keept://tracked-apps`, `keept://configure/:appKey` |

> **Version sources:** Keep `package.json`, Android `versionName`, and iOS `MARKETING_VERSION` on the same marketing
> version. Play Store uses `versionCode`; App Store uses `CURRENT_PROJECT_VERSION`. In-app version: Android reads native
> build config; iOS reads `package.json` via `source/constants/appVersion.ios.ts`.

## Getting started

```sh
npm ci
npm start          # Metro (separate terminal)
npm run android    # or: npm run ios
```

If Reanimated/Worklets throws a version mismatch after upgrading deps, restart Metro with a clean cache:

```sh
npx react-native start --reset-cache
```

### Android

1. Device or emulator with API 24+ (target SDK 36).
2. Firebase Crashlytics stub for local/CI builds:
   ```sh
   cp android/app/google-services.ci.json android/app/google-services.json
   ```
   For Play Store builds, use the real `google-services.json` from Firebase Console for `com.keept`.
3. Grant special permissions in-app (Usage Access, Display over other apps, battery exemption). Notifications are
   optional but improve limit warnings.

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

Three naming layers (same module, different concerns):

| Layer              | Name / path                                                      | Role                                      |
| ------------------ | ---------------------------------------------------------------- | ----------------------------------------- |
| Native runtime     | **`KeeptTurboModule`**                                           | Turbo Module name on the bridge           |
| Codegen spec files | **`NativeKeeptTurboModule*.ts`**                                 | RN codegen schema (`Native*.ts` required) |
| App imports        | **`@/specs`** → `keeptTurboModuleApi` / `keeptTurboModuleClient` | Typed wrappers + event hub bootstrap      |

`KeeptTurboModule` exposes permissions, catalogs, monitor control, and `syncTrackingConfig(snapshotJson)`.

App bootstrap (`index.js`):

1. Crashlytics bootstrap
2. `bootstrapKeeptTurboModuleEvents()` — registers native listeners via `createNativeEventHub`

Event subscriptions (production):

| Event                          | Native emitters (Android / iOS)             | JS consumers                                    |
| ------------------------------ | ------------------------------------------- | ----------------------------------------------- |
| `onPermissionsChanged`         | MainActivity, module resume, auth callbacks | `usePermissionsSync`, `useNotificationsSetting` |
| `onLocalDayChanged`            | AlarmManager midnight, timezone, foreground | `useScreenRefresh` (hard on day change)         |
| `onMonitorServiceStateChanged` | FGS start/stop / monitoring scheduler       | `useMonitoringServiceSync`                      |
| `onTrackedUsageChanged`        | TrackingEngine poll (Android), usage report | `useTrackedAppRows`                             |

Import `@/specs` in app code, not codegen files directly.

`appForegroundBus` (`source/runtime/`) is a shared `AppState` subscription for UI-only foreground refresh (language,
monitoring reconcile) — not a substitute for missing native events.

### Navigation

Static native stack (`createStaticNavigation` + `RootStack`). Entry route is chosen after MMKV rehydration:

| Condition                | Initial screen      |
| ------------------------ | ------------------- |
| Onboarding not confirmed | `Onboarding`        |
| Permissions missing      | `EnablePermissions` |
| Ready                    | `Dashboard`         |

**Lazy loading** (`createLazyScreen` → `lazyScreens.ts`): secondary screens are code-split and fetched on first
navigation, not at cold start. This keeps the main bundle smaller and defers heavy UI (e.g. `react-native-gifted-charts`
on Statistics, large Manage Apps lists) until the user opens them.

| Bundle        | Screens                                                                                   |
| ------------- | ----------------------------------------------------------------------------------------- |
| Eager (main)  | `Onboarding`, `EnablePermissions`, `Dashboard`                                            |
| Lazy (chunks) | `ManageApps`, `TrackedApps`, `Statistics`, `ConfigureLimits`, `Settings`, `LegalDocument` |

Deep links (`source/navigation/linking.ts`): `keept://dashboard`, `keept://tracked-apps`, `keept://configure/:appKey`.
Cold-start targets stack `Dashboard` underneath so back navigation returns to the hub.

`RootNavigationGate` wires splash, catalog prefetch, permission guard, monitoring restore, usage history sync
(`GlobalUsageHistorySync`), and native snapshot sync. `CoreStoresHydrationProvider` shares one MMKV hydration
subscription set across dashboard-related hooks.

**Monitoring sync (three layers):**

1. Native — FGS emits `onMonitorServiceStateChanged`; pending events replay on JS resume.
2. `useMonitoringServiceSync` — reconciles drift when app returns to foreground (`restoreMonitoringSession`).
3. `monitoringStore` health check — settles the dashboard toggle while Android FGS starts asynchronously.

**Usage refresh policy:** soft refresh on screen focus (`useScreenRefresh`); hard refresh on pull-to-refresh, local day
change, and Configure Limits day rollover. `trackedUsageStore` coalesces concurrent refreshes into one native load.

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

### Android runtime

| Component                     | Role                                                                  |
| ----------------------------- | --------------------------------------------------------------------- |
| `FocusGuardMonitorService`    | Foreground service host                                               |
| `TrackingEngine`              | Poll loop (1s active / 2.5s idle), limit evaluation, block            |
| `TrackingEnginePollRecovery`  | Retries transient poll failures; stops FGS after 5 consecutive errors |
| `DailyUsageRepository`        | Incremental `queryEvents` cursor — appends `[cursor+1, now]` per read |
| `ForegroundPollWake`          | API 35+ idle wait slices (500ms) — early wake, no second scanner      |
| `BlockOverlayManager`         | Hard block UI                                                         |
| `WidgetUpdater`               | Home-screen widget (throttled + deferred coalescing)                  |
| `LocalDayChangeScheduler`     | `AlarmManager` midnight + clock/timezone receivers                    |
| `TurboModuleEventDispatchers` | Routes native signals to Turbo Module listeners                       |

### iOS runtime

| Component                          | Role                                                     |
| ---------------------------------- | -------------------------------------------------------- |
| `KeeptMonitoringScheduler`         | DeviceActivity schedule + monitor events                 |
| `KeeptMonitor` extension           | Warnings + ManagedSettings shields                       |
| `KeeptReport` extension            | Daily usage into App Group                               |
| `KeeptTurboModuleEventDispatchers` | Routes lifecycle signals to Turbo Module                 |
| `KeeptLocalDayChangeScheduler`     | `BGAppRefreshTask` at midnight + significant time change |

## npm scripts

| Script                             | Description                              |
| ---------------------------------- | ---------------------------------------- |
| `npm start`                        | Metro bundler                            |
| `npm run android` / `npm run ios`  | Run on device / simulator                |
| `npm run check`                    | CI gate: lint, format, types, tests      |
| `npm test`                         | Jest                                     |
| `npm run android:bundle:release`   | Release AAB                              |
| `npm run android:assemble:release` | Release APK                              |
| `npm run android:release:check`    | Requires `keystore.properties` + `check` |

**Git hooks:** pre-commit runs lint-staged on staged files; pre-push runs Jest `--findRelatedTests` for changed TS/JS
only (full gate is in CI).

## Testing

```sh
npm test              # local (31 suites)
npm run check         # lint + format + types + Jest (CI gate)
cd android && ./gradlew testDebugUnitTest   # Kotlin unit tests (Robolectric)
maestro test .maestro/android-smoke.yaml    # optional device smoke (not in CI)
```

**`__tests__/` layout** mirrors `source/`: `domain/`, `store/`, `hooks/`, `navigation/`, `specs/`, `screen/`, plus
`architecture/productionTimers.test.js` (guards against JS polling timers).

**Kotlin tests** (`android/app/src/test/`): `DailyUsageAggregator`, `LocalDayKey`, `LocalDayChangeNotifier`,
`DailyWarningStore`, `NextBlockResolver`, `ForegroundStabilizer`, `TrackingEnginePoll`, `OpenSessionTracker`,
`LiveUsageEstimator`, `TrackedUsageChangeEmitter`, `UsageAccess`, `UsageAccessGrantStore`, `TurboModuleEventDispatchers`
— Robolectric with in-memory MMKV via `RobolectricKeeptTestCase`.

Jest defaults to `.ios.ts` resolution; Android-specific modules are imported explicitly in tests.

## Localization

English and Russian via i18next (`source/i18n/`). Settings → Language (`system` | `en` | `ru`). Legal documents live
under `source/screen/Legal/data/` (EN/RU + Android/iOS in one builder per document).

## CI

GitHub Actions (`.github/workflows/ci.yml`), New Architecture enabled:

1. **check** — `npm run check` on Node 22
2. **android** — `assembleDebug` + `testDebugUnitTest` (API 37, NDK 27.1.12297006), only after **check**

Runs on every PR once (not also on the branch push), and on push to `main` / `dev` / `release/**`. iOS is local-only
(see above). Husky is disabled in CI (`HUSKY=0`).

## Contributing notes

- Bump persist versions in `persistSchema.ts` and native counterparts when stored shapes change.
- Prefer `syncNativeTrackingSnapshot()` over writing MMKV snapshot keys from JS.
- Turbo Module codegen files must be named `Native*.ts` and keep `TurboModuleRegistry.get` in the same file as `Spec`.
- Import the module in app code via `@/specs` (`keeptTurboModuleApi`), not `NativeKeeptTurboModule*.ts` directly.
- Do not add JS polling timers — use native events or `scheduleMicrotask`.
- Do not rename legacy `com.focusguard` Kotlin package or `FocusGuard` Xcode target without a coordinated migration.
