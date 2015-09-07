vec3 calcDirectionalLight(vec3 position,vec3 normal,int i)
{
  vec3 accum=vec3(0,0,0);
  vec4 diffuse = getDiffuseAlbedo();
  vec3 color = getLightParameter(i,0).yzw*diffuse.rgb*diffuse.a;
  vec3 dir = (vec4(getLightParameter(i,1).xyz,0)).xyz;
  accum += max(0.,-dot(dir,normal)) * color;
  return accum;
}