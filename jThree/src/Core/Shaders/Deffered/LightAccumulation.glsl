precision mediump float;
varying  vec2 v_uv;

uniform sampler2D rb1;
uniform sampler2D rb2;
uniform sampler2D depth;
uniform vec3 c_pos;
uniform vec3 c_dir;

void main(void){
  gl_FragColor.rgb = texture2D(depth,v_uv).rgb;
  gl_FragColor.a = 1.0;
}
