vec3 calcAreaLight(vec3 position,vec3 normal,int i,vec4 diffuse)
{
  vec3 accum=vec3(0,0,0);
  vec3 color = getLightParameter(i,0).yzw*diffuse.rgb*diffuse.a;
  vec3 base = getLightParameter(i,1).xyz;
  vec3 right = getLightParameter(i,2).xyz;
  vec3 top = getLightParameter(i,3).xyz;
  vec3 far = getLightParameter(i,4).xyz;
  return accum;
}
