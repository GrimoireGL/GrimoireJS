import jThreeObject = require("../Base/JThreeObject");
import Buffer = require("./Resources/Buffer/Buffer");
import PrimitiveTopology = require("../Wrapper/PrimitiveTopology");
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
}
export=Geometry;
