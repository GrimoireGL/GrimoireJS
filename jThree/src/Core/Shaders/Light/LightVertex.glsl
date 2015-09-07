//attribute variables
attribute vec4 position;
attribute vec2 uv;

varying vec2 vUV;

void main(void)
{
	gl_Position = position;
	vUV=uv;
}