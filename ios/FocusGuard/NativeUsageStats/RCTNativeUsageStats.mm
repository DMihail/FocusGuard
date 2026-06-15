#import "RCTNativeUsageStats.h"

#import <ReactCommon/RCTTurboModule.h>
#import <ReactCodegen/NativeUsageStatsSpecJSI.h>

#import "../ScreenTime/KeeptScreenTimeBridge.h"

@implementation RCTNativeUsageStats

- (NSNumber *)checkForPermission
{
  return @(KeeptScreenTimeBridge.isScreenTimeAuthorized);
}

- (NSNumber *)checkForSystemAlertWindowPermission
{
  return @YES;
}

- (NSNumber *)checkForNotificationsPermission
{
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
  (void)packageNames;
  (void)reject;
  resolve(@[]);
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
  return std::make_shared<facebook::react::NativeUsageStatsSpecJSI>(params);
}

@end
