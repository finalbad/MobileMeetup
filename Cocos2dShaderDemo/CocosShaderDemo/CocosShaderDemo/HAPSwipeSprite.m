//
//  HAPSwipeSprite.m
//  CocosShaderDemo
//
//  Created by Joseph Kim on 10/12/12.
//  Copyright (c) 2012 Happy Dojo. All rights reserved.
//

#import "HAPSwipeSprite.h"
#import "CCNode+SFGestureRecognizers.h"
#import "HAPShaderGrayscale.h"
#import "HAPShaderInvert.h"
#import "HAPShader.h"

@implementation HAPSwipeSprite

- (id)initWithTexture:(CCTexture2D*)texture rect:(CGRect)rect rotated:(BOOL)rotated;
{
    self = [super initWithTexture:texture rect:rect rotated:rotated];
    if (self){
    
//        UISwipeGestureRecognizer *left = [[UISwipeGestureRecognizer alloc] initWithTarget:self action:@selector(swipeLeft:)];
//        [self addGestureRecognizer:left];
//        UISwipeGestureRecognizer *right = [[UISwipeGestureRecognizer alloc] initWithTarget:self action:@selector(swipeRight:)];
//        [self addGestureRecognizer:right];

        UITapGestureRecognizer * tap = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(tap:)];
        [self addGestureRecognizer:tap];
        [self updateShader];
    }
    return self;
}


- (void)tap:(UITapGestureRecognizer *)gesture;
{
    _shaderType = (_shaderType + 1) % HAPShaderTypeMax;
    [self updateShader];
}


- (void)swipeRight:(UISwipeGestureRecognizer *)gesture;
{
    _shaderType = (_shaderType + 1) % HAPShaderTypeMax;
    [self updateShader];
}

- (void)swipeLeft:(UISwipeGestureRecognizer *)gesture;
{
    _shaderType = (_shaderType + HAPShaderTypeMax - 1) % HAPShaderTypeMax;
    [self updateShader];
}

- (void)updateShader;
{
    switch (_shaderType) {
        case HAPShaderTypeGrayscale:
            self.shaderProgram = [HAPShaderGrayscale loadShader];
            break;

        case HAPShaderTypeInvert:
            self.shaderProgram = [HAPShaderInvert loadShader];
            break;

        default:
            self.shaderProgram = [HAPShader loadShader];
            break;
    }
}

@end

