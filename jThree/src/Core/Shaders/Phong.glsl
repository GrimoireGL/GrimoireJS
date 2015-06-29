precision mediump float;
varying vec3 v_normal;
varying  vec2 v_uv;
varying vec4 v_pos;

uniform vec4 u_diffuse;
uniform vec4 u_specular;
uniform vec4 u_ambient;
uniform vec3 u_DirectionalLight;
uniform mat4 matMVP;
uniform mat4 matMV;
uniform mat4 matV;
uniform sampler2D u_sampler;
uniform sampler2D u_light;

$Common

void main(void){
  vec2 adjuv=v_uv;
  //calculate light vector in view space
  vec3 dlDir=-normalize((matV*vec4(u_DirectionalLight,0)).xyz);
  float brightness=min(1.0,max(0.0,dot(dlDir,v_normal)));
  gl_FragColor = texture2D(u_sampler,adjuv);
  gl_FragColor.rgb*=brightness;
  //half vector in view space
  vec3 hv=normalize(dlDir+vec3(0,0,1));
  float spBrightness=pow(dot(hv,v_normal),u_specular.a);
  gl_FragColor.rgb+=u_ambient.rgb;
  gl_FragColor.rgb+=u_specular.rgb*spBrightness;
  //calculate light uv
  vec2 lightUV=calcLightUV(v_pos);
  gl_FragColor.rgb=texture2D(u_light,lightUV).xyz;
}
