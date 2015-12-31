precision mediump float;
varying vec3 v_normal;
varying  vec2 v_uv;
varying vec4 v_pos;
varying vec2 v_spuv;

uniform vec4 u_diffuse;
uniform vec4 u_specular;
uniform vec3 u_ambient;
uniform vec3 u_DirectionalLight;
uniform sampler2D dlight;
uniform sampler2D slight;
uniform sampler2D u_texture;
uniform sampler2D u_sphere;
uniform sampler2D u_toon;
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
  vec2 lightUV=calcLightUV(v_pos);
  vec3 dlc = texture2D(dlight,lightUV).rgb;
  vec3 slc = texture2D(slight,lightUV).rgb;
  vec3 alc = u_ambient * ambientCoefficient;
  if(u_toonFlag==1)
  {
		  float brightness = max(max(dlc.r,dlc.g),dlc.b);
      gl_FragColor.rgb+=blendPMXTexture(u_toon,vec2(0,1.-brightness),u_addToonCoeff  ,u_mulToonCoeff ).rgb * dlc;
  }else
  {
      gl_FragColor.rgb+=dlc;
  }
	gl_FragColor.a=u_diffuse.a;
  gl_FragColor.rgb += slc + alc;
}
