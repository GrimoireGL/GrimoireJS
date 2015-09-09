precision mediump float;
varying vec3 vNormal;
varying  vec2 vUv;

uniform mat4 matMVP;
uniform mat4 matMV;
uniform mat4 matV;
uniform mat4 ctM;
uniform float additonA;
uniform sampler2D u_sampler;

void main(void){
  gl_FragColor = ctM*texture2D(u_sampler,vUv);
  gl_FragColor.a += additonA;
  //if(gl_FragColor.a==0.0)discard;
}
