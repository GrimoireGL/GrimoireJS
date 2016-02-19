vec4 packUNorm32(const highp float value)
{
  const highp vec4 bitSh = vec4(256.0*256.0*256.0, 256.0*256.0, 256.0, 1.0);
  const highp vec4 bitMsk = vec4(0.0, 1.0/256.0, 1.0/256.0, 1.0/256.0);
  vec4 res = fract(value * bitSh);
  res -= res.xxyz * bitMsk;
  return res;
}

highp float unpackUNorm32(const highp vec4 value)
{
  const highp vec4 bitSh = vec4(1.0/(256.0*256.0*256.0), 1.0/(256.0*256.0), 1.0/256.0, 1.0);
  return(dot(value, bitSh));
}

vec3 packUNorm24(const highp float value){
  const highp vec3 bitSh = vec3(256.0*256.0, 256.0, 1.0);
  const highp vec3 bitMsk = vec3(0.0, 1.0/256.0, 1.0/256.0);
  vec3 res = fract(value * bitSh);
  res -= res.xxy * bitMsk;
  return res;
}

float unpackUNorm24(const highp vec3 value)
{
  const highp vec3 bitSh = vec3(1.0/(256.0*256.0), 1.0/256.0, 1.0);
  return(dot(value, bitSh));
}

vec3 packUNorm16(const highp float value){
  const highp vec2 bitSh = vec2(256.0, 1.0);
  const highp vec2 bitMsk = vec2(0.0, 1.0/256.0);
  vec3 res = fract(value * bitSh);
  res -= res.xx * bitMsk;
  return res;
}

float unpackUNorm16(const highp vec2 value)
{
  const highp vec2 bitSh = vec2(1.0/256.0, 1.0);
  return(dot(value, bitSh));
}
