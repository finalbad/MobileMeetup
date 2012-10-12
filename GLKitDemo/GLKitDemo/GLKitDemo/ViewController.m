//
//  ViewController.m
//  GLKitDemo
//
//  Created by David Sweetman on 10/10/12.
//

#import "ViewController.h"
#import "GLProgram.h"

#import "ExplodedSphere.h"

//Parts of GLKit used in this example:
//1. GLKViewController, GLKView. Encapsulates Framebuffer & update functionality.
//2. GLKTextureInfo, GLKTextureLoader. Encapsulates texture loading.
//3. GLKMatrix types, GLK math functions.

enum
{
    UNIFORM_MVPMATRIX,
    UNIFORM_SAMPLER,
    NUM_UNIFORMS
};
GLint uniforms[NUM_UNIFORMS];


@interface ViewController () {
    GLuint _vertexArrayID;
    GLuint _vertexBufferID;
    GLuint _vertexTexCoordID;
    GLuint _vertexTexCoordAttributeIndex;
    
    GLKMatrix4 _modelViewProjectionMatrix;
    
    float _rotationX;
    float _rotationY;
}
@property (strong, nonatomic) GLProgram *program;
@property (strong, nonatomic) EAGLContext *context;
@property (strong, nonatomic) GLKTextureInfo *texture;

@property (strong, nonatomic) NSMutableArray *currentTouches;

- (void)setupGL;
- (void)tearDownGL;
- (void)buildProgram;
@end

@implementation ViewController

#pragma mark - View Lifecycle
/////////////////////////////
- (void)viewDidLoad
{
    [super viewDidLoad];
    
    self.context = [[EAGLContext alloc] initWithAPI:kEAGLRenderingAPIOpenGLES2];
    
    if (!self.context) {
        NSLog(@"Failed to create ES context");
    }
    
    GLKView *view = (GLKView *)self.view;
    view.context = self.context;
    
    self.preferredFramesPerSecond = 60.0;
    
    _currentTouches = [[NSMutableArray alloc] init];
    
    [self setupGL];
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
}

#pragma mark - OpenGL Setup
////////////////////////////////////////
- (void)setupGL
{
    [EAGLContext setCurrentContext:self.context];
    
    [self buildProgram];
    
    // Send the Object's Vertices & Texture Coordinates:
    
    // This vertex array will refer to all of the following vertex data. We can restore
    // the data whenever we want by simply calling glBindVertexArrayOES(_vertexArrayID);
    // as shown in the glkView:drawInRect: method.
    glGenVertexArraysOES(1, &_vertexArrayID);
    glBindVertexArrayOES(_vertexArrayID);
    
    //Generate a unique identifier for the buffer.
    glGenBuffers(1, &_vertexBufferID);
    //Bind the buffer for subsequent operations.
    glBindBuffer(GL_ARRAY_BUFFER, _vertexBufferID);
    //Send the actual vertex data to the buffer.
    glBufferData(GL_ARRAY_BUFFER,
                 //Specify number of vertices contained in the vertex array.
                 sizeof(ExplodedSphereVerts),
                 //Specify the array to pull the vertices from.
                 ExplodedSphereVerts,
                 //Tell OpenGL to store vertices statically or dynamically
                 GL_STATIC_DRAW);
    //Enable use of currently bound buffer.
    glEnableVertexAttribArray(GLKVertexAttribPosition);
    //Tell OpenGL how to interpret the data.
    glVertexAttribPointer(GLKVertexAttribPosition,
                          //Each vertex has three components (x,y,z).
                          3,
                          //Data is of type floating point
                          GL_FLOAT,
                          //No fixed point scaling - will alwyas be false with ES
                          GL_FALSE,
                          //Size of each vertex. Contains 3 floats for x,y,z.
                          sizeof(float) * 3,
                          //Where to start reading each vertex; used for interleaving.
                          NULL);
    
    //This process is the same as above, but for texture
    //coordinates instead of position coordinates.
    //Since our positions & tex coords are not interleaved, we
    //need to generate a separate buffer object for each.
    glGenBuffers(1, &_vertexTexCoordID);
    glBindBuffer(GL_ARRAY_BUFFER, _vertexTexCoordID);
    glBufferData(GL_ARRAY_BUFFER,
                 sizeof(ExplodedSphereTexCoords),
                 ExplodedSphereTexCoords,
                 GL_STATIC_DRAW);
    glEnableVertexAttribArray(_vertexTexCoordAttributeIndex);
    glVertexAttribPointer(_vertexTexCoordAttributeIndex,
                          2,
                          GL_FLOAT,
                          GL_FALSE,
                          sizeof(float) * 2,
                          NULL);
    
    //Use GLKTextureLoader to simplify loading a texture:
    NSError *error;
    NSString *textureFile = [[NSBundle mainBundle]
                             pathForResource:@"CloudTexture" ofType:@"png"];
    
    _texture = [GLKTextureLoader textureWithContentsOfFile:textureFile
                                                   options:nil
                                                     error:&error];
    
    if (error) NSLog(@"Error loading texture: %@", error);
}

#pragma mark - draw & update methods
////////////////////////////////////
- (void)update
{
    if (_currentTouches.count == 0) {
        _rotationX += self.timeSinceLastUpdate * 0.5f;
        _rotationY += self.timeSinceLastUpdate * 0.5f;
    }
    
    float aspect = fabsf(self.view.bounds.size.width / self.view.bounds.size.height);
    GLKMatrix4 projectionMatrix = GLKMatrix4MakePerspective(GLKMathDegreesToRadians(65.0f),
                                                            aspect,
                                                            0.1f,
                                                            100.0f);
    
    GLKMatrix4 modelViewMatrix = GLKMatrix4Identity;
    modelViewMatrix = GLKMatrix4Rotate(modelViewMatrix, _rotationX, 1.0f, 0.0f, 1.0f);
    modelViewMatrix = GLKMatrix4Rotate(modelViewMatrix, _rotationY, 0.0f, 1.0f, 1.0f);
    
    _modelViewProjectionMatrix = GLKMatrix4Multiply(projectionMatrix, modelViewMatrix);
}

- (void)glkView:(GLKView *)view drawInRect:(CGRect)rect
{
    [_program use];
    
    glBindVertexArrayOES(_vertexArrayID);
    
    glClearColor(0.0f, 0.0f, 0.0f, 1.0f);
    glClear(GL_COLOR_BUFFER_BIT);
    
    glUniformMatrix4fv(uniforms[UNIFORM_MVPMATRIX], 1, 0, _modelViewProjectionMatrix.m);
    
    glActiveTexture(GL_TEXTURE0);
    glBindTexture(_texture.target, _texture.name);
    
    glDrawArrays(GL_TRIANGLES, 0, ExplodedSphereNumVerts);
}

#pragma mark - touches
- (void)touchesBegan:(NSSet *)touches withEvent:(UIEvent *)event
{
    for (UITouch *touch in touches) {
        [_currentTouches addObject:touch];
    }
}
- (void)touchesMoved:(NSSet *)touches withEvent:(UIEvent *)event
{
    UITouch *touch = [touches anyObject];
    float distX = [touch locationInView:touch.view].x -
                  [touch previousLocationInView:touch.view].x;
    float distY = [touch locationInView:touch.view].y -
                [touch previousLocationInView:touch.view].y;
    distX *= -0.01;
    distY *= -0.01;
    _rotationX += distX;
    _rotationY += distY;
}
- (void)touchesEnded:(NSSet *)touches withEvent:(UIEvent *)event
{
    for (UITouch *touch in touches) {
        [_currentTouches removeObject:touch];
    }
}
- (void)touchesCancelled:(NSSet *)touches withEvent:(UIEvent *)event
{
    for (UITouch *touch in touches) {
        [_currentTouches removeObject:touch];
    }
}

#pragma mark - OpenGL Program
/////////////////////////////
- (void)buildProgram
{
    //Create program
    
    _program = [[GLProgram alloc]
                initWithVertexShaderFilename:@"Shader"
                fragmentShaderFilename:@"Shader"];
    
    //Assign Attributes
    
    [_program addAttribute:@"a_position"];
    [_program addAttribute:@"a_textureCoord"];
    
    //Link Program
    
    if (![_program link])
	{
		NSString *programLog = [_program programLog];
		NSLog(@"Program link log: %@", programLog);
		NSString *fragmentLog = [_program fragmentShaderLog];
		NSLog(@"Fragment shader compile log: %@", fragmentLog);
		NSString *vertexLog = [_program vertexShaderLog];
		NSLog(@"Vertex shader compile log: %@", vertexLog);
		_program = nil;
        NSAssert(NO, @"Falied to link HalfSpherical shaders");
	}
    
    _vertexTexCoordAttributeIndex = [_program attributeIndex:@"a_textureCoord"];

    uniforms[UNIFORM_MVPMATRIX] = [_program uniformIndex:@"u_modelViewProjectionMatrix"];
    uniforms[UNIFORM_SAMPLER] = [_program uniformIndex:@"u_Sampler"];
}

#pragma mark - cleanup
//////////////////////
- (void)tearDownGL
{
    [EAGLContext setCurrentContext:self.context];
    
    glDeleteBuffers(1, &_vertexBufferID);
    glDeleteVertexArraysOES(1, &_vertexArrayID);
    glDeleteBuffers(1, &_vertexTexCoordID);
    
    _program = nil;
    _texture = nil;
}


@end
