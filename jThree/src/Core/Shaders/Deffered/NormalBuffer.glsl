precision mediump float;
varying vec3 v_normal;
void main(void){
  vec2 compressed=normalize(v_normal.xy)*sqrt(v_normal.z*0.5+0.5);
  vec2 pre1 = compressed;
  vec2 pre2 = fract(pre1 * 255.0);
  float coef = 1.0 / 255.0;
  pre1 -=pre2 * coef;
  gl_FragColor=vec4(pre1.x,pre2.x,pre1.y,pre2.y);
}
