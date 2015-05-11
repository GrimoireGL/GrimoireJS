import JThreeObject=require('Base/JThreeObject');
import GomlTreeGeometryNodeBase = require("./GomlTreeGeometryNodeBase");
import GomlLoader = require("../GomlLoader");
import GomlTreeNodeBase = require("../GomlTreeNodeBase");
import Vector3 = require("../../Math/Vector3");
import JThreeContext = require("../../Core/JThreeContext");
import JThreeContextProxy = require("../../Core/JThreeContextProxy");
import BufferUsage = require("../../Wrapper/BufferUsageType");
import ElementType = require("../../Wrapper/ElementType");
import BufferTargetType = require("../../Wrapper/BufferTargetType");
class GomlTreeTriNode extends GomlTreeGeometryNodeBase
{
  constructor(elem: Element,loader:GomlLoader,parent:GomlTreeNodeBase)
  {
      super(elem,loader,parent);
  }

  beforeLoad()
  {
    var context=JThreeContextProxy.getJThreeContext();
    var buffer=context.ResourceManager.createBuffer("goml-test",BufferTargetType.ArrayBuffer,BufferUsage.StaticDraw,3,ElementType.Float);
    var f:Vector3,s:Vector3,t:Vector3;
    f=this.First;s=this.Second;t=this.Third;
    buffer.update(new Float32Array([f.X,f.Y,f.Z,s.X,s.Y,s.Z,t.X,t.Y,t.Z]),9);
  }

  private first:Vector3;
  get First():Vector3{
    this.first=this.first||Vector3.parse(this.element.getAttribute('first')||"(0)");
    return this.first;
  }

  private second:Vector3;
  get Second():Vector3
  {
    this.second=this.second||Vector3.parse(this.element.getAttribute('second')||"(0)");
    return this.second;
  }

  private third:Vector3;
  get Third():Vector3
  {
    this.third=this.third||Vector3.parse(this.element.getAttribute('third')||"(0)");
    return this.third;
  }
}

export=GomlTreeTriNode;
