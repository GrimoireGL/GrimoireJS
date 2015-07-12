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
uniform sampler2D u_sampler;
uniform sampler2D u_light;
uniform sampler2D u_texture;

vec2 calcLightUV(vec4 projectionSpacePos)
{
   return (projectionSpacePos.xy/projectionSpacePos.w+vec2(1,1))/2.;
}

void main(void){
  vec2 adjuv=v_uv;
  adjuv.y=1.-adjuv.y;
  vec2 lightUV=calcLightUV(v_pos);
  gl_FragColor.rgba=u_diffuse;
  gl_FragColor.rgba=texture2D(u_texture,adjuv);
  //gl_FragColor.rgb*=texture2D(u_light,lightUV).rgb;
  //gl_FragColor.rgb+=u_ambient.rgb;
}
