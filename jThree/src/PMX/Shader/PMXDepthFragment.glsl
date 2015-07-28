precision mediump float;
varying vec4 v_pos;
void main()
{
   float depth=v_pos.z/v_pos.w;
   vec4 baseCalc=vec4(255.*depth,255.*255.*depth,255.*255.*255.*depth,255.*255.*255.*255.*depth);
   baseCalc=fract(baseCalc);
   vec4 result=vec4(0,0,0,0);
   result.r=depth-baseCalc.r;
   result.g=depth-result.r-baseCalc.g;
   result.b=depth-result.r-result.g-baseCalc.b;
   result.a=depth-result.r-result.g-result.b-baseCalc.a;
   gl_FragColor=result;
}