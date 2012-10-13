//
//  HAPAppDelegate.h
//  CocosShaderDemo
//
//  Created by Joseph Kim on 10/12/12.
//  Copyright (c) 2012 Happy Dojo. All rights reserved.
//

#import <UIKit/UIKit.h>

#import "CCDirector.h"
@class CCDirectorIOS;
@protocol CCDirectorDelegate;

@interface HAPAppDelegate : UIResponder <UIApplicationDelegate, CCDirectorDelegate>

@property (strong, nonatomic) UIWindow *window;
@property (readonly) UINavigationController *navController;
@property (readonly) CCDirectorIOS *director;

@end
