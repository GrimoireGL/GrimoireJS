precision mediump float;

//UNIFORM VARIABLES
uniform float specularCoefficient;

//VARYING VARIABLES
varying vec3 vNormal;
varying vec4 vPosition;
varying vec2 vUV;
varying vec2 vSphereUV;

vec2 compressNormal()
{
	float p = sqrt(vNormal.z * 8. + 8.);
	return vNormal.xy/p + 0.5;
}

float calcDepth()
{
	return vPosition.z/vPosition.w;
}

void main(void)
{
	gl_FragColor = vec4(compressNormal(),calcDepth(),specularCoefficient);
}
