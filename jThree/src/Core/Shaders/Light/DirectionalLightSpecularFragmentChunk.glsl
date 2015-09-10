vec3 calcDirectionalLight(vec3 position,vec3 normal,int i,vec3 specular,float specularCoefficient)
{
  vec3 l = normalize((vec4(-getLightParameter(i,1).xyz,0)).xyz);
  vec3 e = normalize(-position);
  return getLightParameter(i,0).yzw*specular*pow(dot(normal,normalize(l+e)),specularCoefficient);
}
