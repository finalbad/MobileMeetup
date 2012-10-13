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


+ (CCGLProgram *)loadShader;
{

    HAPShader *shaderLoader = [[HAPShader alloc] init];
    NSString *shaderName = [shaderLoader shaderName];
    CCGLProgram *shader = [[CCShaderCache sharedShaderCache] programForKey:shaderName];
    if (shader == nil){
        NSString *vertexShader = [shaderLoader vertexShader];
        NSString *fragmentShader = [shaderLoader fragmentShader];

        shader = [[CCGLProgram alloc] initWithVertexShaderByteArray:[vertexShader UTF8String] fragmentShaderByteArray:[fragmentShader UTF8String]];
        
        [shader addAttribute:kCCAttributeNamePosition index:kCCVertexAttrib_Position];
        [shader addAttribute:kCCAttributeNameTexCoord index:kCCVertexAttrib_TexCoords];
        [shader link];
        [shader updateUniforms];
        
        [[CCShaderCache sharedShaderCache] addProgram:shader forKey:shaderName];
    }
    return shader;
    
}

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

        void main()
        {
            gl_FragColor = texture2D(u_texture, v_texCoord);
        }
    );
}

@end
