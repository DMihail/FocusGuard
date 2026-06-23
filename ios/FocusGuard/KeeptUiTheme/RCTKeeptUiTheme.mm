#import <React/RCTBridgeModule.h>
#import <UIKit/UIKit.h>

@interface KeeptUiTheme : NSObject <RCTBridgeModule>
@end

@implementation KeeptUiTheme

RCT_EXPORT_MODULE();

+ (BOOL)requiresMainQueueSetup
{
  return YES;
}

RCT_EXPORT_METHOD(syncPreference : (NSString *)preference)
{
  dispatch_async(dispatch_get_main_queue(), ^{
    UIWindow *window = nil;

    for (UIScene *scene in UIApplication.sharedApplication.connectedScenes) {
      if (![scene isKindOfClass:[UIWindowScene class]]) {
        continue;
      }

      for (UIWindow *candidate in ((UIWindowScene *)scene).windows) {
        if (candidate.isKeyWindow) {
          window = candidate;
          break;
        }
      }

      if (window != nil) {
        break;
      }
    }

    if (window == nil) {
      return;
    }

    if ([preference isEqualToString:@"light"]) {
      window.overrideUserInterfaceStyle = UIUserInterfaceStyleLight;
    } else if ([preference isEqualToString:@"dark"]) {
      window.overrideUserInterfaceStyle = UIUserInterfaceStyleDark;
    } else {
      window.overrideUserInterfaceStyle = UIUserInterfaceStyleUnspecified;
    }
  });
}

@end
