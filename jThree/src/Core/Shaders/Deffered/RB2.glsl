precision mediump float;
varying vec3 v_normal;
varying  vec2 v_uv;
varying vec4 v_pos;
uniform mat4 matMVP;
uniform mat4 matMV;
uniform mat4 matV;
uniform sampler2D texture;
//R=ALBEDO.R
//G=ALBEDO.G
//B=ALBEDO.B
//A=ROUGHNESS
void main(void){
  gl_FragColor.rgb = vec3(0,1,0);//texture2D(texture,v_uv).rgb;
  gl_FragColor.a = 1.0;
}
