import GLContextWrapperBase = require("./GLContextWrapperBase");
import BufferTargetType = require("./BufferTargetType");
import ShaderType = require("./ShaderType");
import ClearTargetType = require("./ClearTargetType");
import PrimitiveTopology = require("./PrimitiveTopology");
import ElementType = require("./ElementType");
import GLFeatureType = require("./GLFeatureType");
import Matrix = require("../Math/Matrix");
import Vector2 = require("../Math/Vector2");
import Vector3 = require("../Math/Vector3");
import Vector4 = require("../Math/Vector4");
import GLCullMode = require("./GLCullMode");
import TargetTextureType = require('./TargetTextureType');
import FrameBufferAttachmentType = require('./FrameBufferAttachmentType');
import TextureInternalFormatType = require('./TextureInternalFormatType');
import TextureType = require('./TextureType');
import TextureParameterType = require('./Texture/TextureParameterType');
import TextureMinType = require('./Texture/TextureMinFilterType');
import TextureMagType = require('./Texture/TextureMagFilterType');
import TextureWrapType = require('./Texture/TextureWrapType');
import TextureRegister = require('./Texture/TextureRegister');
import RenderBufferInternalFormats = require('./RBO/RBOInternalFormat');
class WebGLContextWrapper extends GLContextWrapperBase {
  private gl: WebGLRenderingContext;


  constructor(gl: WebGLRenderingContext) {
    super();
    this.gl = gl;
  }

  CheckErrorAsFatal(): void {
    var ec = this.gl.getError();
    if (ec !== WebGLRenderingContext.NO_ERROR) {
      console.error(`WebGL error was occured:${ec}`);
    }
  }

  CreateBuffer(): WebGLBuffer {
    this.CheckErrorAsFatal();
    return this.gl.createBuffer();
  }

  BindBuffer(target: BufferTargetType, buffer: WebGLBuffer): void {
    this.CheckErrorAsFatal();
    this.gl.bindBuffer(target, buffer);
  }

  UnbindBuffer(target: BufferTargetType): void {
    this.CheckErrorAsFatal();
    this.gl.bindBuffer(target, null);
  }

  DeleteBuffer(target: WebGLBuffer): void {
    this.CheckErrorAsFatal();
    this.gl.deleteBuffer(target);
  }

  BufferData(target: BufferTargetType, array: ArrayBuffer, usage: number): void {
    this.CheckErrorAsFatal();
    this.gl.bufferData(target, array, usage);
  }

  ClearColor(red: number, green: number, blue: number, alpha: number): void {
    this.CheckErrorAsFatal();
    this.gl.clearColor(red, green, blue, alpha);
  }

  Clear(mask: ClearTargetType): void {
    this.CheckErrorAsFatal();
    this.gl.clear(mask);
  }

  CreateShader(flag: ShaderType): WebGLShader {
    this.CheckErrorAsFatal();
    return this.gl.createShader(flag);
  }

  DeleteShader(shader: WebGLShader): void {
    this.CheckErrorAsFatal();
    this.gl.deleteShader(shader);
  }

  ShaderSource(shader: WebGLShader, src: string): void {
    this.CheckErrorAsFatal();
    this.gl.shaderSource(shader, src);
  }

  CompileShader(shader: WebGLShader): void {
    this.CheckErrorAsFatal();
    this.gl.compileShader(shader);
    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      //TODO 適切なエラー処理
      alert(this.gl.getShaderInfoLog(shader));
    } else {
      console.log("compile success");
    }
  }

  CreateProgram(): WebGLProgram {
    this.CheckErrorAsFatal();
    return this.gl.createProgram();
  }

  AttachShader(program: WebGLProgram, shader: WebGLShader): void {
    this.CheckErrorAsFatal();
    this.gl.attachShader(program, shader);
  }

  LinkProgram(program: WebGLProgram): void {
    this.CheckErrorAsFatal();
    this.gl.linkProgram(program);
    if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
      alert(this.gl.getProgramInfoLog(program));
    } else {
      console.log("link success");
    }
  }

  UseProgram(program: WebGLProgram): void {
    this.CheckErrorAsFatal();
    this.gl.useProgram(program);
  }

  GetAttribLocation(program: WebGLProgram, name: string): number {
    this.CheckErrorAsFatal();
    return this.gl.getAttribLocation(program, name);
  }

  EnableVertexAttribArray(attribNumber: number): void {
    this.CheckErrorAsFatal();
    this.gl.enableVertexAttribArray(attribNumber);
  }

  VertexAttribPointer(attribLocation: number, sizePerVertex: number, elemType: ElementType, normalized: boolean, stride: number, offset: number): void {
    this.CheckErrorAsFatal();
    this.gl.vertexAttribPointer(attribLocation, sizePerVertex, elemType, normalized, stride, offset);
  }

  DrawArrays(drawType: PrimitiveTopology, offset: number, length: number): void {
    this.CheckErrorAsFatal();
    this.gl.drawArrays(drawType, offset, length);
  }

  Flush(): void {
    this.CheckErrorAsFatal();
    this.gl.flush();
  }

  Finish(): void {
    this
      .CheckErrorAsFatal();
    this.gl.finish();
  }

  DeleteProgram(target: WebGLProgram): void {
    this.CheckErrorAsFatal();
    this.gl.deleteProgram(target);
  }

  GetUniformLocation(target: WebGLProgram, name: string): WebGLUniformLocation {
    this.CheckErrorAsFatal();
    return this.gl.getUniformLocation(target, name);
  }

  UniformMatrix(webGlUniformLocation: WebGLUniformLocation, matrix: Matrix) {
    this.CheckErrorAsFatal();
    this.gl.uniformMatrix4fv(webGlUniformLocation, false, matrix.rawElements);
  }

  /**
  * Pass vector as uniform variable
  * @param webGlUniformLocation uniform variable location
  * @param vector vector you want to pass
  */
  UniformVector2(webGlUniformLocation: WebGLUniformLocation, vector: Vector2) {
    this.CheckErrorAsFatal();
    this.gl.uniform2f(webGlUniformLocation, vector.X, vector.Y);
  }

  /**
  * Pass vector as uniform variable
  * @param webGlUniformLocation uniform variable location
  * @param vector vector you want to pass
  */
  UniformVector3(webGlUniformLocation: WebGLUniformLocation, vector: Vector3) {
    this.CheckErrorAsFatal();
    this.gl.uniform3f(webGlUniformLocation, vector.X, vector.Y, vector.Z);
  }

  Uniform1i(webGlUniformLocation: WebGLUniformLocation, num: number): void {
    this.CheckErrorAsFatal();
    this.gl.uniform1i(webGlUniformLocation, num);
  }

  Enable(feature: GLFeatureType): void {
    this.CheckErrorAsFatal();
    this.gl.enable(feature);
  }

  Disable(feature: GLFeatureType): void {
    this.CheckErrorAsFatal();
    this.gl.disable(feature);
  }

  CullFace(cullMode: GLCullMode): void {
    this.CheckErrorAsFatal();
    this.gl.cullFace(cullMode);
  }
  /**
  * Pass vector as uniform variable
  * @param webGlUniformLocation uniform variable location
  * @param vector vector you want to pass
  */
  UniformVector4(webGlUniformLocation: WebGLUniformLocation, vector: Vector4) {
    this.CheckErrorAsFatal();
    this.gl.uniform4f(webGlUniformLocation, vector.X, vector.Y, vector.Z, vector.W);
  }

  ViewPort(x: number, y: number, width: number, height: number): void {
    this.CheckErrorAsFatal();
    this.gl.viewport(x, y, width, height);
  }

  DrawElements(topology: PrimitiveTopology, length: number, dataType: ElementType, offset: number): void {
    this.CheckErrorAsFatal();
    this.gl.drawElements(topology, length, dataType, offset);
  }

  CreateFrameBuffer(): WebGLFramebuffer {
    this.CheckErrorAsFatal();
    return this.gl.createFramebuffer();
  }

  BindFrameBuffer(fbo: WebGLFramebuffer): void {
    this.CheckErrorAsFatal();
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, fbo);
  }

  FrameBufferTexture2D(fboTarget: FrameBufferAttachmentType, tex: WebGLTexture): void {
    this.CheckErrorAsFatal();
    this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, fboTarget,this.gl.TEXTURE_2D, tex, 0);
        console.warn(this.gl.checkFramebufferStatus(this.gl.FRAMEBUFFER));
  }
  CreateTexture(): WebGLTexture {
    this.CheckErrorAsFatal();
    return this.gl.createTexture();
  }

  TexImage2D(targetTexture: TargetTextureType, level: number, internalFormat: TextureInternalFormatType, targetFormat: TextureInternalFormatType, type: TextureType, pixels: HTMLCanvasElement|HTMLImageElement|ImageData|ArrayBufferView): void {
    this.CheckErrorAsFatal();
    this.gl.texImage2D(targetTexture, level, internalFormat, targetFormat, type, <ImageData>pixels);
  }


  BindTexture(targetTexture: TargetTextureType, texture: WebGLTexture): void {
    this.CheckErrorAsFatal();
    this.gl.bindTexture(targetTexture, texture);
  }

  GenerateMipmap(targetTexture: TargetTextureType): void {
    this.CheckErrorAsFatal();
    this.gl.generateMipmap(targetTexture);
  }

  TexParameteri(targetTexture: TargetTextureType, param: TextureParameterType, value: TextureMagType|TextureMinType|TextureWrapType): void {
    this.CheckErrorAsFatal();
    this.gl.texParameteri(targetTexture, param, value);
  }

  ActiveTexture(textureRegister: TextureRegister) {
    this.CheckErrorAsFatal();
    this.gl.activeTexture(textureRegister);
  }


  CreateRenderBuffer(): WebGLRenderbuffer {
    this.CheckErrorAsFatal();
    return this.gl.createFramebuffer();
  }

  BindRenderBuffer(bindTarget: WebGLRenderbuffer): void {
    this.CheckErrorAsFatal();
    this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, bindTarget);
  }

  RenderBufferStorage(internalFormat: RenderBufferInternalFormats, width: number, height: number): void {
    this.CheckErrorAsFatal();
    this.gl.renderbufferStorage(this.gl.RENDERBUFFER, internalFormat, width, height);
  }

  FrameBufferRenderBuffer(attachment: FrameBufferAttachmentType, buffer: WebGLRenderbuffer) {
    this.CheckErrorAsFatal();
    this.gl.framebufferRenderbuffer(this.gl.FRAMEBUFFER, attachment, this.gl.RENDERBUFFER, buffer)
    console.warn(this.gl.checkFramebufferStatus(this.gl.FRAMEBUFFER));
  }
}
export =WebGLContextWrapper;
