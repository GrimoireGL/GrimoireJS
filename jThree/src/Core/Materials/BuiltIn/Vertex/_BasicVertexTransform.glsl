struct BasicVertexTransformOutput
{
  vec4 position;
  vec3 normal;
  vec2 uv;
};

BasicVertexTransformOutput basicVertexTransform(vec3 position,vec3 normal,vec2 uv,mat4 mvp,mat4 mv){
  return BasicVertexTransformOutput(mvp*vec4(position,1.0),normalize((mv*vec4(normal,0)).xyz),uv);
}
