precision mediump float;
varying vec3 v_normal;
varying  vec2 v_uv;
varying vec4 v_pos;
uniform mat4 matMVP;
uniform mat4 matMV;
uniform mat4 matV;

void main(void){
  float w=v_pos.z/v_pos.w;
  gl_FragColor.rgb=v_normal;
  gl_FragColor.a=w;
}
