precision mediump float;
varying  vec2 v_uv;

uniform mediump sampler2D rb1;
uniform mediump sampler2D rb2;
uniform mediump sampler2D depth;
uniform mediump sampler2D u_ldepth;
uniform mediump sampler2D lightParams;
uniform vec2 lightParamSize;
uniform vec3 c_pos;
uniform vec3 c_dir;
uniform float coef;

uniform mat4 matIP;
uniform mat4 matTV;
uniform mat4 matLV;
uniform vec3 posL;

const vec4 byteMask=vec4(1.,1./255.,1./(255.*255.),1./(255.*255.*255.));

vec2 getParameterUV(int lightIndex,int parameterIndex)
{
   float xStep = 1./lightParamSize.x;
   float yStep = 1./lightParamSize.y;
   return vec2(xStep / 2. + float(parameterIndex) * xStep,1.-( yStep / 2. + float(lightIndex) * yStep));
}

vec4 getLightParameter(int lightIndex,int parameterIndex)
{
   return texture2D(lightParams,getParameterUV(lightIndex,parameterIndex));
}

float getLightType(int lightIndex)
{
	return getLightParameter(lightIndex,0).r;
}

float decomposeNDCDepth(vec2 uv)
{
  vec4 dTex=texture2D(depth,uv);
  if(all(equal(dTex,vec4(0,0,0,0))))discard;
    float depth = dot(dTex, byteMask);
    depth=(depth*2.0)-1.0;
    return depth;
}

vec3 reconstructPosition(float d)
{
  vec4 reconstructed=matIP*vec4(v_uv*2.-1.,d,1.);
  return reconstructed.xyz/reconstructed.w;
}

vec3 reconstructNormal()
{
  vec4 composed=texture2D(rb1,v_uv);
  vec2 decomposed = vec2(dot(composed.xy,byteMask.xy),dot(composed.zw,byteMask.xy));
  vec3 result;
  result.z=length(decomposed)*2.-1.;
  result.xy=normalize(decomposed)*sqrt(1.-result.z*result.z);
  return result;
}

///<<< LIGHT FUNCTION DEFINITIONS

void main(void){
  float d=decomposeNDCDepth(v_uv);
  vec3 position=reconstructPosition(d);
  vec3 normal=reconstructNormal();
  gl_FragColor.rgba=vec4(0,0,0,1);
  for(float i = 0.;i>-1.; i++)
  {
    if(lightParamSize.y == i)break;
	///<<< LIGHT FUNCTION CALLS
  }
}

