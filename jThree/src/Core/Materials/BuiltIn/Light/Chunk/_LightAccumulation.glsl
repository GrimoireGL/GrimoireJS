// jthree.builtin.light.bufferreader
// Get depth from texture
float getDepth(vec4 rawBuffer)
{
  return rawBuffer.z;
}
// Get normal from texture
vec3 getNormal(vec4 rawBuffer)
{
  highp vec2 compressed = rawBuffer.xy * 4. - vec2(2.,2.);
  highp vec3 result;
  float f = dot(compressed,compressed);
  float g = sqrt(1. - f/4.);
  result.z = 1. - f/2.;
  result.xy = compressed * g;
  return normalize(result);
}

// Reconstruct position
vec3 getPosition(float depth,vec4 projectedLightPoint,mat4 invProj)
{
  vec4 reconstructed = invProj*vec4(projectedLightPoint.xy/projectedLightPoint.w,depth,1.);
  return reconstructed.xyz / reconstructed.w;
}

vec2 calcBufferPosition(vec4 projectedLightPoint)
{
  return ((projectedLightPoint.xy/projectedLightPoint.w) + vec2(1.0,1.0)) * 0.5;
}

vec4 readRawBuffer(sampler2D rawBuffer,vec4 projectedLightPoint)
{
  return texture2D(rawBuffer,calcBufferPosition(projectedLightPoint));
}
