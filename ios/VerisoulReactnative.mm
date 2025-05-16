#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(VerisoulReactnative, NSObject)

RCT_EXTERN_METHOD(configure:(NSString *)environment withProjectId:(NSString *)projectId
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getSessionId:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(reinitialize:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

@end
