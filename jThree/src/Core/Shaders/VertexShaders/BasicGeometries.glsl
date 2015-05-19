precision mediump float;
attribute vec3 position;
attribute vec3 normal;
uniform mat4 matMVP;

varying vec3 v_normal;

void main(void){
gl_Position = matMVP*vec4(position,1.0);
v_normal=(matMVP*vec4(normal,0)).xyz;
}
