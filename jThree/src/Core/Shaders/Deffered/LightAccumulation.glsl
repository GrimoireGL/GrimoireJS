precision mediump float;
varying  vec2 v_uv;

uniform mediump sampler2D rb1;
uniform mediump sampler2D rb2;
uniform mediump sampler2D depth;
uniform mediump sampler2D u_ldepth;
uniform vec3 c_pos;
uniform vec3 c_dir;
uniform float xtest;
uniform float ytest;
uniform float ztest;
uniform float coef;

#define DIRECTIONAL_LIGHT_MAX 5
uniform vec3 dl_dir[DIRECTIONAL_LIGHT_MAX];
uniform vec4 dl_col[DIRECTIONAL_LIGHT_MAX];
uniform int dl_count;

#define POINT_LIGHT_MAX 5
uniform vec3 pl_pos[POINT_LIGHT_MAX];
uniform vec4 pl_col[POINT_LIGHT_MAX];
uniform vec2 pl_coef[POINT_LIGHT_MAX];//(decay,distance)
uniform int pl_count;

uniform mat4 matIP;
uniform mat4 matTV;
uniform mat4 matLV;
uniform vec3 posL;
uniform float time;

float decomposeDepth(vec2 uv)
{
  vec4 dTex=texture2D(depth,uv);
  if(all(equal(dTex,vec4(0,0,0,0))))discard;
  const float rMask = 1.0;
    const float gMask = 1.0 / 255.0;
    const float bMask = 1.0 / (255.0 * 255.0);
    const float aMask = 1.0 / (255.0 * 255.0 * 255.0);
    float depth = dot(dTex, vec4(rMask, gMask, bMask, aMask));
    depth=(depth*2.0)-1.0;
    return depth;
}

vec3 calcPointLight(vec3 position,vec3 normal)
{
  vec3 accum=vec3(0,0,0);
  for(int index=0;index<5;index++)//TODO fix this code for N s lights
  {
    if(index>=pl_count)break;
    float l=distance(pl_pos[index],position);
    vec3 p2l=normalize(pl_pos[index]-position);
    accum+=dot(p2l,normal)*pow(max(0.,1.-l/pl_coef[index].y),pl_coef[index].x)*pl_col[index].rgb;
  }
  return accum;
}

vec3 calcDirectionalLight(vec3 position,vec3 normal)
{
   vec3 accum=vec3(0,0,0);
   for(int index=0;index<5;index++)
   {
     if(index>=dl_count)break;
     float pDepth=distance(position,posL);
     vec4 pL=(matLV*matTV*vec4(position,1.));
     pL.xyz/=pL.w;
     pL.xyz+=vec3(1,1,1);
     pL.xyz/=2.;
     pL.z*=5.656;
     float lD=texture2D(u_ldepth,pL.xy).x*5.656;
     if(pL.z>lD+0.005){
        continue;
     }
     else{
      float brightness=max(0.,dot(dl_dir[index],normal));
      accum+=dl_col[index].rgb*brightness;
     }
   }
   return accum;
}

vec3 reconstructPosition(float d)
{
  vec4 reconstructed=matIP*vec4(v_uv*2.-1.,d,1.);
  return reconstructed.xyz/reconstructed.w;
}

vec3 reconstructNormal()
{
  vec4 composed=texture2D(rb1,v_uv);
  vec2 decomposed = vec2(dot(composed.xy,vec2(1.0,1.0/255.0)),dot(composed.zw,vec2(1.0,1.0/255.0)));
  vec3 result;
  result.z=length(decomposed)*2.-1.;
  result.xy=normalize(decomposed)*sqrt(1.-result.z*result.z);
  return result;
}

bool inRegion(float dp,float p)
{
  return abs(dp-p)<0.1;
}

vec3 calcDebugLine(vec3 baseColor,vec3 position)
{
  bool isInRegion=false;
  vec3 result=vec3(0,0,0);
  if(abs(position.x-xtest/10.)<0.01)
  {
    result+=vec3(1,0,0);
    isInRegion=true;
  }
  if(abs(position.y-ytest/10.)<0.01)
  {
    result+=vec3(0,1,0);
    isInRegion=true;
  }
  if(abs(position.z-ztest/10.)<0.01)
  {
    result+=vec3(0,0,1);
    isInRegion=true;
  }
  if(!isInRegion)return baseColor;
  return result;
}

void main(void){
  float d=decomposeDepth(v_uv);
  gl_FragColor.rgba=vec4(0,0,0,1);
  vec3 position=reconstructPosition(d);
  vec3 normal=reconstructNormal();
  gl_FragColor.rgb+=calcPointLight(position,normal);
  //gl_FragColor.rgb+=calcDirectionalLight(position,normal);
  //gl_FragColor.rgb=calcDebugLine(gl_FragColor.rgb,position);
}
