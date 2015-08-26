vec3 calcDirectionalLight(vec3 position,vec3 normal,int i)
{
  vec3 accum=vec3(0,0,0);
  vec3 color = getLightParameter(i,0).yzw;
  vec3 dir = getLightParameter(i,1).xyz;
  accum += max(0.,-dot(dir,normal)) * color;
  return accum;
}