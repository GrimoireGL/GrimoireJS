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
import TargetTextureType = require("./TargetTextureType");
import FrameBufferAttachmentType = require("./FrameBufferAttachmentType");
import TextureInternalFormatType = require("./TextureInternalFormatType");
import TextureType = require("./TextureType");
import TextureParameterType = require("./Texture/TextureParameterType");
import TextureMinType = require("./Texture/TextureMinFilterType");
import TextureMagType = require("./Texture/TextureMagFilterType");
import TextureWrapType = require("./Texture/TextureWrapType");
import TextureRegister = require("./Texture/TextureRegister");
import RenderBufferInternalFormats = require("./RBO/RBOInternalFormat");
import PixelStoreParamType = require("./Texture/PixelStoreParamType");
import BlendEquationType = require("./BlendEquationType");
import BlendFuncParamType = require("./BlendFuncParamType");
 import DepthFuncType = require("./DepthFuncType");
 import GetParameterType = require("./GetParameterType");
 import TexImageTargetType = require("./Texture/TexImageTargetType");
import JThreeLogger = require("../Base/JThreeLogger");
class WebGLContextWrapper extends GLContextWrapperBase {
  private gl: WebGLRenderingContext;

    public get Context():WebGLRenderingContext
    {
      return this.gl;
    }


  constructor(gl: WebGLRenderingContext) {
    super();
    this.gl = gl;
  }

    public CheckErrorAsFatal(): void {
    var ec = this.gl.getError();
     if (ec !== WebGLRenderingContext.NO_ERROR) {
       this.notifyGlError(`WebGL error was occured:${ec}`);
     }
  }

    public CreateBuffer(): WebGLBuffer {
    this.CheckErrorAsFatal();
    return this.gl.createBuffer();
  }

    public BindBuffer(target: BufferTargetType, buffer: WebGLBuffer): void {
    this.gl.bindBuffer(target, buffer);
  }

    public UnbindBuffer(target: BufferTargetType): void {
    this.gl.bindBuffer(target, null);
  }

    public DeleteBuffer(target: WebGLBuffer): void {
    this.CheckErrorAsFatal();
    this.gl.deleteBuffer(target);
  }

    public BufferData(target: BufferTargetType, array: ArrayBuffer, usage: number): void {
    this.CheckErrorAsFatal();
    this.gl.bufferData(target, array, usage);
  }

    public ClearColor(red: number, green: number, blue: number, alpha: number): void {
    this.gl.clearColor(red, green, blue, alpha);
  }

    public Clear(mask: ClearTargetType): void {
    this.gl.clear(mask);
  }

    public CreateShader(flag: ShaderType): WebGLShader {
    this.CheckErrorAsFatal();
    return this.gl.createShader(flag);
  }

    public DeleteShader(shader: WebGLShader): void {
    this.CheckErrorAsFatal();
    this.gl.deleteShader(shader);
  }

    public ShaderSource(shader: WebGLShader, src: string): void {
    this.CheckErrorAsFatal();
    this.gl.shaderSource(shader, src);
  }

    public CompileShader(shader: WebGLShader): void {
    this.CheckErrorAsFatal();
    this.gl.compileShader(shader);
    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      //TODO 適切なエラー処理
      JThreeLogger.sectionError("Compiling shader",this.gl.getShaderInfoLog(shader));
    }
  }

    public CreateProgram(): WebGLProgram {
    this.CheckErrorAsFatal();
    return this.gl.createProgram();
  }

    public AttachShader(program: WebGLProgram, shader: WebGLShader): void {
    this.CheckErrorAsFatal();
    this.gl.attachShader(program, shader);
  }

    public LinkProgram(program: WebGLProgram): void {
    this.CheckErrorAsFatal();
    this.gl.linkProgram(program);
    if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
      JThreeLogger.sectionError("Link program",this.gl.getProgramInfoLog(program));
    }
  }

    public UseProgram(program: WebGLProgram): void {
    this.gl.useProgram(program);
  }

    public GetAttribLocation(program: WebGLProgram, name: string): number {
    return this.gl.getAttribLocation(program, name);
  }

    public EnableVertexAttribArray(attribNumber: number): void {
    this.gl.enableVertexAttribArray(attribNumber);
  }

    public VertexAttribPointer(attribLocation: number, sizePerVertex: number, elemType: ElementType, normalized: boolean, stride: number, offset: number): void {
    this.gl.vertexAttribPointer(attribLocation, sizePerVertex, elemType, normalized, stride, offset);
  }

    public DrawArrays(drawType: PrimitiveTopology, offset: number, length: number): void {
    this.gl.drawArrays(drawType, offset, length);
  }

    public Flush(): void {
    this.gl.flush();
  }

    public Finish(): void {
    this.gl.finish();
  }

    public DeleteProgram(target: WebGLProgram): void {
    this.CheckErrorAsFatal();
    this.gl.deleteProgram(target);
  }

    public GetUniformLocation(target: WebGLProgram, name: string): WebGLUniformLocation {
    this.CheckErrorAsFatal();
    return this.gl.getUniformLocation(target, name);
  }

    public UniformMatrix(webGlUniformLocation: WebGLUniformLocation, matrix: Matrix) {
    this.gl.uniformMatrix4fv(webGlUniformLocation, false, matrix.rawElements);
  }

  /**
  * Pass vector as uniform variable
  * @param webGlUniformLocation uniform variable location
  * @param vector vector you want to pass
  */
    public UniformVector2(webGlUniformLocation: WebGLUniformLocation, vector: Vector2) {
    this.gl.uniform2f(webGlUniformLocation, vector.X, vector.Y);
  }

  /**
  * Pass vector as uniform variable
  * @param webGlUniformLocation uniform variable location
  * @param vector vector you want to pass
  */
    public UniformVector3(webGlUniformLocation: WebGLUniformLocation, vector: Vector3) {
    this.gl.uniform3f(webGlUniformLocation, vector.X, vector.Y, vector.Z);
  }

    public Uniform1i(webGlUniformLocation: WebGLUniformLocation, num: number): void {
    this.gl.uniform1i(webGlUniformLocation, num);
  }

    public Enable(feature: GLFeatureType): void {
    this.gl.enable(feature);
  }

    public Disable(feature: GLFeatureType): void {
    this.gl.disable(feature);
  }

    public CullFace(cullMode: GLCullMode): void {
    this.gl.cullFace(cullMode);
  }
  /**
  * Pass vector as uniform variable
  * @param webGlUniformLocation uniform variable location
  * @param vector vector you want to pass
  */
    public UniformVector4(webGlUniformLocation: WebGLUniformLocation, vector: Vector4) {
    this.gl.uniform4f(webGlUniformLocation, vector.X, vector.Y, vector.Z, vector.W);
  }

    public ViewPort(x: number, y: number, width: number, height: number): void {
    this.gl.viewport(x, y, width, height);
  }

    public DrawElements(topology: PrimitiveTopology, length: number, dataType: ElementType, offset: number): void
    {
    this.gl.drawElements(topology, length, dataType, offset);
  }

    public CreateFrameBuffer(): WebGLFramebuffer {
    this.CheckErrorAsFatal();
    return this.gl.createFramebuffer();
  }

    public BindFrameBuffer(fbo: WebGLFramebuffer): void {
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, fbo);
  }

    public FrameBufferTexture2D(fboTarget: FrameBufferAttachmentType, tex: WebGLTexture): void {
    this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, fboTarget,this.gl.TEXTURE_2D, tex, 0);
  }

    public CreateTexture(): WebGLTexture {
    this.CheckErrorAsFatal();
    return this.gl.createTexture();
  }

    public PixelStorei(pname:PixelStoreParamType,value:number)
  {
    this.gl.pixelStorei(pname,value);
  }

    public TexImage2D(targetTexture:TexImageTargetType,level:number,internalFormat:TextureInternalFormatType,targetFormatOrWidth:TextureInternalFormatType|number,typeOrHeight:TextureType|number,pixelsOrBorder:HTMLCanvasElement|HTMLImageElement|ImageData|ArrayBufferView|number,type?:TextureType,bufferObj?:ArrayBufferView):void{
    if(type)
    {//void texImage2D(GLenum target, GLint level, GLenum internalformat, GLsizei width, GLsizei height, GLint border, GLenum format, GLenum type, ArrayBufferView? pixels)
        this.gl.texImage2D(targetTexture, level, internalFormat, <number>targetFormatOrWidth, <number>typeOrHeight, <number>pixelsOrBorder, internalFormat, type, <ArrayBufferView>bufferObj);
      return;
    }else{
      //void texImage2D(GLenum target, GLint level, GLenum internalformat, GLenum format, GLenum type, TexImageSource? source) /* May throw DOMException */
        this.gl.texImage2D(targetTexture, level, internalFormat, targetFormatOrWidth, typeOrHeight, <ImageData>pixelsOrBorder);
    }
  }

    public BindTexture(targetTexture: TargetTextureType, texture: WebGLTexture): void {
    this.gl.bindTexture(targetTexture, texture);
  }

    public GenerateMipmap(targetTexture: TargetTextureType): void {
    this.gl.generateMipmap(targetTexture);
  }

    public TexParameteri(targetTexture: TargetTextureType, param: TextureParameterType, value: TextureMagType|TextureMinType|TextureWrapType): void {
    this.gl.texParameteri(targetTexture, param, value);
  }

    public ActiveTexture(textureRegister: TextureRegister) {
    this.gl.activeTexture(textureRegister);
  }

    public CreateRenderBuffer(): WebGLRenderbuffer {
    this.CheckErrorAsFatal();
    return this.gl.createRenderbuffer();
  }

    public BindRenderBuffer(bindTarget: WebGLRenderbuffer): void {
    this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, bindTarget);
  }

    public RenderBufferStorage(internalFormat: RenderBufferInternalFormats, width: number, height: number): void {
    this.CheckErrorAsFatal();
    this.gl.renderbufferStorage(this.gl.RENDERBUFFER, internalFormat, width, height);
  }

    public FrameBufferRenderBuffer(attachment: FrameBufferAttachmentType, buffer: WebGLRenderbuffer) {
        this.gl.framebufferRenderbuffer(this.gl.FRAMEBUFFER, attachment, this.gl.RENDERBUFFER, buffer);
    }

      /**
  * Pass vector as uniform variable
  * @param webGlUniformLocation uniform variable location
  * @param vector vector you want to pass
  */
    public UniformVector2Array(webGlUniformLocation: WebGLUniformLocation, vector: Vector2[]) {
    var arr=new Array(vector.length*2);
    for(var i=0;i<vector.length;i++)
    {
      arr[i*2]=vector[i].X;
      arr[i*2+1]=vector[i].Y;
    }
    this.gl.uniform2fv(webGlUniformLocation,new Float32Array(arr));
  }

  /**
  * Pass vector as uniform variable
  * @param webGlUniformLocation uniform variable location
  * @param vector vector you want to pass
  */
    public UniformVector3Array(webGlUniformLocation: WebGLUniformLocation, vector: Vector3[]) {
    var arr=new Array(vector.length*3);
    for(var i=0;i<vector.length;i++)
    {
      arr[i*3]=vector[i].X;
      arr[i*3+1]=vector[i].Y;
      arr[i*3+2]=vector[i].Z;
    }
    this.gl.uniform3fv(webGlUniformLocation,new Float32Array(arr));
  }

  /**
  * Pass vector as uniform variable
  * @param webGlUniformLocation uniform variable location
  * @param vector vector you want to pass
  */
    public UniformVector4Array(webGlUniformLocation: WebGLUniformLocation, vector: Vector4[]) {
    var arr=new Array(vector.length*4);
    for(var i=0;i<vector.length;i++)
    {
      arr[i*4]=vector[i].X;
      arr[i*4+1]=vector[i].Y;
      arr[i*4+2]=vector[i].Z;
      arr[i*4+3]=vector[i].W;
    }
    this.gl.uniform4fv(webGlUniformLocation,new Float32Array(arr));
  }

    public Uniform1f(webglUniformLocation:WebGLUniformLocation,num:number)
  {
    this.gl.uniform1f(webglUniformLocation,num);
  }

  public Uniform1iArray(webglUniformLocation:WebGLUniformLocation,nums:Int32Array)
  {
    this.gl.uniform1iv(webglUniformLocation,nums);
  }

    public IsTexture(tex: WebGLTexture): boolean {
    return this.gl.isTexture(tex);
  }

    public DeleteTexture(tex:WebGLTexture)
  {
    this.gl.deleteTexture(tex);
  }

    public ClearDepth(depth:number)
  {
    this.gl.clearDepth(depth);
  }

    public BlendFunc(b1:BlendFuncParamType,b2:BlendFuncParamType)
  {
    this.gl.blendFunc(b1,b2);
  }

    public DepthFunc(func:DepthFuncType)
  {
    this.gl.depthFunc(func);
  }

    public BlendEquation(eq:BlendEquationType)
  {
    this.gl.blendEquation(eq);
  }

    public GetParameter(type:GetParameterType)
  {
    return this.gl.getParameter(type);
  }

  public UniformMatrixArray(webGlUniformLocation:WebGLUniformLocation,matricies:number[])
  {
    this.gl.uniformMatrix4fv(webGlUniformLocation,false,matricies);
  }

  public ReadPixels(left:number,top:number,width:number,height:number,internalFormat:TextureInternalFormatType,type:ElementType,buffer:ArrayBufferView)
  {
    this.gl.readPixels(left,top,width,height,internalFormat,type,buffer);
  }
}

export =WebGLContextWrapper;
