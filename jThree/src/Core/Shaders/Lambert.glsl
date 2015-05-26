precision mediump float;
varying vec3 v_normal;
uniform vec4 u_color;
uniform vec3 u_DirectionalLight;
uniform mat4 matMVP;
uniform mat4 matMV;
uniform mat4 matV;

void main(void){
  vec3 dlDir=-normalize((matV*vec4(u_DirectionalLight,0)).xyz);
  float brightness=min(1.0,max(0.0,dot(dlDir,v_normal)));
  gl_FragColor = u_color;
  gl_FragColor.rgb*=brightness;
}
