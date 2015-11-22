import GeometryNodeBase = require("./GeometryNodeBase");
import GomlLoader = require("../../GomlLoader");
import GomlTreeNodeBase = require("../../GomlTreeNodeBase");
import Vector3 = require("../../../Math/Vector3");
import Geometry = require("../../../Core/Geometries/Geometry");
import TriangleGeometry = require("../../../Core/Geometries/TriangleGeometry");

class GomlTreeTriNode extends GeometryNodeBase
{
  private TriGeometry:TriangleGeometry;

  constructor(elem: HTMLElement,parent:GomlTreeNodeBase)
  {
      super(elem,parent);
  }

  protected ConstructGeometry():Geometry
  {
    return this.TriGeometry=new TriangleGeometry(this.Name);
  }

    public beforeLoad()
  {
    super.beforeLoad();
    this.TriGeometry.First=this.First;
    this.TriGeometry.Second=this.Second;
    this.TriGeometry.Third=this.Third;
  }

  private first:Vector3;

    public get First():Vector3{
    this.first=this.first||Vector3.parse(this.element.getAttribute('first')||"(-1,0,0)");
    return this.first;
  }

  private second:Vector3;

    public get Second():Vector3
  {
    this.second=this.second||Vector3.parse(this.element.getAttribute('second')||"(0,1,0)");
    return this.second;
  }

  private third:Vector3;

    public get Third():Vector3
  {
    this.third=this.third||Vector3.parse(this.element.getAttribute('third')||"(1,0,0)");
    return this.third;
  }
}

export=GomlTreeTriNode;
