import jThreeObject = require("../../Base/JThreeObject");
import Buffer = require("./../Resources/Buffer/Buffer");
import PrimitiveTopology = require("../../Wrapper/PrimitiveTopology");
import Vector3 = require("../../Math/Vector3");
import ContextManagerBase = require("./../ContextManagerBase");
import Material = require("./../Materials/Material");
/**
 * Base abstraction for geometry.
 */
class Geometry extends jThreeObject {
   protected positionBuffer: Buffer;
   protected normalBuffer: Buffer;
   protected uvBuffer: Buffer;
   protected indexBuffer:Buffer;
   protected primitiveTopology:PrimitiveTopology=PrimitiveTopology.Triangles;

   get PositionBuffer(): Buffer {
       return this.positionBuffer;
   }

   get NormalBuffer(): Buffer {
       return this.normalBuffer; 
   }

   get UVBuffer(): Buffer {
       return this.uvBuffer;
   }

   get IndexBuffer():Buffer
   {
     return this.indexBuffer;
   }
   
   /**
    * 3 times of surface count.
    */
   get IndexCount()
   {
     return this.indexBuffer.Length;
   }
   
   get GeometryOffset()
   {
     return 0;
   }

   get PrimitiveTopology():PrimitiveTopology
   {
     return this.primitiveTopology;
   }
   
   public drawElements(contextManager:ContextManagerBase,material:Material)
   {
     if(material)
     {
       contextManager.GLContext.DrawElements(this.PrimitiveTopology,material.getDrawGeometryLength(this),this.IndexBuffer.ElementType,material.getDrawGeometryOffset(this));
       return;
     }
     contextManager.GLContext.DrawElements(this.PrimitiveTopology,this.IndexCount,this.IndexBuffer.ElementType,this.GeometryOffset);
   }

   protected addQuad(pos:number[],normal:number[],uv:number[],index:number[],points:Vector3[]):void
   {
     var startIndex = pos.length / 3;
     var v0 = points[0], v1 = points[1], v3 = points[2];
     var v02v1 = v1.subtractWith(v0);
     var v02v3 = v3.subtractWith(v0);
     var v2 = v0.addWith(v02v1).addWith(v02v3);
     var nV = v02v1.crossWith(v02v3).normalizeThis();
     normal.push(nV.X, nV.Y, nV.Z, nV.X, nV.Y, nV.Z, nV.X, nV.Y, nV.Z, nV.X, nV.Y, nV.Z);
     uv.push(0, 1, 0, 0, 1, 0, 1, 1);
     pos.push(v0.X, v0.Y, v0.Z, v1.X, v1.Y, v1.Z, v2.X, v2.Y, v2.Z, v3.X, v3.Y, v3.Z);
     index.push(startIndex, startIndex + 1, startIndex + 3, startIndex + 3, startIndex + 1, startIndex + 2);
     // var v0=points[0],v1=points[1],v=points[2];
     // var v02v1=v1.subtractWith(v0);
     // var v02v2=v2.subtractWith(v0);
     // var v3=v0.addWith(v02v1).addWith(v02v2);
     // var nV=v02v2.crossWith(v02v1).normalizeThis();
     // var startIndex=pos.length/3;
     // normal.push(nV.X,nV.Y,nV.Z,nV.X,nV.Y,nV.Z,nV.X,nV.Y,nV.Z,nV.X,nV.Y,nV.Z);
     // uv.push(0,1,1,1,1,0,0,0);
     // pos.push(v0.X,v0.Y,v0.Z,v1.X,v1.Y,v1.Z,v3.X,v3.Y,v3.Z,v2.X,v2.Y,v2.Z);
     // index.push(startIndex,startIndex+2,startIndex+1,startIndex,startIndex+3,startIndex+2);
   }

   protected addCircle(pos:number[],normal:number[],uv:number[],index:number[],divide:number,center:Vector3,normalVector:Vector3,tangentVector:Vector3)
   {
     var tan2=Vector3.cross(tangentVector,normalVector);
     var vecCount=2+divide;
     var baseIndex=uv.length/2;
      for (var i = 0; i < vecCount; i++) {
         var v:Vector3=this.calcNextPointInCircle(i,divide,center,tangentVector,tan2);
         var u=this.calcUVInCircle(i,divide);
         pos.push(v.X,v.Y,v.Z);
         normal.push(normalVector.X,normalVector.Y,normalVector.Z);
         uv.push(u[0],u[1]);
     }
     for (var i = 0; i < divide; i++) {
       index.push(baseIndex);
       index.push(baseIndex+i+2);
       index.push(baseIndex+i+1);
    }
   }

   private calcUVInCircle(index:number,divCount:number):number[]
   {
     if(index==0)return [0,0];
     var angle=(index-1)*2*Math.PI/divCount;
     return [Math.cos(angle),Math.sin(angle)];
   }

   private calcNextPointInCircle(index:number,divCount:number,center:Vector3,tan:Vector3,tan2:Vector3):Vector3
   {
     var angle=(index-1)*2*Math.PI/divCount;
     return index === 0?center:
      Vector3.add(center,Vector3.add(tan.multiplyWith(Math.sin(angle)),tan2.multiplyWith(Math.cos(angle))));
   }



   protected addCylinder(pos:number[],normal:number[],uv:number[],index:number[],divide:number,start:Vector3,end:Vector3,tangent:Vector3,radius:number)
   {
     var dest:Vector3 = Vector3.subtract(end,start);
     var tangentNormalized:Vector3=tangent.normalizeThis();
     var tan2:Vector3=Vector3.cross(dest.normalizeThis(),tangentNormalized);
     tangentNormalized=tangentNormalized.multiplyWith(radius);
     tan2=tan2.multiplyWith(radius);
     for(var i=0;i<divide;i++)
     {
       var angle=(i-1)*2*Math.PI/divide;
       var angleTo=i*2*Math.PI/divide;
       var currentNormal=Vector3.add(tan2.multiplyWith(Math.cos(angle)),tangentNormalized.multiplyWith(Math.sin(angle)));
       var nextNormal=Vector3.add(tan2.multiplyWith(Math.cos(angleTo)),tangentNormalized.multiplyWith(Math.sin(angleTo)));
       var v0=Vector3.add(start,currentNormal);
       var v1= Vector3.add(start,nextNormal);
       var v2 = Vector3.add(v0,dest);
       var v3=v1.addWith(dest);
       var startIndex=pos.length/3;
       normal.push(currentNormal.X,currentNormal.Y,currentNormal.Z,
          nextNormal.X,nextNormal.Y,nextNormal.Z,
          nextNormal.X,nextNormal.Y,nextNormal.Z,
          currentNormal.X,currentNormal.Y,currentNormal.Z);
       uv.push(0,1,1,0,1,0,0,0);
       pos.push(v0.X,v0.Y,v0.Z,v1.X,v1.Y,v1.Z,v3.X,v3.Y,v3.Z,v2.X,v2.Y,v2.Z);
       index.push(startIndex,startIndex+1,startIndex+2,startIndex,startIndex+2,startIndex+3);
     }
   }
   
   public bindIndexBuffer(contextManager:ContextManagerBase)
   {
     this.IndexBuffer.getForRenderer(contextManager).bindBuffer();
   }
}
export=Geometry;
