precision mediump float;
uniform mat4 matMVP;
varying vec4 v_pos;
void main()
{  const float c_far=1.0;
   const float c_near=0.0;
   float depth=gl_FragCoord.z;
   // vec4 baseCalc=vec4(255.*depth,255.*255.*depth,255.*255.*255.*depth,255.*255.*255.*255.*depth);
   // baseCalc=fract(baseCalc);
   vec4 result=vec4(v_pos.z,0,0,1);
   // result.r=depth-baseCalc.r;
   // result.g=depth-result.r-baseCalc.g;
   // result.b=depth-result.r-result.g-baseCalc.b;
   // result.a=depth-result.r-result.g-result.b-baseCalc.a;
//     vec4 ndcPos;
//  ndcPos.z = (2.0 * gl_FragCoord.z - c_near - c_far) /     (c_far - c_near);
// ndcPos.w = 1.0;
 
// vec4 clipPos = ndcPos * gl_FragCoord.w;
// result.z=(clipPos.z+1.0)/2.0;
   gl_FragColor=result;
  } 