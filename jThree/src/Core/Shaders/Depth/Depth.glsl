precision mediump float;
uniform mat4 matMVP;
varying vec4 v_pos;
void main()
{
   gl_FragColor.r=v_pos.z/v_pos.w;
   gl_FragColor.a=1.;
}
