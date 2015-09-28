precision mediump float;
varying vec3 v_normal;
varying  vec2 v_uv;
varying vec4 v_pos;
uniform vec4 u_diffuse;

uniform vec4 u_specular;
uniform vec3 u_ambient;
uniform vec3 u_DirectionalLight;
uniform mat4 matMVP;
uniform mat4 matMV;
uniform mat4 matV;
uniform sampler2D dlight;
uniform sampler2D slight;
uniform sampler2D u_texture;
uniform sampler2D u_sphere;
uniform sampler2D u_toon;
varying vec2 v_spuv;
uniform int u_textureUsed;
uniform int u_sphereMode;
uniform int u_toonFlag;
uniform vec4 u_addTexCoeff;
uniform vec4 u_mulTexCoeff;
uniform vec4 u_addSphereCoeff;
uniform vec4 u_mulSphereCoeff;
uniform vec4 u_addToonCoeff;
uniform vec4 u_mulToonCoeff;
uniform vec3 ambientCoefficient;

vec2 calcLightUV(vec4 projectionSpacePos)
{
   return (projectionSpacePos.xy/projectionSpacePos.w+vec2(1,1))/2.;
}

vec4 blendPMXTexture(sampler2D source,vec2 uv,vec4 addCoeff,vec4 mulCoeff)
{
    vec4 result=texture2D(source,uv);
    result.rgb=mix(mix(result.rgb,vec3(0,0,0),addCoeff.a),vec3(1,1,1),1.-mulCoeff.a);
    result.rgb=result.rgb*mulCoeff.rgb+addCoeff.rgb;
    return result;
}

void main(void){
  gl_FragColor = vec4(0,0,0,0);
  vec2 adjuv=v_uv;
  adjuv.y=1.-adjuv.y;
  vec2 lightUV=calcLightUV(v_pos);
  vec3 dl = texture2D(dlight,lightUV).rgb;
    if(u_toonFlag==1)
    {
		float brightness = length(dl/u_diffuse.rgb)/1.732;
          gl_FragColor.rgb+=blendPMXTexture(u_toon,vec2(0,1.-brightness),u_addToonCoeff  ,u_mulToonCoeff ).rgb*dl;
    }else
    {
          gl_FragColor.rgb+=dl;
    }
	gl_FragColor.a=u_diffuse.a;
    gl_FragColor.rgb+=u_ambient*ambientCoefficient;
}
