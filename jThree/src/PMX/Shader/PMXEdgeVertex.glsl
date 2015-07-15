precision mediump float;
attribute vec3 position;
attribute vec3 normal;
attribute float edgeScaling;
uniform mat4 matMVP;
uniform float u_edgeSize;
void main(void){
	vec4 p0 = matMVP*vec4(position,1);
	vec4 p1 = matMVP*vec4(position+normal,1);
	p0.xy/=p0.w;
	p1.xy/=p1.w;
	float coeff=(512./2.0)*distance(p0.xy,p1.xy);
	if(coeff > 1.0) coeff = 1.0/coeff;
	coeff*=u_edgeSize*edgeScaling;
	gl_Position = matMVP*vec4(position + coeff*normal,1);
}
