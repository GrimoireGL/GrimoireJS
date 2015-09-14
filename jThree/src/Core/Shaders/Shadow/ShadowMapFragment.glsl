precision mediump float;

//varying variables
varying vec4 vPosition;

void main(void)
{
  gl_FragColor.r = vPosition.z/vPosition.w;
}
