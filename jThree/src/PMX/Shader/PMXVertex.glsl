precision mediump float;
attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;
attribute vec4 boneWeights;
attribute vec4 boneIndicies;
uniform mat4 matMVP;
uniform mat4 matMV;
uniform mat4 matVP;

varying vec3 v_normal;
varying vec2 v_uv;
varying vec4 v_pos;
varying vec2 v_spuv;


uniform sampler2D u_boneMatricies;
uniform float u_boneCount;

mat4 matFromIndex(float index)
{
	float y =index/u_boneCount+1./u_boneCount/2.;
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
v_normal=normalize((matMV*vec4(normal,0)).xyz);
v_spuv=v_normal.xy/2.+vec2(0.5,0.5);
v_uv=uv;
}
