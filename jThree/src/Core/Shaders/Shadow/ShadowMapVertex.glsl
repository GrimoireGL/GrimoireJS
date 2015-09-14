//attribute variables

attribute vec4 position;

//varying variables

varying vec4 vPosition;

//uniform variables
uniform mat4 matPLW;//(light-space-projection)*(light-space-view)*(world)

void main(void)
{
  vPosition = gl_Position = matPLW * position;
}
