#import <Foundation/Foundation.h>

#import <React/RCTBridgeModule.h>

NS_ASSUME_NONNULL_BEGIN

@interface KeeptScreenTimeBridge : NSObject

+ (BOOL)isScreenTimeAuthorized;
+ (BOOL)areNotificationsAuthorized;
+ (void)requestScreenTimeAuthorization:(RCTPromiseResolveBlock)resolve
                                reject:(RCTPromiseRejectBlock)reject;
+ (void)presentFamilyActivityPicker:(RCTPromiseResolveBlock)resolve
                             reject:(RCTPromiseRejectBlock)reject;
+ (void)getSelectedApplications:(RCTPromiseResolveBlock)resolve
                        reject:(RCTPromiseRejectBlock)reject;
+ (void)requestNotificationsAuthorization:(RCTPromiseResolveBlock)resolve
                                   reject:(RCTPromiseRejectBlock)reject;
+ (void)openNotificationsSettings;
+ (void)syncTrackingConfig:(NSString *)snapshotJson;
+ (NSDictionary *)startMonitorService;
+ (void)stopMonitorService;
+ (BOOL)isMonitorServiceRunning;
+ (void)getPackagesUsageToday:(NSArray<NSString *> *)packageNames
                      resolve:(RCTPromiseResolveBlock)resolve
                       reject:(RCTPromiseRejectBlock)reject;
+ (void)invalidateNativeCatalogCaches;

@end

NS_ASSUME_NONNULL_END
