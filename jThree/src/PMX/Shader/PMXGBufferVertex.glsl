precision mediump float;
attribute vec4 position;
attribute vec3 normal;
attribute vec4 boneWeights;
attribute vec4 boneIndicies;
attribute vec2 uv;

uniform mat4 matVP;
uniform mat4 matV;
uniform mediump sampler2D boneMatricies;
uniform float boneCount;

varying vec4 vPosition;
varying vec3 vNormal;
varying vec2 vUV;
varying vec2 vSphereUV;

mat4 matFromIndex(float index)
{
	float y =index/boneCount+1./boneCount/2.;
	return mat4(
	texture2D(boneMatricies,vec2(0.125,y)),
	texture2D(boneMatricies,vec2(0.375,y)),
	texture2D(boneMatricies,vec2(0.625,y)),
	texture2D(boneMatricies,vec2(0.875,y)));
}

mat4 getBoneTransform()
{
	return boneWeights.x*matFromIndex(boneIndicies.x)
	+boneWeights.y*matFromIndex(boneIndicies.y)
	+boneWeights.z*matFromIndex(boneIndicies.z)
	+boneWeights.w*matFromIndex(boneIndicies.w);
}

void main(void){
mat4 boneTransform=getBoneTransform();
vPosition=gl_Position = matVP*boneTransform*position;
vNormal=normalize((matV*boneTransform*vec4(normal,0)).xyz);
vSphereUV=vNormal.xy/2.+vec2(0.5,0.5);
vUV=uv;
}
