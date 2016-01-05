vec3 calcSpotLight(vec3 position,vec3 normal,int i,vec4 diffuse)
{
  vec3 accum=vec3(0,0,0);
  vec3 color = getLightParameter(i,0).yzw;
  vec3 lpos = getLightParameter(i,1).xyz;
  vec3 ldir = getLightParameter(i,2).xyz;
  vec3 params = getLightParameter(i,3).xyz;
  vec3 l2p = normalize(position-lpos);
  accum += color
    * max(0.,dot(-l2p,normal)) //Normal attenuation
   * pow(max(0.,min(1.,dot(l2p,ldir)/(params.x-params.y) - params.y/(params.x - params.y))),params.z); // spot light range attenuation
  return accum;
}
