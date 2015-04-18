/**
 * jThree most basic module
 */
module jThree
{
    import JThreeObject = jThree.Base.jThreeObject;
    import Matrix = jThree.Mathematics.Matricies.Matrix; 
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
        /**
         * Create WebGLBuffer
         * @returns {The new buffer reference that has been created.} 
         */
        CreateBuffer(): WebGLBuffer
        {
            throw new Exceptions.AbstractClassMethodCalledException();
        }
        /**
         * Bind the WebGLBuffer
         * @param target target buffer you want to bind
         * @param buffer the buffer you want to bind
         */
        BindBuffer(target: BufferTargetType, buffer: WebGLBuffer): void
        {
            throw new Exceptions.AbstractClassMethodCalledException();
        }
        /**
         * Store data to buffer
         * @param target target type you want to store data
         * @param array data source array
         * @param usage type how to use data source 
         */
        BufferData(target: BufferTargetType, array: ArrayBuffer, usage: number): void
        {
            throw new Exceptions.AbstractClassMethodCalledException();
        }
        /**
         * Unbind buffer
         * @param target the buffer type you want to unbind 
         */
        UnbindBuffer(target: BufferTargetType): void
        {
            throw new Exceptions.AbstractClassMethodCalledException();
        }

        /**
         * Set the clear color it will be used when you call Clear()
         * @param red red color value [0,1]
         * @param green green color value [0,1]
         * @param blue blue color value [0,1]
         * @param alpha alpha color value [0,1]
         */
        ClearColor(red: number, green: number, blue: number, alpha: number): void
        {
            throw new Exceptions.AbstractClassMethodCalledException();
        }
        /**
         * Clear buffers
         * @param mask type of buffer you want to clear
         */
        Clear(mask: ClearTargetType): void
        {
            throw new Exceptions.AbstractClassMethodCalledException();
        }
        /**
         * Create new Shader
         * @param flag the shader type you want to create
         * @returns {new shader} 
         */
        CreateShader(flag:ShaderType): WebGLShader{
            throw new Exceptions.AbstractClassMethodCalledException();
        }
        /**
         * Delete passed shader
         * @param shader the shader you want to delete 
         */
        DeleteShader(shader: WebGLShader): void {
            throw new Exceptions.AbstractClassMethodCalledException();
        }
        /**
         * Store shader source
         * @param shader reference you want to be stored
         * @param src shader source code 
         */
        ShaderSource(shader: WebGLShader, src: string): void {
            throw new Exceptions.AbstractClassMethodCalledException();
        }
        /**
         * Compile shader source
         * @param shader shader reference you want to be compiled 
         */
        CompileShader(shader: WebGLShader): void {
            throw new Exceptions.AbstractClassMethodCalledException();
        }
        /**
         * Create new program
         * @returns {created program}
         */
        CreateProgram(): WebGLProgram {
            throw new Exceptions.AbstractClassMethodCalledException();
        }
        /**
         * Attach shader to program
         * @param program the program you want to be attached
         * @param shader the shader you want to attach
         */
        AttachShader(program: WebGLProgram, shader: WebGLShader): void
        {
            throw new Exceptions.AbstractClassMethodCalledException();
        }
        /**
         * Link program
         * @param program the program you want to link  
         */
        LinkProgram(program: WebGLProgram): void
        {
            throw new Exceptions.AbstractClassMethodCalledException();
        }
        /**
         * Use program
         * @param program the program you want to use 
         */
        UseProgram(program: WebGLProgram): void
        {
            throw new Exceptions.AbstractClassMethodCalledException();
        }
        /**
         * Get attribute variable location from program
         * @param program the program you want to locate attribute variable
         * @param name attribute variable name
         * @returns {attribute variable location} 
         */
        GetAttribLocation(program:WebGLProgram,name:string): number {
            throw new Exceptions.AbstractClassMethodCalledException();
        }
        /**
         * Enable vartex attribute array
         * @param attribNumber the attribute variable location you want to enable vertex attribute array
         */
        EnableVertexAttribArray(attribNumber:number): void {
            throw new Exceptions.AbstractClassMethodCalledException();
        }
        /**
         * Pass buffer to attribute variable.
         * @param attribLocation attribute variable location
         * @param sizePerVertex element count per vertex
         * @param elemType the variable type you will pass
         * @param normalized is this normalized or not(ALWAYS should be false)
         * @param stride stride in buffer array
         * @param offset offset of buffer array
         */
        VertexAttribPointer(attribLocation: number, sizePerVertex: number, elemType: ElementType, normalized: boolean, stride: number, offset: number): void {
            throw new Exceptions.AbstractClassMethodCalledException();
        }

        /**
         * Draw without index
         * @param drawType primitive topology type
         * @param offset vertex array offset
         * @param length count of the vertex you want to draw. 
         */
        DrawArrays(drawType: DrawType, offset: number, length: number): void
        {
            throw new Exceptions.AbstractClassMethodCalledException();
        }
        /**
         * Flush drawing
         */
        Flush(): void
        {
            throw new Exceptions.AbstractClassMethodCalledException();
        }
        /**
         * Finish drawing
         */
        Finish() {
            throw new Exceptions.AbstractClassMethodCalledException();
        }
        /**
         * Delete buffer
         * @param target the buffer you want to delete 
         */
        DeleteBuffer(target: WebGLBuffer): void
        {
            throw new Exceptions.AbstractClassMethodCalledException();
        }
        /**
         * Delete program
         * @param target the program you want to delete.
         */
        DeleteProgram(target: WebGLProgram): void {
            throw new Exceptions.AbstractClassMethodCalledException();
        }
        /**
         * Get uniform variable location
         * @param target the program you want to locate uniform variable
         * @param name the name of uniform variable
         */
        GetUniformLocation(target: WebGLProgram,name:string): WebGLUniformLocation {
            throw new Exceptions.AbstractClassMethodCalledException();
        }
        /**
         * Pass matrix as uniform variable
         * @param webGlUniformLocation uniform variable location
         * @param matrix matrix you want to pass
         */
        UniformMatrix(webGlUniformLocation: WebGLUniformLocation, matrix:Matrix) {
            throw new Exceptions.AbstractClassMethodCalledException();
        }
        /**
         * Set viewport configure
         * @param x X of left-bottom screen coordinate
         * @param y Y of left-bottom screen coordinate
         * @param width width of viewport
         * @param height height of viewport
         */
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

        UniformMatrix(webGlUniformLocation: WebGLUniformLocation, matrix:Matrix) {
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