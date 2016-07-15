import glFactory from 'gl';
const gl = glFactory(1,1);

const vsCodeMain = 'void main(void){gl_Position = vec4(1,0,0,1);}';
const fsCodeMain = 'void main(void){gl_FragColor = vec4(1,0,0,1);}'
const fsCodeHeader = 'precision mediump float;';
function compilableWithVertexMain(vsCode){
  const vs = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vs,vsCode + vsCodeMain);
  gl.compileShader(vs);
  if(!gl.getShaderParameter(vs,gl.COMPILE_STATUS)){
    console.error(gl.getShaderInfoLog(vs));
    gl.deleteShader(vs);
    return false;
  }else{
    return true;
  }
}


function compilableWithFragmentMain(fsCode){
  const fs = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fs,fsCodeHeader + fsCode + fsCodeMain);
  gl.compileShader(fs);
  if(!gl.getShaderParameter(fs,gl.COMPILE_STATUS)){
    console.error(gl.getShaderInfoLog(fs));
    gl.deleteShader(fs);
    return false;
  }else{
    return true;
  }
}

function compilableWithMain(code){
  return compilableWithVertexMain(code) && compilableWithFragmentMain(code);
}


export default compilableWithMain;
