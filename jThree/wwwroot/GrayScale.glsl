precision mediump float;
varying  vec2 v_uv;

uniform mediump sampler2D source;
void main(void){
  gl_FragColor.a=1.;
  vec3 pointCol=(texture2D(source,v_uv).rgb);
  float l=length(pointCol)/1.732;
  gl_FragColor.rgb=vec3(l,l,l);
}
