vec3 calcDirectionalLight(vec3 position,vec3 normal,int i,vec4 diffuse)
{
  vec3 accum=vec3(0,0,0);
  vec3 color = getLightParameter(i,0).yzw*diffuse.rgb*diffuse.a;
  vec3 dir = (vec4(getLightParameter(i,1).xyz,0)).xyz;
  vec3 shadowParam= getLightParameter(i,2).xyz;
  accum += max(0.,-dot(dir,normal)) * color *diffuse.rgb;
  // vec4 shadowMapCoord = matLWs[int(shadowParam.y)] *matIV * vec4(position,1.0);//Works fine here
  // vec3 lightSpaceRawDepthShadowMap = texture2DProj(shadowMaps[int(shadowParam.y)],matTT*shadowMapCoord).rgb;
  // float lightSpaceDepth = unpackFloat(lightSpaceRawDepthShadowMap);
  //  if(shadowParam.x > 0. && lightSpaceDepth+shadowParam.z < shadowMapCoord.z/shadowMapCoord.w)accum = vec3(0,0,0);
  return accum;
}
