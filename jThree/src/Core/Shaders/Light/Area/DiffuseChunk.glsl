vec3 calcAreaLight(vec3 position,vec3 normal,int i,vec4 diffuse)
{
  vec3 accum=vec3(0,0,0);
  vec3 color = getLightParameter(i,0).yzw*diffuse.rgb*diffuse.a;
  vec3 base = getLightParameter(i,1).xyz;
  mat3 factor=mat3(getLightParameter(i,2).xyz,getLightParameter(i,3).xyz,getLightParameter(i,4));
  vec3 vRelative = position - base;
  vec3 estimation = factor * vRelative;
  if(estimation.X > 0. && estimation.X < 1. && estimation.Y >0. && estimation.Y <1. &&estimation.Z >0 && estimation.Z < 1.)
  {
    accum += color;
  }
  return accum;
}
