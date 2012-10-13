//
//  HAPShaderTestLayer.m
//  CocosShaderDemo
//
//  Created by Joseph Kim on 10/12/12.
//  Copyright (c) 2012 Happy Dojo. All rights reserved.
//

#import "HAPShaderTestLayer.h"
#import "cocos2d.h"
#import "HAPShader.h"
#import "HAPShaderGrayscale.h"
@implementation HAPShaderTestLayer

- (id)init;
{
    self = [super init];
    if (self){
    
        CCSprite *sprite = [[CCSprite alloc] initWithFile:@"Icon-Small.png"];
        sprite.shaderProgram = [HAPShaderGrayscale loadShader];
        sprite.position = ccp(100, 100);
        [self addChild:sprite];
        self.isTouchEnabled = YES;
    }
    return self;
}


@end
