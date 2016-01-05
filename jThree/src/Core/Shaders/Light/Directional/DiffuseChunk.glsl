vec3 calcDirectionalLight(vec3 position,vec3 normal,int i,vec4 diffuse)
{
  vec3 color = getLightParameter(i,0).yzw;
  vec3 dir = getLightParameter(i,1).xyz;
  highp vec3 shadowParamVec= getLightParameter(i,2).xyz;//x:shadow flag,y:shadow map index,z:shadow bias
  vec3 accum = max(0.,min(1.,dot(-dir,normal))) * color;
  if(shadowParamVec.x < 0.5)return accum; // check this light needs to project shadows
  vec4 wPosition = matIV * vec4(position,1.0);
   vec4 shadowMapCoord = getShadowMatrix(shadowParamVec.y,0.) * wPosition;
   highp vec4 shadowMapTextureCoord = getShadowMatrix(shadowParamVec.y,1.)*shadowMapCoord;
   if(!isInTextureUVRange(shadowMapTextureCoord.xy/shadowMapTextureCoord.w))return accum;//If this point was out of range in shadow map, this code will not care about shadow in this point
   vec3 lightSpaceRawDepthShadowMap = texture2DProj(shadowMap,shadowMapTextureCoord).rgb;
  highp float lightSpaceDepth = unpackFloat(lightSpaceRawDepthShadowMap);
  if(lightSpaceDepth < shadowMapCoord.z/shadowMapCoord.w - shadowParamVec.z)
  {
    return vec3(0,0,0);
  }else
  {
    return accum;
  }
}
