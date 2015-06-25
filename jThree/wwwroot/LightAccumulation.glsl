precision mediump float;
varying  vec2 v_uv;

uniform mediump sampler2D rb1;
uniform mediump sampler2D rb2;
uniform mediump sampler2D depth;
uniform vec3 c_pos;
uniform vec3 c_dir;
uniform float c_near;
uniform float c_far;
uniform float xtest;
uniform float ztest;
uniform float coef;
uniform vec3 l_pos[5];
uniform vec4 l_col[5];
uniform mat4 matIP;
uniform float time;
void main(void){
  float d=texture2D(depth,v_uv).r;
  if(d==1.)
  {
      gl_FragColor=vec4(0,0,1,1);
      return;
  }
   float z = -c_far*c_near/(-c_far+d*(c_far-c_near));
  vec2 uv=vec2(v_uv.x,1.-v_uv.y);
  vec3 posClip=vec3(2.0*uv+vec2(-1,-1),d*2.-1.);
  vec3 normal=(texture2D(rb1,v_uv).xyz-vec3(0.5,0.5,0.5))*2.0;
  vec4 position=matIP*vec4(posClip,z);
  position.x*=position.z;
  position.y*=position.z;
  position.z=z;
  float l=1.-length(position.xz-vec2(0,2));
  float de=position.y-xtest/100.;
  gl_FragColor.rgb=abs(de)<0.1?vec3(0,0,0):texture2D(rb2,v_uv).xyz;
  gl_FragColor.a=1.0;
}