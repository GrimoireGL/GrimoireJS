vec3 calcAreaLight(vec3 position,vec3 normal,int i,vec4 diffuse)
{
  vec3 accum=vec3(0,0,0);
  vec3 color = getLightParameter(i,0).yzw;
  vec3 base = getLightParameter(i,1).xyz;
  mat3 factor=mat3(getLightParameter(i,2).xyz,getLightParameter(i,3).xyz,getLightParameter(i,4));
  vec3 vRelative = position - base;
  vec3 e= factor * vRelative;
  if(e.x < 1. && e.x >0. && e.y <1. && e.y >0. && e.z < 1. && e.z >0.)
  {
    accum += color;
  }
  // }else
  // {
  //   if(e.x <0.)accum+=vec3(1,0,0);
  //   if(e.y <0.)accum+=vec3(0,1,0);
  //   if(e.z <0.)accum+=vec3(0,0,1);
  // }
  return accum;
}
