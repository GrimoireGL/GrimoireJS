precision mediump float;
varying  vec2 v_uv;

uniform mediump sampler2D rb1;
uniform mediump sampler2D rb2;
uniform mediump sampler2D depth;
uniform mediump sampler2D u_ldepth;
uniform vec3 c_pos;
uniform vec3 c_dir;
uniform float c_near;
uniform float c_far;
uniform float xtest;
uniform float ztest;
uniform float coef;

$Directional_Head

$Point_Head

uniform mat4 matIP;
uniform mat4 matTV;
uniform mat4 matLV;
uniform vec3 posL;
uniform float time;

vec3 calcPointLight(vec3 position,vec3 normal)
{
 vec3 accum=vec3(0,0,0);
  for(int index=0;index<5;index++)//TODO fix this code for N s lights
  {
    if(index>=pl_count)break;
   float l=length(pl_pos[index]-position.xyz);
   vec3 p2l=normalize(pl_pos[index]-position);
   if(dot(p2l,normal)<=0.)accum+= vec3(0,0,0);
  else
   {
      if(l<=pl_coef[index].y)
      {
      l=max(0.,dot(p2l,normal));
      float brightness=pow(1.-l/pl_coef[index].y,pl_coef[index].x);
      accum+= pl_col[index].rgb*brightness;
      }
   }

   }
   return accum;
}

vec3 calcDirectionalLight(vec3 position,vec3 normal)
{
   vec3 accum=vec3(0,0,0);
   for(int index=0;index<5;index++)
   {
     if(index>=dl_count)break;
     float brightness=dot(dl_dir[index],normal);
     float pDepth=distance(position,posL);
     vec2 lUv=(matLV*matTV*vec4(position,1.)).xy;
     float lDepth=texture2D(u_ldepth,lUv).z*5.656;
     if(pDepth>lDepth){
     return vec3(0,0,0); 
      accum+=dl_col[index].rgb*max(0.,brightness);
      }
     else
      accum+=vec3(0,1,0);
   }
   return accum;
}

vec3 reconstructPosition(float d)
{
  float z = c_far*c_near/(-c_far+d*(c_far-c_near));
  vec2 uv=vec2(v_uv.x,1.-v_uv.y);
  vec3 posClip=vec3(2.0*uv+vec2(-1,-1),d*2.-1.);
  vec4 position=matIP*vec4(posClip,z);
  position.x*=position.z;
  position.y*=-position.z;
  position.z=z;
  return position.xyz;
}

vec3 reconstructNormal()
{
  return (texture2D(rb1,v_uv).xyz-vec3(0.5,0.5,0.5))*2.0;
}

void main(void){
  float d=texture2D(depth,v_uv).r;
  if(d==1.)// if the depth was same with farclip distance,it will not be count
  {
      gl_FragColor=vec4(0,0,0,0);
      return;
  }
  gl_FragColor.rgb=vec3(0,0,0);
  vec3 position=reconstructPosition(d);
  vec3 normal=reconstructNormal();
  gl_FragColor.rgb+=calcPointLight(position.xyz,normal);
  gl_FragColor.rgb+=calcDirectionalLight(position.xyz,normal);
  gl_FragColor.a=1.0;
}
