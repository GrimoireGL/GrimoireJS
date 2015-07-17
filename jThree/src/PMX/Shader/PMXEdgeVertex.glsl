precision mediump float;
attribute vec3 position;
attribute vec3 normal;
attribute float edgeScaling;
attribute vec4 boneWeights;
attribute vec4 boneIndicies;

uniform mat4 matVP;
uniform float u_edgeSize;


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
	mat4 matMVP=matVP*getBoneTransform();
	vec4 p0 = matMVP*vec4(position,1);
	vec4 p1 = matMVP*vec4(position+normal,1);
	p0.xy/=p0.w;
	p1.xy/=p1.w;
	float coeff=(512./2.0)*distance(p0.xy,p1.xy);
	if(coeff > 1.0) coeff = 1.0/coeff;
	coeff*=u_edgeSize*edgeScaling;
	gl_Position = matMVP*vec4(position + coeff*normal,1);
}
