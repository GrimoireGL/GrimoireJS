precision mediump float;
varying vec3 v_normal;
varying  vec2 v_uv;
varying vec4 v_pos;

uniform vec4 u_diffuse;
uniform vec4 u_specular;
uniform vec4 u_ambient;
uniform mat4 matMVP;
uniform mat4 matMV;
uniform mat4 matV;
uniform int u_textureUsed;
uniform sampler2D u_texture;
uniform sampler2D dlight;
uniform sampler2D slight;

vec2 calcLightUV(vec4 projectionSpacePos)
{
   return (projectionSpacePos.xy/projectionSpacePos.w+vec2(1,1))/2.;
}

void main(void){
  vec2 adjuv=v_uv;
  gl_FragColor=vec4(0,0,0,1);
  //gl_FragColor.rgb+=u_ambient.rgb;
  ////calculate light uv
  vec2 lightUV=calcLightUV(v_pos);
  gl_FragColor.rgb+=texture2D(dlight,lightUV).rgb+texture2D(slight,lightUV).rgb;
}

