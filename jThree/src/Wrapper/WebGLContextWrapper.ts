import GLContextWrapperBase = require("./GLContextWrapperBase");
import BufferTargetType = require("./BufferTargetType");
import ShaderType = require("./ShaderType");
import ClearTargetType = require("./ClearTargetType");
import PrimitiveTopology = require("./PrimitiveTopology");
import ElementType = require("./ElementType");
import Matrix = require("../Math/Matrix");
class WebGLContextWrapper extends GLContextWrapperBase
{
    private gl: WebGLRenderingContext;


    constructor(gl: WebGLRenderingContext)
    {
        super();
        this.gl = gl;
    }

    CheckErrorAsFatal(): void
    {
        var ec = this.gl.getError();
        if (ec !== WebGLRenderingContext.NO_ERROR)
        {
            alert("WebGL error was occured:{0}".format(ec));
        }
    }

    CreateBuffer(): WebGLBuffer
    {
        this.CheckErrorAsFatal();
        return this.gl.createBuffer();
    }

    BindBuffer(target: BufferTargetType, buffer: WebGLBuffer): void
    {
        this.CheckErrorAsFatal();
        this.gl.bindBuffer(target, buffer);
    }

    UnbindBuffer(target: BufferTargetType): void
    {
        this.CheckErrorAsFatal();
        this.gl.bindBuffer(target, null);
    }

    DeleteBuffer(target: WebGLBuffer): void {
        this.CheckErrorAsFatal();
        this.gl.deleteBuffer(target);
    }

    BufferData(target: BufferTargetType, array: ArrayBuffer, usage: number): void
    {
        this.CheckErrorAsFatal();
        this.gl.bufferData(target, array, usage);
    }

    ClearColor(red:number,green:number,blue:number,alpha:number): void {
        this.CheckErrorAsFatal();
        this.gl.clearColor(red,green,blue,alpha);
    }

    Clear(mask:ClearTargetType): void {
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

    GetAttribLocation(program: WebGLProgram, name: string):number{
        this.CheckErrorAsFatal();
        return this.gl.getAttribLocation(program, name);
    }

    EnableVertexAttribArray(attribNumber:number): void {
        this.CheckErrorAsFatal();
        this.gl.enableVertexAttribArray(attribNumber);
    }

    VertexAttribPointer(attribLocation:number,sizePerVertex:number,elemType:ElementType,normalized:boolean,stride:number,offset:number): void {
        this.CheckErrorAsFatal();
        this.gl.vertexAttribPointer(attribLocation, sizePerVertex, elemType, normalized, stride, offset);
    }

    DrawArrays(drawType:PrimitiveTopology,offset:number,length:number): void {
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

    GetUniformLocation(target: WebGLProgram,name:string): WebGLUniformLocation {
        this.CheckErrorAsFatal();
        return this.gl.getUniformLocation(target, name);
    }

    UniformMatrix(webGlUniformLocation: WebGLUniformLocation, matrix:Matrix) {
        this.CheckErrorAsFatal();
        this.gl.uniformMatrix4fv(webGlUniformLocation, false,matrix.rawElements);
    }

    ViewPort(x:number,y:number,width:number,height:number): void {
        this.CheckErrorAsFatal();
        this.gl.viewport(x, y, width, height);
    }

    DrawElements(topology:PrimitiveTopology,length:number,dataType:ElementType,offset:number):void{
      this.CheckErrorAsFatal();
      this.gl.drawElements(topology,length,dataType,offset);
    }
}
export=WebGLContextWrapper;
