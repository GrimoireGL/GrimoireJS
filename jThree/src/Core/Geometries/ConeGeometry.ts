import GeometryBuilder = require("./GeometryBuilder");
import BasicGeometry = require("./BasicGeometry");
import Geometry = require("./Geometry");
import BufferTargetType = require("../../Wrapper/BufferTargetType");
import BufferUsageType = require("../../Wrapper/BufferUsageType");
import ElementType = require("../../Wrapper/ElementType");
import Vector3 = require("../../Math/Vector3");
import PrimitiveTopology = require("../../Wrapper/PrimitiveTopology");
import JThreeContext = require("../../JThreeContext");
import ContextComponents = require("../../ContextComponents");
import ResourceManager = require("../ResourceManager");
class ConeGeometry extends BasicGeometry {

    private divideCount:number=10;

    public get DivideCount()
    {
      return this.divideCount;
    }

    public set DivideCount(count:number)
    {
      this.divideCount=count;
      this.updateBuffers();
    }

    constructor(name:string) {
        super();
        var rm = JThreeContext.getContextComponent<ResourceManager>(ContextComponents.ResourceManager);
        this.primitiveTopology=PrimitiveTopology.Triangles;
        this.indexBuffer=rm.createBuffer(name+"index",BufferTargetType.ElementArrayBuffer, BufferUsageType.StaticDraw, 1, ElementType.UnsignedShort);
        this.positionBuffer=rm.createBuffer(name+"-pos",BufferTargetType.ArrayBuffer, BufferUsageType.StaticDraw, 3, ElementType.Float);
        this.normalBuffer=rm.createBuffer(name+"-nor",BufferTargetType.ArrayBuffer, BufferUsageType.StaticDraw, 3, ElementType.Float);
        this.uvBuffer=rm.createBuffer(name+"-uv",BufferTargetType.ArrayBuffer,BufferUsageType.StaticDraw,2,ElementType.Float);
        this.updateBuffers();
    }


    protected updateBuffers():void
    {
      var pos:number[]=[];
      var normal:number[]=[];
      var uv:number[]=[];
      var index:number[]=[];
      GeometryBuilder.addCone(pos,normal,uv,index,100);
      this.indexBuffer.update(new Uint16Array(index),index.length);
      this.normalBuffer.update(new Float32Array(normal),normal.length);
      this.uvBuffer.update(new Float32Array(uv),uv.length);
      this.positionBuffer.update(new Float32Array(pos),pos.length);
    }
}

export=ConeGeometry;
