attribute vec3 position;
attribute vec2 uv;

varying vec2 v_uv;
varying vec3 v_position;

uniform mat4 matVP;

void main(void){
v_position = (vec4(position,1.0)*matVP).xyz;
gl_Position =vec4(position,1.0);
v_uv=uv;
}
