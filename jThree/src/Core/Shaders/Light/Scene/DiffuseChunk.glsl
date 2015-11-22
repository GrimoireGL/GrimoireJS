vec3 calcSceneLight(vec3 position,vec3 normal,int i,vec4 diffuse)
{
  return getLightParameter(i,0).yzw*diffuse.rgb*diffuse.a;
}
