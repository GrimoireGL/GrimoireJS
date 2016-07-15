import fs from 'fs';
import glFactory from 'gl';
class GLSLUnit {
  static loadFile(src){
    return new Promise((resolve,reject)=>{
      fs.readFile(src,'utf8',(err,res)=>{
        if(err){
          reject(err);
        }else{
          resolve(res);
        }
      });
    });
  }

  static initialize(){
    if(!GLSLUnit.gl){
      const gl = GLSLUnit.gl = glFactory(1,1);
      GLSLUnit.initBuffer();
      GLSLUnit.resultFBO = gl.createFramebuffer();
      GLSLUnit.confirmFBO = gl.createFramebuffer();
      GLSLUnit.resultTexture = gl.createTexture();
      GLSLUnit.initTexture(GLSLUnit.resultTexture);
      GLSLUnit.confirmTexture = gl.createTexture();
      GLSLUnit.initTexture(GLSLUnit.confirmTexture);
      const vs = GLSLUnit.createShader("attribute vec4 position;void main(){gl_Position = position;}",gl.VERTEX_SHADER);
      const fs = GLSLUnit.createShader("precision mediump float;void main(){gl_FragColor = vec4(0,1,0,1);}",gl.FRAGMENT_SHADER);
      const pg = GLSLUnit.createProgram(vs,fs);
      gl.useProgram();
      gl.draw();
      console.log(pg);
    }
  }

  static createShader(src,type){
    const gl = GLSLUnit.gl;
    const shader = gl.createShader(type);
    gl.shaderSource(shader,src);
    gl.compileShader(shader);
    if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS)){
      console.error(gl.getShaderInfoLog(shader));
    }
    return shader;
  }

  static createProgram(vs,fs){
    const gl = GLSLUnit.gl;
    const program = gl.createProgram();
    gl.attachShader(program,vs);
    gl.attachShader(program,fs);
    gl.linkProgram(program);
    return program;
  }

  static initTexture(tex){
    const gl = GLSLUnit.gl;
    gl.bindTexture(gl.TEXTURE_2D,tex);
    gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,1,1,0,gl.RGBA,gl.UNSIGNED_BYTE,new Uint8Array([1,0,0,0]));
  }

  static initBuffer(){
    const gl = GLSLUnit.gl;
    const buf = gl.createBuffer(gl.ARRAY_BUFFER);
    gl.bindBuffer(gl.ARRAY_BUFFER,buf);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([0,2,0,2,-1,0,-2,-1,0]));
  }

  static readResultTexture(){
    const gl = GLSLUnit.gl;
    const buffer = new Uint8Array([0,0,0,0]);
    gl.bindTexture(gl.TEXTURE_2D,GLSLUnit.resultTexture);
    gl.bindFramebuffer(gl.FRAMEBUFFER,GLSLUnit.resultFBO);
    gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,GLSLUnit.resultTexture,0);
    gl.readPixels(0,0,1,1,gl.RGBA,gl.UNSIGNED_BYTE,buffer);
    let sqrdNorm = 0;
    for(let i = 0; i < buffer.length; i++){
      sqrdNorm += buffer[i] * buffer[i];
    }
    return sqrdNorm === 0;
  }

  static draw(){
    const gl = GLSLUnit.gl;
    gl.drawArrays(gl.TRIANGLES,0,3);
  }
}
GLSLUnit.initialize();

export default GLSLUnit;
