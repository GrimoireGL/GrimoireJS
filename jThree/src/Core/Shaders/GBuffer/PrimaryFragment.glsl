precision mediump float;

//UNIFORM VARIABLES
uniform float specularCoefficient;

//VARYING VARIABLES
varying vec3 vNormal;
varying vec4 vPosition;
varying vec2 vUV;
vec2 compressNormal()
{
	return normalize(vNormal.xy) * sqrt(vNormal.z * 0.5 +0.5);
}

float calcDepth()
{
	return vPosition.z/vPosition.w;
}

void main(void)
{
	gl_FragColor = vec4(compressNormal(),calcDepth(),specularCoefficient);
}
