//
//  HAPShaderGrayscale.m
//  CocosShaderDemo
//
//  Created by Joseph Kim on 10/12/12.
//  Copyright (c) 2012 Happy Dojo. All rights reserved.
//

#import "HAPShaderGrayscale.h"
#import "HAPMacros.h"

@implementation HAPShaderGrayscale

+ (CCGLProgram *)loadShader;
{

    HAPShaderGrayscale *shaderLoader = [[HAPShaderGrayscale alloc] init];
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
    return @"Grayscale";
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
            vec4 color = texture2D(u_texture, v_texCoord);
            float luminance = dot(color.rgb, W);
            gl_FragColor = vec4(vec3(luminance), color.a);
        }
    );
}


@end
