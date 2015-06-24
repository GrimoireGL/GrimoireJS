precision mediump float;
varying  vec2 v_uv;

uniform sampler2D rb1;
uniform sampler2D rb2;
uniform sampler2D depth;
uniform vec3 c_pos;
uniform vec3 c_dir;

uniform vec3 l_pos[5];
uniform vec4 l_col[5];
uniform mat4 matIP;

void main(void){
  float d=texture2D(depth,v_uv).r;
  vec3 posClip=vec3(2.0*v_uv+vec2(-1,-1),d*2.0-1.0);
  vec3 normal=texture2D(rb1,v_uv).xyz;
  vec4 position=matIP*vec4(posClip,1);
  vec3 p2l=normalize(l_pos[0]-position.xyz);
  float l = dot(p2l,normal);
  gl_FragColor.rgb=(posClip+vec3(1.0,1.0,1.0))/2.0;
  gl_FragColor.a=1.0;
}
