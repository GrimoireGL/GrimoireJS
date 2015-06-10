import JThreeObject=require('Base/JThreeObject');
import Geometry = require("./Geometry");
import JThreeContextProxy = require("../JThreeContextProxy");
import BufferTargetType = require("../../Wrapper/BufferTargetType");
import BufferUsageType = require("../../Wrapper/BufferUsageType");
import ElementType = require("../../Wrapper/ElementType");
import JthreeID = require("../../Base/JThreeID");
import Buffer = require("../Resources/Buffer/Buffer");
import Vector3 = require("../../Math/Vector3");
import PrimitiveTopology = require("../../Wrapper/PrimitiveTopology");
class GridGeometry extends Geometry {
    constructor(name:string) {
        super();
        var j3=JThreeContextProxy.getJThreeContext();
        this.primitiveTopology=PrimitiveTopology.Lines;
        this.indexBuffer=j3.ResourceManager.createBuffer(name+"index",BufferTargetType.ElementArrayBuffer, BufferUsageType.StaticDraw, 1, ElementType.UnsignedShort);
        this.positionBuffer=j3.ResourceManager.createBuffer(name+"-pos",BufferTargetType.ArrayBuffer, BufferUsageType.StaticDraw, 3, ElementType.Float);
        this.normalBuffer=j3.ResourceManager.createBuffer(name+"-nor",BufferTargetType.ArrayBuffer, BufferUsageType.StaticDraw, 3, ElementType.Float);
        this.uvBuffer=j3.ResourceManager.createBuffer(name+"-uv",BufferTargetType.ArrayBuffer,BufferUsageType.StaticDraw,2,ElementType.Float);
        this.updateBuffers();
    }

    private holizontalDivide=10;
    private verticalDivide=10;

    public get HolizontalDivide():number
    {
      return this.holizontalDivide;
    }

    public get VerticalDivide():number
    {
      return this.verticalDivide;
    }

    public set HolizontalDivide(num:number)
    {
      this.holizontalDivide=num;
      this.updateBuffers();
    }

    public set VerticalDivide(num:number)
    {
      this.verticalDivide=num;
      this.updateBuffers();
    }


    private get VerticiesCount():number
    {
      return (this.HolizontalDivide+1)*2+(this.VerticalDivide+1)*2;
    }
    protected updatePositionBuffer():void
    {
      var arr:number[]=[];
      for (var i = 0; i < this.HolizontalDivide+1; i++) {
          var num=-1+1/this.HolizontalDivide*i*2;
          arr.push(num,0,-1,num,0,1);
      }
      for (var i = 0; i < this.VerticalDivide+1; i++) {
          var num=-1+1/this.VerticalDivide*i*2;
          arr.push(-1,0,num,1,0,num);
      }
      this.positionBuffer.update(new Float32Array(arr),arr.length);
    }

    protected updateNormalBuffer():void
    {
      this.normalBuffer.update(new Float32Array(new Array(this.VerticiesCount*3)),this.VerticiesCount*3);
    }

    protected updateUvBuffer():void
    {
      this.uvBuffer.update(new Float32Array(new Array(this.VerticiesCount*2)),this.VerticiesCount*2)
    }

    protected updateIndexBuffer():void{
      var arr:number[]=[];
      for(var v=0;v<this.VerticiesCount;v++)
        arr.push(v);
      this.indexBuffer.update(new Uint16Array(arr),this.VerticiesCount);
    }

    protected updateBuffers():void
    {
      this.updatePositionBuffer();
      this.updateNormalBuffer();
      this.updateUvBuffer();
      this.updateIndexBuffer();
    }
}

export=GridGeometry;
