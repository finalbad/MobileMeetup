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
#import "HAPShaderInvert.h"
@implementation HAPShaderTestLayer

- (id)init;
{
    self = [super init];
    if (self){
    
        CCSprite *sprite = [[CCSprite alloc] initWithFile:@"Icon-Small.png"];
        sprite.shaderProgram = [HAPShaderGrayscale loadShader];
        sprite.position = ccp(100, 100);
        [self addChild:sprite];

        CCSprite *sprite2 = [[CCSprite alloc] initWithFile:@"Icon-Small.png"];
        sprite2.shaderProgram = [HAPShaderInvert loadShader];
        sprite2.position = ccp(200, 200);
        [self addChild:sprite2];


        self.isTouchEnabled = YES;
    }
    return self;
}


@end
