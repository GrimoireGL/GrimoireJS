precision mediump float;
varying vec3 v_normal;
varying  vec2 v_uv;

uniform vec4 u_color;
uniform mat4 matMVP;
uniform mat4 matMV;
void main(void){
  gl_FragColor = u_color;
}
