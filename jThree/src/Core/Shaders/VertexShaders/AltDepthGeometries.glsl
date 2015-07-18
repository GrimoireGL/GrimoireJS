precision mediump float;
attribute vec3 position;

uniform mat4 matMVP;

varying vec4 v_pos;

void main(void){
	v_pos=gl_Position =matMVP*vec4(position,1.0);
}
