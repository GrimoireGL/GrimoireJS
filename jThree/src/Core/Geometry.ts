import jThreeObject = require("../Base/JThreeObject");
import Buffer = require("./Resources/Buffer/Buffer");

class Geometry extends jThreeObject {
   protected positionBuffer: Buffer;
   protected normalBuffer: Buffer;
   protected uvBuffer: Buffer;

   get PositionBuffer(): Buffer {
       return this.positionBuffer;
   }

   get NormalBuffer(): Buffer {
       return this.normalBuffer;
   }

   get UVBuffer(): Buffer {
       return this.uvBuffer;
   }
}
export=Geometry;
