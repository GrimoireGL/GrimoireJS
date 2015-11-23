//attribute variables

attribute vec4 position;

//varying variables

varying vec4 vPosition;

//uniform variables
uniform mat4 matPLW;//(light-space-projection)*(light-space-view)*(world)
uniform mat4 matLV;

void main(void)
{
  gl_Position = matPLW * position;
  vPosition = matPLW * position;
}
