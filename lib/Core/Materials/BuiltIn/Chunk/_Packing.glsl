vec4 packUNorm32(const highp float value)
{
  const vec4 bitSh = vec4(256.0*256.0*256.0, 256.0*256.0, 256.0, 1.0);
  const vec4 bitMsk = vec4(0.0, 1.0/256.0, 1.0/256.0, 1.0/256.0);
  vec4 res = fract(value * bitSh);
  res -= res.xxyz * bitMsk;
  return res;
}

vec4 packRanged32(const highp float value,const highp float minimum,const highp float maximum)
{
  return packUNorm32((value-minimum)/(maximum - minimum));
}

highp float unpackUNorm32(const vec4 value)
{
  const vec4 bitSh = vec4(1.0/(256.0*256.0*256.0), 1.0/(256.0*256.0), 1.0/256.0, 1.0);
  return(dot(value, bitSh));
}

highp float unpackRanged32(const vec4 value,const highp float minimum,const highp float maximum)
{
  return unpackUNorm32(value) * (maximum - minimum) + minimum;
}

vec3 packUNorm24(const highp float value){
  const vec3 bitSh = vec3(256.0*256.0, 256.0, 1.0);
  const vec3 bitMsk = vec3(0.0, 1.0/256.0, 1.0/256.0);
  highp vec3 res = fract(value * bitSh);
  res -= res.xxy * bitMsk;
  return res;
}

vec3 packRanged24(const highp float value,const highp float minimum,const highp float maximum){
  return packUNorm24((value - minimum)/(maximum - minimum));
}

highp float unpackUNorm24(const vec3 value)
{
  const vec3 bitSh = vec3(1.0/(256.0*256.0), 1.0/256.0, 1.0);
  return(dot(value, bitSh));
}

highp float unpackRanged24(const vec3 value,const highp float minimum,const highp float maximum){
  return unpackUNorm24(value) * (maximum - minimum) + minimum;
}

vec2 packUNorm16(const highp float value){
  const highp vec2 bitSh = vec2(256.0, 1.0);
  const highp vec2 bitMsk = vec2(0.0, 1.0/256.0);
  vec2 res = fract(value * bitSh);
  res -= res.xx * bitMsk;
  return res;
}

vec2 packRanged16(const highp float value,const highp float minimum,const highp float maximum){
  return packUNorm16((value - minimum)/(maximum - minimum));
}

highp float unpackUNorm16(const highp vec2 value)
{
  const highp vec2 bitSh = vec2(1.0/256.0, 1.0);
  return(dot(value, bitSh));
}

highp float unpackRanged16(const vec2 value,const highp float minimum,const highp float maximum){
  return unpackUNorm16(value) * (maximum - minimum) + minimum;
}
