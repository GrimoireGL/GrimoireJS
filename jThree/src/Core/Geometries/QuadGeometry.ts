import JThreeObject=require('Base/JThreeObject');
import Geometry = require("./Geometry");
import JThreeContextProxy = require("../JThreeContextProxy");
import BufferTargetType = require("../../Wrapper/BufferTargetType");
import BufferUsageType = require("../../Wrapper/BufferUsageType");
import ElementType = require("../../Wrapper/ElementType");
import JthreeID = require("../../Base/JThreeID");
import Buffer = require("../Resources/Buffer/Buffer");
import Vector3 = require("../../Math/Vector3");
class QuadGeometry extends Geometry {
    constructor(name:string) {
        super();
        var j3=JThreeContextProxy.getJThreeContext();
        this.indexBuffer=j3.ResourceManager.createBuffer(name+"index",BufferTargetType.ElementArrayBuffer, BufferUsageType.StaticDraw, 1, ElementType.UnsignedByte);
        this.positionBuffer=j3.ResourceManager.createBuffer(name+"-pos",BufferTargetType.ArrayBuffer, BufferUsageType.StaticDraw, 3, ElementType.Float);
        this.normalBuffer=j3.ResourceManager.createBuffer(name+"-nor",BufferTargetType.ArrayBuffer, BufferUsageType.StaticDraw, 3, ElementType.Float);
        this.uvBuffer=j3.ResourceManager.createBuffer(name+"-uv",BufferTargetType.ArrayBuffer,BufferUsageType.StaticDraw,2,ElementType.Float);
        this.updateBuffers();
    }
    
    protected updateBuffers():void
    {
      var pos:number[]=[];
      var nor:number[]=[];
      var uv:number[] = [];
      var index:number[]=[];
      this.addQuad(pos,nor,uv,index,[new Vector3(-1,1,0),new Vector3(1,1,0),new Vector3(-1,-1,0)]);
      this.positionBuffer.update(new Float32Array(pos),pos.length);
      this.normalBuffer.update(new Float32Array(nor),nor.length);
      this.uvBuffer.update(new Float32Array(uv),uv.length);
      this.indexBuffer.update(new Uint8Array(index),index.length);
    }
}

export=QuadGeometry;
