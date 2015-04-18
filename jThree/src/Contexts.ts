module jThree {
    import JThreeObject = jThree.Base.jThreeObject;
    /**
     * Base class for wrapping WebGLRenderingContext
     */
    export class GLContextWrapperBase extends JThreeObject
    {
        /**
         * Check gl error, and abort if error has been occured.
         */
        CheckErrorAsFatal(): void
        {
            throw new Exceptions.AbstractClassMethodCalledException();
        }

        CreateBuffer(): WebGLBuffer
        {
            throw new Exceptions.AbstractClassMethodCalledException();
        }

        BindBuffer(target: BufferTargetType, buffer: WebGLBuffer): void
        {
            throw new Exceptions.AbstractClassMethodCalledException();
        }

        BufferData(target: BufferTargetType, array: ArrayBuffer, usage: number): void
        {
            throw new Exceptions.AbstractClassMethodCalledException();
        }

        UnbindBuffer(target: BufferTargetType): void
        {
            throw new Exceptions.AbstractClassMethodCalledException();
        }

        ClearColor(red: number, green: number, blue: number, alpha: number): void
        {
            throw new Exceptions.AbstractClassMethodCalledException();
        }

        Clear(mask: ClearTargetType): void
        {
            throw new Exceptions.AbstractClassMethodCalledException();
        }

        CreateShader(flag:ShaderType): WebGLShader{
            throw new Exceptions.AbstractClassMethodCalledException();
        }

        DeleteShader(shader: WebGLShader): void {
            throw new Exceptions.AbstractClassMethodCalledException();
        }

        ShaderSource(shader: WebGLShader, src: string): void {
            throw new Exceptions.AbstractClassMethodCalledException();
        }

        CompileShader(shader: WebGLShader): void {
            throw new Exceptions.AbstractClassMethodCalledException();
        }

        CreateProgram(): WebGLProgram {
            throw new Exceptions.AbstractClassMethodCalledException();
        }

        AttachShader(program: WebGLProgram, shader: WebGLShader): void
        {
            throw new Exceptions.AbstractClassMethodCalledException();
        }

        LinkProgram(program: WebGLProgram): void
        {
            throw new Exceptions.AbstractClassMethodCalledException();
        }

        UseProgram(program: WebGLProgram): void
        {
            throw new Exceptions.AbstractClassMethodCalledException();
        }

        GetAttribLocation(program:WebGLProgram,name:string): number {
            throw new Exceptions.AbstractClassMethodCalledException();
        }

        EnableVertexAttribArray(attribNumber:number): void {
            throw new Exceptions.AbstractClassMethodCalledException();
        }

        VertexAttribPointer(attribLocation: number, sizePerVertex: number, elemType: ElementType, normalized: boolean, stride: number, offset: number): void {
            throw new Exceptions.AbstractClassMethodCalledException();
        }


        DrawArrays(drawType: DrawType, offset: number, length: number): void
        {
            throw new Exceptions.AbstractClassMethodCalledException();
        }

        Flush(): void
        {
            throw new Exceptions.AbstractClassMethodCalledException();
        }

        Finish() {
            throw new Exceptions.AbstractClassMethodCalledException();
        }

        DeleteBuffer(target: WebGLBuffer): void
        {
            throw new Exceptions.AbstractClassMethodCalledException();
        }

        DeleteProgram(target: WebGLProgram): void {
            throw new Exceptions.AbstractClassMethodCalledException();
        }

        GetUniformLocation(target: WebGLProgram,name:string): WebGLUniformLocation {
            throw new Exceptions.AbstractClassMethodCalledException();
        }

        UniformMatrix(webGlUniformLocation: WebGLUniformLocation, matrix: Matrix.Matrix) {
            throw new Exceptions.AbstractClassMethodCalledException();
        }

        ViewPort(x: number, y: number, width: number, height: number): void {
            throw new Exceptions.AbstractClassMethodCalledException();
        }
    }

    export class WebGLWrapper extends GLContextWrapperBase
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

        DrawArrays(drawType:DrawType,offset:number,length:number): void {
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

        UniformMatrix(webGlUniformLocation: WebGLUniformLocation, matrix: Matrix.Matrix) {
            this.CheckErrorAsFatal();
            this.gl.uniformMatrix4fv(webGlUniformLocation, false,matrix.rawElements);
        }

        ViewPort(x:number,y:number,width:number,height:number): void {
            this.CheckErrorAsFatal();
            this.gl.viewport(x, y, width, height);
        }
    }
    export enum BufferTargetType
    {
        ArrayBuffer = 34962,//ARRAY_BUFFER
        ElementArrayBuffer = 34963//ELEMENT_ARRAY_BUFFER
    }

    export enum ClearTargetType {
        ColorBits = 16384,//COLOR_BUFFER_BIT,
        DepthBits = 256,//DEPTH_BUFFER_BIT,
        StencilBits=1024//STENCIL_BUFFER_BIT
    }

    export enum ShaderType {
        VertexShader = 35633,//VERTEX_SHADER,
        FragmentShader=35632//FRAGMENT_SHADER
    }

    export enum BufferUsageType {
        StaticDraw = 35044,//STATIC_DRAW,
        StreamDraw = 35040,//STREAM_DRAW,
        DynamicDraw=35048//WebGLRenderingContext.DYNAMIC_DRAW
    }

    export enum ElementType {
        Float = 5126,//FLOAT,
        UnsignedByte = 5121,//WebGLRenderingContext.UNSIGNED_BYTE,
        Short = 5122,//WebGLRenderingContext.SHORT,
        UnsignedShort =5123,// WebGLRenderingContext.UNSIGNED_SHORT,
        UnsignedInt = 5125,//WebGLRenderingContext.UNSIGNED_INT,
        Int=5124//WebGLRenderingContext.INT
    }

    export enum DrawType {
        Triangles=4,//TRIANGLES
    }
} 