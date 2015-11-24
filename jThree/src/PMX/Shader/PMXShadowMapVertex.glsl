precision mediump float;
attribute vec4 position;
attribute vec4 boneWeights;
attribute vec4 boneIndicies;

uniform mat4 matLVP;
uniform mediump sampler2D boneMatricies;
uniform float boneCount;

varying vec4 vPosition;

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
vec4 tPos = boneTransform * position;
 vPosition = gl_Position = matLVP * tPos;
}
