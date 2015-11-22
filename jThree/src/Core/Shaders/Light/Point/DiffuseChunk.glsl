vec3 calcPointLight(vec3 position,vec3 normal,int i,vec4 diffuse)
{
  vec3 accum=vec3(0,0,0);
  vec3 color = getLightParameter(i,0).yzw;
  vec3 lpos = getLightParameter(i,1).xyz;
  vec2 param = getLightParameter(i,2).xy;
    float l=distance(lpos,position);//calc distance between light and fragment in view space
    vec3 p2l=normalize(lpos-position);//calc direction vector from fragment to light in view space
    accum+=max(dot(normal,p2l),0.)*pow(max(0.,1.-l/param.x),param.y)*color;
  return accum;
}
