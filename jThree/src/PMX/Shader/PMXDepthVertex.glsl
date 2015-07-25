precision mediump float;
attribute vec3 position;
attribute vec4 boneWeights;
attribute vec4 boneIndicies;
uniform mat4 matVP;
varying vec4 v_pos;


uniform mediump sampler2D u_boneMatricies;
uniform float u_boneCount;

mat4 matFromIndex(float index)
{
	float y =index/u_boneCount+1./u_boneCount/2.;
	y=1.-y;
	return mat4(
	texture2D(u_boneMatricies,vec2(0.125,y)),
	texture2D(u_boneMatricies,vec2(0.375,y)),
	texture2D(u_boneMatricies,vec2(0.625,y)),
	texture2D(u_boneMatricies,vec2(0.875,y)));
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
v_pos=gl_Position = matVP*boneTransform*vec4(position,1.0);
}
