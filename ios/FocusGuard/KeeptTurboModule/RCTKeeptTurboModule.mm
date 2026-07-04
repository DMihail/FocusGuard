#import "RCTKeeptTurboModule.h"

#import <ReactCommon/RCTTurboModule.h>
#import <ReactCodegen/KeeptTurboModuleSpecJSI.h>

#import "../ScreenTime/KeeptScreenTimeBridge.h"
#import "FocusGuard-Swift.h"

@implementation RCTKeeptTurboModule {
  BOOL _eventCallbacksRegistered;
  NSObject *_permissionsChangedToken;
  NSObject *_localDayChangedToken;
  NSObject *_monitorServiceStateToken;
}

- (void)ensureEventCallbacksRegistered
{
  if (_eventCallbacksRegistered) {
    return;
  }

  _eventCallbacksRegistered = YES;
  __weak __typeof__(self) weakSelf = self;

  _permissionsChangedToken = [KeeptTurboModuleEventDispatchers registerPermissionsChanged:^{
    __typeof__(self) strongSelf = weakSelf;
    if (!strongSelf) {
      return;
    }

    [strongSelf emitOnPermissionsChanged:@{
      @"changedAtMs" : @((NSInteger)(NSDate.date.timeIntervalSince1970 * 1000)),
    }];
  }];

  _localDayChangedToken = [KeeptTurboModuleEventDispatchers registerLocalDayChanged:^(NSString *dayKey) {
    __typeof__(self) strongSelf = weakSelf;
    if (!strongSelf) {
      return;
    }

    [strongSelf emitOnLocalDayChanged:@{
      @"dayKey" : dayKey,
      @"changedAtMs" : @((NSInteger)(NSDate.date.timeIntervalSince1970 * 1000)),
    }];
    [KeeptLocalDayChangeNotifier markDayChangeNotified:dayKey];
  }];

  _monitorServiceStateToken = [KeeptTurboModuleEventDispatchers registerMonitorServiceState:^(BOOL isRunning) {
    __typeof__(self) strongSelf = weakSelf;
    if (!strongSelf) {
      return;
    }

    [strongSelf emitOnMonitorServiceStateChanged:@{
      @"isRunning" : @(isRunning),
      @"changedAtMs" : @((NSInteger)(NSDate.date.timeIntervalSince1970 * 1000)),
    }];
  }];

  [KeeptAppLifecycleBridge start];
}

- (void)invalidate
{
  [KeeptLocalDayChangeScheduler stop];

  if (_permissionsChangedToken != nil) {
    [KeeptTurboModuleEventDispatchers unregisterPermissionsChanged:_permissionsChangedToken];
    _permissionsChangedToken = nil;
  }

  if (_localDayChangedToken != nil) {
    [KeeptTurboModuleEventDispatchers unregisterLocalDayChanged:_localDayChangedToken];
    _localDayChangedToken = nil;
  }

  if (_monitorServiceStateToken != nil) {
    [KeeptTurboModuleEventDispatchers unregisterMonitorServiceState:_monitorServiceStateToken];
    _monitorServiceStateToken = nil;
  }

  _eventCallbacksRegistered = NO;
}

- (NSNumber *)checkForPermission
{
  [self ensureEventCallbacksRegistered];
  return @(KeeptScreenTimeBridge.isScreenTimeAuthorized);
}

- (NSNumber *)checkForSystemAlertWindowPermission
{
  return @YES;
}

- (NSNumber *)checkForNotificationsPermission
{
  [self ensureEventCallbacksRegistered];
  return @(KeeptScreenTimeBridge.areNotificationsAuthorized);
}

- (NSNumber *)checkForIgnoreBatteryOptimizationsPermission
{
  return @YES;
}

- (NSNumber *)checkForManifestMonitorPermissions
{
  return @YES;
}

- (NSDictionary *)startMonitorService
{
  [self ensureEventCallbacksRegistered];
  return [KeeptScreenTimeBridge startMonitorService];
}

- (void)stopMonitorService
{
  [KeeptScreenTimeBridge stopMonitorService];
}

- (NSNumber *)isMonitorServiceRunning
{
  return @([KeeptScreenTimeBridge isMonitorServiceRunning]);
}

- (void)requestUsageStatsPermission
{
  [KeeptScreenTimeBridge requestScreenTimeAuthorization:^(id result) {
    [KeeptTurboModuleEventDispatchers emitPermissionsChanged];
  }
                                       reject:^(NSString *code, NSString *message, NSError *error) {
                                         (void)code;
                                         (void)message;
                                         (void)error;
                                       }];
}

- (void)requestSystemAlertWindowPermission
{
}

- (void)requestNotificationsPermission
{
  [KeeptScreenTimeBridge requestNotificationsAuthorization:^(id result) {
    [KeeptTurboModuleEventDispatchers emitPermissionsChanged];
  }
                                          reject:^(NSString *code, NSString *message, NSError *error) {
                                            (void)code;
                                            (void)message;
                                            (void)error;
                                          }];
}

- (void)openNotificationsSettings
{
  [KeeptScreenTimeBridge openNotificationsSettings];
}

- (void)requestIgnoreBatteryOptimizationsPermission
{
}

- (void)getPackagesUsageToday:(NSArray *)packageNames
                      resolve:(RCTPromiseResolveBlock)resolve
                       reject:(RCTPromiseRejectBlock)reject
{
  [KeeptScreenTimeBridge getPackagesUsageToday:packageNames
                                       resolve:resolve
                                        reject:reject];
}

- (void)getInstalledApplications:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject
{
  (void)reject;
  [KeeptScreenTimeBridge getSelectedApplications:resolve
                                          reject:^(NSString *code, NSString *message, NSError *error) {
                                            (void)code;
                                            (void)message;
                                            (void)error;
                                          }];
}

- (NSString *)getAppDisplayName
{
  return @"Keept";
}

- (NSString *)getAppVersion
{
  return [[NSBundle mainBundle] objectForInfoDictionaryKey:@"CFBundleShortVersionString"] ?: @"";
}

- (void)invalidateNativeCatalogCaches
{
  [KeeptScreenTimeBridge invalidateNativeCatalogCaches];
}

- (void)syncTrackingConfig:(NSString *)snapshotJson
{
  [KeeptScreenTimeBridge syncTrackingConfig:snapshotJson];
}

- (void)requestScreenTimeAuthorization:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject
{
  [KeeptScreenTimeBridge requestScreenTimeAuthorization:resolve reject:reject];
}

- (void)presentFamilyActivityPicker:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject
{
  [KeeptScreenTimeBridge presentFamilyActivityPicker:resolve reject:reject];
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
  [self ensureEventCallbacksRegistered];
  return std::make_shared<facebook::react::NativeKeeptTurboModuleSpecJSI>(params);
}

@end
