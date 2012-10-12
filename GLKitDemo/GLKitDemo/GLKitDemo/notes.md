# Starting OpenGL ES 2.0 with GLKit


## GLKit Pros:

1. It can be used to increase development speed if your target is iOS/OS X only.

2. It can be used as a crutch. A crutch provides strength where strength is lacking.

3. You can pick and choose which pieces of GLKit you want to use -- all the GLKit classes are fully interoperable with regular OpenGL ES 2.0.

4. It's got a good selection of math functions & matrix/vector types.


## GLKit Cons:

1. Hinders portability if your target includes non-Apple devices.

2. It's closed-source: Each GLKit class performs a bunch of OpenGL funcitons, but you can't see what's happening, and you have limited control over how it works.


## Suggestion:

OpenGL has a steep learning curve. Figuring out why something isn't working can be difficult if you don't already know all the parts of its workflow. I've used GLKit to allow me to defer learning certain parts of it while learning others. Since it's completely modular, you can transition parts of your code out of GLKit and into regular OpenGL ES 2.0 as it becomes necessary to do so.
Refer to book: [Learning OpenGL ES for iOS: A Hands-On Guide to Modern 3D Graphics Programming](http://my.safaribooksonline.com/9780132478939)


## Steps
1. GLKViewController; top-level view is a GLKView

2.  "setupGL": Performs basic OpenGL setup, then sends Vertex data for objects in scene.
    The Vertex data includes positions & texture coordinates.
    Also sends the texture data using GLKTextureInfo.

4. Implement methods:
    - (void)update;
Update the scene data.

    - (void)glkView:(GLKView *)view drawInRect:(CGRect)rect;
Draw the scene.

### Other Notes:
I created the object in Blender. The texture coordinates are assigned in Blender as well.
It was then exported to a Wavefront .obj file, and converted from .obj to a C header file using a perl script.
The perl script can be found here: https://github.com/HBehrens/obj2opengl
