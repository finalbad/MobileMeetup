//
//  HAPSwipeSprite.h
//  CocosShaderDemo
//
//  Created by Joseph Kim on 10/12/12.
//  Copyright (c) 2012 Happy Dojo. All rights reserved.
//

#import "CCSprite.h"

typedef enum {

HAPShaderTypeNormal = 0,
HAPShaderTypeGrayscale,
HAPShaderTypeInvert,
HAPShaderTypeMax,
} HAPShaderType;


@interface HAPSwipeSprite : CCSprite

@property (nonatomic) HAPShaderType shaderType;

@end
