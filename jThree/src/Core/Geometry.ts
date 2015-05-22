import jThreeObject = require("../Base/JThreeObject");
import Buffer = require("./Resources/Buffer/Buffer");
import PrimitiveTopology = require("../Wrapper/PrimitiveTopology");
import Vector3 = require("../Math/Vector3");
class Geometry extends jThreeObject {
   protected positionBuffer: Buffer;
   protected normalBuffer: Buffer;
   protected uvBuffer: Buffer;
   protected indexBuffer:Buffer;
   protected primitiveTopology:PrimitiveTopology;

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

   get PrimitiveTopology():PrimitiveTopology
   {
     return this.primitiveTopology;
   }

   protected addQuad(pos:number[],normal:number[],uv:number[],points:Vector3[]):void
   {
     var v0=points[0],v1=points[1],v2=points[2];
     var v02v1=v1.subtractWith(v1);
     var v02v2=v2.subtractWith(v2);
     var v3=v0.addWith(v02v1).addWith(v02v2);
     var nV=v2.crossWith(v1);
     normal.push(nV.X,nV.Y,nV.Z);
   }
}
export=Geometry;
