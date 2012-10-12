//
//  HDJInvertShader.m
//  Shader-iOS
//
//  Created by Joseph Kim on 10/12/12.
//
//

#import "HDJInvertShader.h"
#import "HDJMacros.h"
#import "cocos2d.h"

@implementation HDJInvertShader
+ (CCGLProgram *)loadShader;
{

    NSString *const vertexShader = String(
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
    
    NSString *fragmentShader =  String(
        precision highp float;
        varying highp vec2 v_texCoord;
        uniform sampler2D u_texture;
        
        void main()
        {
            vec4 color = texture2D(u_texture, v_texCoord);
            gl_FragColor = vec4((1.0 - color.rgb), color.a);
        }
        
    );

    #define ShaderKey @"HDJGrayscaleShader"

    CCGLProgram *shader = [[CCShaderCache sharedShaderCache] programForKey:ShaderKey];
    
    if (shader == nil){
        shader = [[CCGLProgram alloc] initWithVertexShaderByteArray:[vertexShader UTF8String] fragmentShaderByteArray:[fragmentShader UTF8String]];
        
        [shader addAttribute:kCCAttributeNamePosition index:kCCVertexAttrib_Position];
        [shader addAttribute:kCCAttributeNameTexCoord index:kCCVertexAttrib_TexCoords];
        [shader link];
        [shader updateUniforms];
        
        [[CCShaderCache sharedShaderCache] addProgram:shader forKey:@"HDJGrayscaleShader"];
    }
    
    return shader;

}

@end
