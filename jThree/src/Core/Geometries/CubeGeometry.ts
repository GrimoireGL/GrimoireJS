import JThreeObject=require('Base/JThreeObject');
import Geometry = require("../Geometry");
import JThreeContextProxy = require("../JThreeContextProxy");
import BufferTargetType = require("../../Wrapper/BufferTargetType");
import BufferUsageType = require("../../Wrapper/BufferUsageType");
import ElementType = require("../../Wrapper/ElementType");
import JthreeID = require("../../Base/JThreeID");
import Buffer = require("../Resources/Buffer/Buffer");
import Vector3 = require("../../Math/Vector3");
class CubeGeometry extends Geometry {
    constructor(name:string) {
        super();
        var j3=JThreeContextProxy.getJThreeContext();
        this.positionBuffer=j3.ResourceManager.createBuffer(name+"-pos",BufferTargetType.ArrayBuffer, BufferUsageType.StaticDraw, 3, ElementType.Float);
        this.normalBuffer=j3.ResourceManager.createBuffer(name+"-nor",BufferTargetType.ArrayBuffer, BufferUsageType.StaticDraw, 3, ElementType.Float);
        this.uvBuffer=j3.ResourceManager.createBuffer(name+"-uv",BufferTargetType.ArrayBuffer,BufferUsageType.StaticDraw,2,ElementType.Float);
        this.updateBuffers();
    }


    protected updatePositionBuffer():void
    {
      this.positionBuffer.update(new Float32Array([
        
      ]),9);
    }

    protected updateNormalBuffer():void
    {
      this.normalBuffer.update(new Float32Array([0,0,-1,0,0,-1,0,0,-1]),9);
    }

    protected updateUvBuffer():void
    {
      this.uvBuffer.update(new Float32Array([0.5,0.5,1,0,0,0]),6)
    }

    protected updateBuffers():void
    {
      this.updatePositionBuffer();
      this.updateNormalBuffer();
      this.updateUvBuffer();
    }
}

export=CubeGeometry;
