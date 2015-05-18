import Exceptions = require("Exceptions");
import BufferTargetType = require("./BufferTargetType");
import ShaderType = require("./ShaderType");
import ClearTargetType = require("./ClearTargetType");
import PrimitiveTopology = require("./PrimitiveTopology");
import ElementType = require("./ElementType");
import Matrix = require("../Math/Matrix");
import JThreeObject = require("../Base/JThreeObject");
import Vector2 = require("../Math/Vector2");
import Vector3 = require("../Math/Vector3");
import Vector4 = require("../Math/Vector4");
class GLContextWrapperBase extends JThreeObject
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
      DrawArrays(drawType: PrimitiveTopology, offset: number, length: number): void
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
      * Pass vector as uniform variable
      * @param webGlUniformLocation uniform variable location
      * @param vector vector you want to pass
      */
      UniformVector2(webGlUniformLocation: WebGLUniformLocation, vector:Vector2)
      {
        throw new Exceptions.AbstractClassMethodCalledException();
      }

      /**
      * Pass vector as uniform variable
      * @param webGlUniformLocation uniform variable location
      * @param vector vector you want to pass
      */
      UniformVector3(webGlUniformLocation: WebGLUniformLocation, vector:Vector3)
      {
        throw new Exceptions.AbstractClassMethodCalledException();
      }

      /**
      * Pass vector as uniform variable
      * @param webGlUniformLocation uniform variable location
      * @param vector vector you want to pass
      */
      UniformVector4(webGlUniformLocation: WebGLUniformLocation, vector:Vector4)
      {
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

      DrawElements(topology:PrimitiveTopology,length:number,dataType:ElementType,offset:number):void{
        throw new Exceptions.AbstractClassMethodCalledException();
      }
  }

export=GLContextWrapperBase;
