precision mediump float;
varying vec3 v_normal;
uniform vec4 u_color;
uniform mat4 matMVP;
uniform mat4 matMV;
void main(void){
  gl_FragColor = u_color;
}
