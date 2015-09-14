precision mediump float;

//varying variables
varying vec4 vPosition;

vec4 pack_float(float f){
   const vec4 bit_shift = vec4(256.0*256.0*256.0, 256.0*256.0, 256.0, 1.0);
   const vec4 bit_mask = vec4(0.0, 1.0/256.0, 1.0/256.0, 1.0/256.0);
   vec4 res = fract(f * bit_shift);
   res -= res.xxyz * bit_mask;
   return res;
}

void main(void)
{
  gl_FragColor.rgb = pack_float(vPosition.z/vPosition.w).rgb;
}
