precision mediump float;

varying vec3 vNormal;
varying vec2 vUV;
varying vec4 vPos;

uniform vec3 specular;

void main()
{
	gl_FragColor.rgb = specular;
}