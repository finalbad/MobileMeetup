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
#import "CCNode+SFGestureRecognizers.h"
#import "HAPSwipeSprite.h"

//Pixel to metres ratio. Box2D uses metres as the unit for measurement.
//This ratio defines how many pixels correspond to 1 Box2D "metre"
//Box2D is optimized for objects of 1x1 metre therefore it makes sense
//to define the ratio so that your most common object type is 1x1 metre.
#define PTM_RATIO 32


@implementation HAPShaderTestLayer

- (id)init;
{
    self = [super init];
    if (self){
    
        HAPSwipeSprite *sprite = [[HAPSwipeSprite alloc] initWithFile:@"Icon-Small.png"];
        sprite.position = ccp(100, 100);
        [self addChild:sprite];

        self.isTouchEnabled = YES;
        
        
        UITapGestureRecognizer * tap = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(tap:)];
        [self addGestureRecognizer:tap];
        
    }
    return self;
}

- (void)tap:(UITapGestureRecognizer *)gesture;
{
    
}



@end
