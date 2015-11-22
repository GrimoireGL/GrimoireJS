precision mediump float;

//varying variables
varying vec4 vPosition;

vec3 pack_float(float f){
   const vec3 bit_shift = vec3( 256.0*256.0, 256.0, 1.0);
   const vec3 bit_mask = vec3(0.0, 1.0/256.0, 1.0/256.0);
   vec3 res = fract(f * bit_shift);
   res -= res.xxy * bit_mask;
   return res;
}

void main(void)
{
  gl_FragColor.rgb = vec3(1,0,0);//pack_float(vPosition.z/vPosition.w);
}
