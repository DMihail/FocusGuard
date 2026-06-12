#import "RCTNativeUsageStats.h"

#import <React/RCTBridgeModule.h>
#import <ReactCommon/RCTTurboModule.h>
#import <ReactCodegen/NativeUsageStatsSpecJSI.h>

@implementation RCTNativeUsageStats

RCT_EXPORT_MODULE(NativeUsageStats)

- (NSNumber *)checkForPermission
{
  return @YES;
}

- (NSNumber *)checkForSystemAlertWindowPermission
{
  return @YES;
}

- (NSNumber *)checkForNotificationsPermission
{
  return @YES;
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
  return @{@"started" : @NO, @"reason" : @"unsupported_platform"};
}

- (void)stopMonitorService
{
}

- (NSNumber *)isMonitorServiceRunning
{
  return @NO;
}

- (void)requestUsageStatsPermission
{
}

- (void)requestSystemAlertWindowPermission
{
}

- (void)requestNotificationsPermission
{
}

- (void)openNotificationsSettings
{
}

- (void)requestIgnoreBatteryOptimizationsPermission
{
}

- (void)getPackagesUsageToday:(NSArray *)packageNames
                      resolve:(RCTPromiseResolveBlock)resolve
                       reject:(RCTPromiseRejectBlock)reject
{
  resolve(@[]);
}

- (void)getInstalledApplications:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject
{
  resolve(@[]);
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

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
  return std::make_shared<facebook::react::NativeUsageStatsSpecJSI>(params);
}

@end
