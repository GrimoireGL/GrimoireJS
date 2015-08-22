precision mediump float;
uniform samplerCube skyTex;
varying vec2 v_uv;
varying vec3 v_position;

void main()
{
	gl_FragColor=vec4(textureCube(skyTex,v_position));
}