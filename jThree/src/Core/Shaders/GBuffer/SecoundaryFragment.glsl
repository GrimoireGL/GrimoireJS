precision mediump float;

varying vec3 vNormal;
varying vec2 vUV;
varying vec4 vPos;

uniform sampler2D texture;
uniform vec4 albedo;
uniform int textureUsed;

void main()
{
	if(textureUsed == 1)
	{
		gl_FragColor = texture2D(texture,vUV) * albedo;
	}else
	{
		gl_FragColor = albedo;
	}
}