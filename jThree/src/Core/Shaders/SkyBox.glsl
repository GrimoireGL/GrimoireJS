precision mediump float;
uniform samplerCube skyTex;
varying vec2 v_uv;
varying vec3 v_position;

void main()
{
	vec3 dir = v_position;
	gl_FragColor=vec4(textureCube(skyTex,dir));
}