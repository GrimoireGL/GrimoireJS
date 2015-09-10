precision mediump float;
varying vec3 vNormal;
varying  vec2 vUv;
varying vec4 vPosition;

uniform vec4 diffuse;
uniform vec4 specular;
uniform vec4 ambient;
uniform vec3 ambientCoefficient;
uniform mat4 matMVP;
uniform mat4 matMV;
uniform mat4 matV;
uniform int textureUsed;
uniform sampler2D texture;
uniform sampler2D dlight;
uniform sampler2D slight;

vec2 calcLightUV(vec4 projectionSpacePos)
{
   return (projectionSpacePos.xy/projectionSpacePos.w+vec2(1,1))/2.;
}

void main(void){
  vec2 adjuv=vUv;
  gl_FragColor=vec4(0,0,0,1);
  //gl_FragColor.rgb+=ambient.rgb;
  ////calculate light uv
  vec2 lightUV=calcLightUV(vPosition);
  gl_FragColor.rgb+=texture2D(dlight,lightUV).rgb+texture2D(slight,lightUV).rgb;
  gl_FragColor.rgb +=ambient.rgb;
}
