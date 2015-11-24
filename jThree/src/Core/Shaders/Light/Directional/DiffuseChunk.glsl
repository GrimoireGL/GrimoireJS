vec3 calcDirectionalLight(vec3 position,vec3 normal,int i,vec4 diffuse)
{
  vec3 accum=vec3(0,0,0);
  vec3 color = getLightParameter(i,0).yzw;
  vec3 dir = getLightParameter(i,1).xyz;
  vec3 shadowParamVec= getLightParameter(i,2).xyz;//x:shadow flag,y:shadow map index,z:shadow bias
  accum += max(0.,min(1.,dot(-dir,normal))) * color;
  if(shadowParamVec.x < 0.5)return accum;
   vec4 shadowMapCoord = getShadowMatrix(shadowParamVec.y,0.) * matIV * vec4(position,1.0);
   vec4 shadowMapTextureCoord = getShadowMatrix(shadowParamVec.y,2.)*shadowMapCoord;
   if(!isInTextureUVRange(shadowMapTextureCoord.xy/shadowMapTextureCoord.w))return accum;
   vec3 lightSpaceRawDepthShadowMap = texture2DProj(shadowMap,shadowMapTextureCoord).rgb;
   highp float lightSpaceDepth = unpackFloat(lightSpaceRawDepthShadowMap);
   if(lightSpaceDepth+shadowParamVec.z > shadowMapCoord.z/shadowMapCoord.w)return vec3(0,0,0);
   return accum;
}
