//Fetch bone transform matrix from specified texture and index.
mat4 boneMatrixFromTexture(sampler2D boneMatTexture,float boneCount,float index)
{
  float y =index / boneCount+1./boneCount/2.;
  return mat4(
  texture2D(boneMatTexture,vec2(0.125,y)),
  texture2D(boneMatTexture,vec2(0.375,y)),
  texture2D(boneMatTexture,vec2(0.625,y)),
  texture2D(boneMatTexture,vec2(0.875,y)));
}
//Compute transform matrix from specified bone skinning configuration
mat4 calcBoneTransform(sampler2D boneMatTexture,float boneCount,vec4 boneWeights,vec4 boneIndicies)
{
  return boneWeights.x*boneMatrixFromTexture(boneMatTexture,boneCount,boneIndicies.x)
        +boneWeights.y*boneMatrixFromTexture(boneMatTexture,boneCount,boneIndicies.y)
        +boneWeights.z*boneMatrixFromTexture(boneMatTexture,boneCount,boneIndicies.z)
        +boneWeights.w*boneMatrixFromTexture(boneMatTexture,boneCount,boneIndicies.w);
}
//Compute skinned position
vec4 calcPosition(mat4 boneTransform,mat4 matPV,vec3 position)
{
  return matPV * boneTransform * vec4(position,1.0);
}
//Compute skinned normal
vec3 calcNormal(mat4 boneTransform,mat4 matV,vec3 normal)
{
  return normalize((matV*boneTransform*vec4(normal,0)).xyz);
}
//Compute skinned spherical normal
vec2 calcSphereUV(vec3 viewSpaceNormal)
{
  return viewSpaceNormal.xy/2.+vec2(0.5,0.5);
}


void main(void)
{
  gl_FragColor = vec4(1,0,0,1);
}
