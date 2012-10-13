//
//  HAPShader.h
//  CocosShaderDemo
//
//  Created by Joseph Kim on 10/12/12.
//  Copyright (c) 2012 Happy Dojo. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "cocos2d.h"

@interface HAPShader : NSObject

+ (CCGLProgram *)loadShader;
- (NSString *)shaderName;
- (NSString *)vertexShader;
- (NSString *)fragmentShader;


@end
