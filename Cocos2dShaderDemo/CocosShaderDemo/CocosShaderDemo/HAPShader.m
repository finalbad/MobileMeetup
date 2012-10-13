//
//  HAPShader.m
//  CocosShaderDemo
//
//  Created by Joseph Kim on 10/12/12.
//  Copyright (c) 2012 Happy Dojo. All rights reserved.
//

#import "HAPShader.h"
#import "HAPMacros.h"

@implementation HAPShader

- (NSString *)shaderName;
{
    return @"Normal";
}

- (NSString *)vertexShader;
{
    return String(
        attribute vec4 a_position;
        attribute vec2 a_texCoord;				
        uniform	mat4 u_MVPMatrix;				
                                                
        #ifdef GL_ES							
        varying mediump vec2 v_texCoord;		
        #else									
        varying vec2 v_texCoord;				
        #endif									
                                                
        void main()								
        {										
            gl_Position = u_MVPMatrix * a_position;
            v_texCoord = a_texCoord;
        }
    );
}

- (NSString *)fragmentShader;
{
    return String(
        precision highp float;

        varying highp vec2 v_texCoord;
        uniform sampler2D u_texture;
        const highp vec3 W = vec3(0.2125, 0.7154, 0.0721);

        void main()
        {
            gl_FragColor = texture2D(u_texture, v_texCoord);
        }
    );
}

@end
