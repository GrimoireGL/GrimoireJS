// builtin.gbuffer-reader
@import "builtin.packing"
@import "builtin.gbuffer-packing"

// Get depth from texture
float getDepth(vec4 rawBuffer)
{
  return rawBuffer.z;
}
// Get normal from texture
vec3 getNormal(vec4 rawBuffer)
{
  highp vec2 cNor = vec2(unpackRanged16(rawBuffer.xy,CNOR_MIN,CNOR_MAX),unpackRanged16(rawBuffer.zw,CNOR_MIN,CNOR_MAX));
  highp vec2 compressed = cNor * 4. - vec2(2.,2.);
  highp vec3 result;
  highp float f = dot(compressed,compressed);
  highp float g = sqrt(1. - f/4.);
  result.z = 1. - f/2.;
  result.xy = compressed * g;
  return normalize(result);
}

// Reconstruct position
highp vec3 getPosition(highp float depth,vec4 projectedLightPoint,mat4 invProj)
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

float lambert(vec3 normal,vec3 p2l){
  return max(0.0,dot(normal,p2l)) / 3.1415;
}

float halfLambert(vec3 normal,vec3 p2l){
  float val = max( dot( normal, p2l ), 0.0 ) * 0.5 + 0.5;
  return val * val * ( 3.0 / ( 4.0 * 3.1415 ) );
}
