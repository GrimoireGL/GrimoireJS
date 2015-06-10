import GeometryNodeBase = require("./GeometryNodeBase");
import GomlLoader = require("../../GomlLoader");
import Geometry = require("../../../Core/Geometries/Geometry")
import GridGeometry = require("../../../Core/Geometries/GridGeometry");
import GomlTreeNodeBase = require("../../GomlTreeNodeBase");
class GridGeometryNode extends GeometryNodeBase
{
  private gridGeometry:GridGeometry;

  constructor(elem: HTMLElement,loader:GomlLoader,parent:GomlTreeNodeBase)
  {
      super(elem,loader,parent);
  }

  protected ConstructGeometry():Geometry
  {
    return this.gridGeometry=new GridGeometry(this.Name);
  }

  beforeLoad()
  {
    super.beforeLoad();
    this.gridGeometry.HolizontalDivide=this.HDiv;
    this.gridGeometry.VerticalDivide=this.VDiv;
  }

  private hdiv=10;
  private vdiv=10;

  get HDiv():number
  {
    this.hdiv=parseFloat(this.element.getAttribute('hdiv'));
    this.hdiv=this.hdiv||10;
    return this.hdiv;
  }

  get VDiv():number
  {
    this.vdiv =parseFloat(this.element.getAttribute('vdiv'));
    this.vdiv=this.vdiv||10;
    return this.vdiv;
  }


}

export=GridGeometryNode
