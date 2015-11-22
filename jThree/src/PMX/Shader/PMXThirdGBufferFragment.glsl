precision mediump float;

varying vec4 vPosition;
varying vec3 vNormal;
varying vec2 vUV;
varying vec2 vSphereUV;

uniform vec3 specular;

void main(void)
{
	gl_FragColor.rgb = specular;
}
