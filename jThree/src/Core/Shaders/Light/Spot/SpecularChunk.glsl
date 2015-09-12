vec3 calcSpotLight(vec3 position,vec3 normal,int i,vec3 specular,float specularCoefficient)
{
  vec3 accum=vec3(0,0,0);
  vec3 color = getLightParameter(i,0).yzw;
  vec3 lpos = getLightParameter(i,1).xyz;
  vec3 ldir = getLightParameter(i,2).xyz;
  vec3 params = getLightParameter(i,3).xyz;
  return accum;
}
