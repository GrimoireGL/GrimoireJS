import GeometryNodeBase = require("./GeometryNodeBase");
import Geometry = require("../../../Core/Geometries/Geometry")
import GridGeometry = require("../../../Core/Geometries/GridGeometry");
import GomlTreeNodeBase = require("../../GomlTreeNodeBase");
class GridGeometryNode extends GeometryNodeBase
{
  private gridGeometry:GridGeometry;

  constructor(elem: HTMLElement,parent:GomlTreeNodeBase)
  {
      super(elem,parent);
  }

  protected ConstructGeometry():Geometry
  {
    return this.gridGeometry=new GridGeometry(this.Name);
  }

    public beforeLoad()
  {
    super.beforeLoad();
    this.gridGeometry.HolizontalDivide=this.HDiv;
    this.gridGeometry.VerticalDivide=this.VDiv;
  }

  private hdiv=10;
  private vdiv=10;

    public get HDiv():number
  {
    this.hdiv=parseFloat(this.element.getAttribute("hdiv"));
    this.hdiv=this.hdiv||10;
    return this.hdiv;
  }

    public get VDiv():number
  {
    this.vdiv =parseFloat(this.element.getAttribute("vdiv"));
    this.vdiv=this.vdiv||10;
    return this.vdiv;
  }


}

export=GridGeometryNode
