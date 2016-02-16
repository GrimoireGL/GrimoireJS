const source =
`attribute vec3 position;

uniform mat4 _matPVM;

@(register:0,sampler:12)
uniform sampler2D testTexture;

uniform mediump sampler2D precTexture;

varying vec3 test;

@vert{
  void main(void)
  {
    gl_Position = vec4(position,1);
  }
}

@frag{
  void main(void)
  {
    gl_FragColor = vec4(1,0,0,1);
  }
}
`;

export default source;
