precision mediump float;
varying vec3 v_normal;
varying  vec2 v_uv;
varying vec4 v_pos;
uniform mat4 matMVP;
uniform mat4 matMV;
uniform mat4 matV;
//R=NORMAL.X
//G=NORMAL.Y
//B=NORMAL.Z
//A=DEPTH
void main(void){
  float w=v_pos.z;
  gl_FragColor.rgb=v_normal*0.5+vec3(0.5,0.5,0.5);
  gl_FragColor.a=w;
}
