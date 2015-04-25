import JThreeObject = require("../../../Base/JThreeObject");
import Program = require("./Program");
import ContextManagerBase = require("../../ContextManagerBase");
import GLContextWrapperBase = require("../../../Wrapper/GLContextWrapperBase");
import Matrix = require("../../../Math/Matrix");
import BufferWrapper = require("../Buffer/BufferWrapper");

class ProgramWrapper extends JThreeObject
{
   constructor(parent:Program,contextManager:ContextManagerBase) {
       super();
       this.id = contextManager.ID;
       this.glContext = contextManager.Context;
       this.parentProgram = parent;
   }

   private id:string="";

   private initialized: boolean = false;

   private isLinked:boolean=false;

   private targetProgram: WebGLProgram = null;

   private glContext: GLContextWrapperBase = null;

   private parentProgram: Program = null;

   private attributeLocations: Map<string, number> = new Map<string, number>();

   private uniformLocations:Map<string,WebGLUniformLocation>=new Map<string,WebGLUniformLocation>();

   get TargetProgram(): WebGLProgram {
       return this.targetProgram;
   }

   init(): void {
       if (!this.initialized) {
           this.targetProgram = this.glContext.CreateProgram();
           this.parentProgram.AttachedShaders.forEach((v, i, a) => {
               this.glContext.AttachShader(this.targetProgram, v.getForRendererID(this.id).TargetShader);
           });
           this.initialized = true;
       }
   }

   dispose() {
       if (this.initialized) {
           this.glContext.DeleteProgram(this.targetProgram);
           this.initialized = false;
           this.targetProgram = null;
           this.isLinked = false;
       }
   }

   linkProgram(): void {
       if (!this.isLinked) {
           this.glContext.LinkProgram(this.targetProgram);
           this.isLinked = true;
       }
   }

   useProgram(): void
   {
       if (!this.initialized) {
           console.log("useProgram was called, but program was not initialized.");
           this.init();
       }
       if (!this.isLinked)
       {
           console.log("useProgram was called, but program was not linked.");
           this.linkProgram();
       }
       this.glContext.UseProgram(this.targetProgram);
   }

   setUniformMatrix(valName: string, matrix: Matrix): void {
       this.useProgram();
       if (!this.uniformLocations.has(valName))
       {
           this.uniformLocations.set(valName, this.glContext.GetUniformLocation(this.TargetProgram, valName));
       }
       var uniformIndex: WebGLUniformLocation = this.uniformLocations.get(valName);
       this.glContext.UniformMatrix(uniformIndex,matrix);
   }

   setAttributeVerticies(valName: string, buffer: BufferWrapper): void {
       this.useProgram();
       buffer.bindBuffer();
       if (!this.attributeLocations.has(valName)) {
           this.attributeLocations.set(valName, this.glContext.GetAttribLocation(this.TargetProgram, valName));
       }
       var attribIndex: number = this.attributeLocations.get(valName);
       this.glContext.EnableVertexAttribArray(attribIndex);
       this.glContext.VertexAttribPointer(attribIndex, buffer.UnitCount, buffer.ElementType,buffer.Normalized,buffer.Stride,buffer.Offset);
   }

   get ID(): string {
       return this.id;
   }

}

export=ProgramWrapper;
