precision mediump float;

varying vec3 v_normal;
varying vec2 v_uv;
varying vec4 v_pos;

uniform sampler2D texture;
uniform vec4 albedo;
uniform int textureUsed;

void main()
{
	if(textureUsed == 1)
	{
		gl_FragColor = texture2D(texture,v_uv) * albedo;
	}else
	{
		gl_FragColor = albedo;
	}
}