vec3 calcPointLight(vec3 position,vec3 normal,int i,vec3 specular,float specularCoefficient)
{
  vec3 accum=vec3(0,0,0);
  vec3 color = getLightParameter(i,0).yzw;
  vec3 lpos = getLightParameter(i,1).xyz;
  vec2 param = getLightParameter(i,2).xy;
  vec3 hv = normalize(normalize(lpos-position)+normalize(-position));
  float l = distance(position,lpos);
  accum += pow(max(0.,dot(hv,normal)),specularCoefficient)*pow(max(0.,1.-l/param.x),param.y)*color*specular;
  return accum;
}
