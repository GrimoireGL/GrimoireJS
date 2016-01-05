precision mediump float;

attribute vec4 position;
attribute vec4 boneWeights;
attribute vec4 boneIndicies;

uniform mat4 matVP;
uniform sampler2D boneMatricies;
uniform float boneCount;

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
	gl_Position = matVP*boneTransform*position;
}
