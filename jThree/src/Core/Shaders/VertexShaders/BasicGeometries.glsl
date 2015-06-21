precision mediump float;
attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;

uniform mat4 matMVP;
uniform mat4 matMV;


varying vec3 v_normal;
varying vec2 v_uv;
varying vec4 v_pos;

void main(void){
v_pos=gl_Position = matMVP*vec4(position,1.0);
v_normal=normalize((matMV*vec4(normal,0)).xyz);
v_uv=uv;
}
