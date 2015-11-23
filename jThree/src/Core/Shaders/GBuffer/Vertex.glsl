precision highp float;

//Uniform variables
uniform mat4 matMV;
uniform mat4 matMVP;

//attribute variables
attribute vec4 position;
attribute vec3 normal;
attribute vec2 uv;
//varying varibales
varying vec3 vNormal;
varying vec4 vPosition;
varying vec2 vUV;

void main(void)
{
	gl_Position = vPosition =matMVP * position;
	vNormal =normalize(( matMV * vec4(normal,0)).xyz);
	vUV = uv;
}
