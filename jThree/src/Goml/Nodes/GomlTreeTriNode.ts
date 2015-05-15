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
import Geometry = require("../../Core/Geometry");
import TriangleGeometry = require("../../Core/Geometries/TriangleGeometry");
class GomlTreeTriNode extends GomlTreeGeometryNodeBase
{
  private TriGeometry:TriangleGeometry;
  constructor(elem: Element,loader:GomlLoader,parent:GomlTreeNodeBase)
  {
      super(elem,loader,parent);
  }

  protected ConstructGeometry():Geometry
  {
    return this.TriGeometry=new TriangleGeometry(this.Name);
  }

  beforeLoad()
  {
    super.beforeLoad();
    this.TriGeometry.First=this.First;
    this.TriGeometry.Second=this.Second;
    this.TriGeometry.Third=this.Third;
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
