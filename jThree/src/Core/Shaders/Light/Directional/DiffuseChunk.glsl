vec3 calcDirectionalLight(vec3 position,vec3 normal,int i,vec4 diffuse)
{
  vec3 accum=vec3(0,0,0);
  vec3 color = getLightParameter(i,0).yzw*diffuse.rgb*diffuse.a;
  vec3 dir = (vec4(getLightParameter(i,1).xyz,0)).xyz;
  vec3 shadowParamVec= getLightParameter(i,2).xyz;
  accum += max(0.,-dot(dir,normal)) * color *diffuse.rgb;
  vec4 shadowMapCoord = getShadowMatrix(shadowParamVec.y,0.) * matIV * vec4(position,1.0);
  vec4 shadowMapTextureCoord = getShadowMatrix(shadowParamVec.y,2.)*shadowMapCoord;
  if(!isInTextureUVRange(shadowMapTextureCoord.xy/shadowMapTextureCoord.w))return accum;
  vec3 lightSpaceRawDepthShadowMap = texture2DProj(shadowMap,shadowMapTextureCoord).rgb;
  highp float lightSpaceDepth = unpackFloat(lightSpaceRawDepthShadowMap);
  if(lightSpaceDepth+shadowParamVec.z < shadowMapCoord.z/shadowMapCoord.w)return vec3(0,0,0);
  return accum;
}
