
import GeometryNodeBase = require("./GeometryNodeBase");
import Geometry = require("../../../Core/Geometries/Geometry")
import CubeGeometry = require("../../../Core/Geometries/CubeGeometry");
import GomlTreeNodeBase = require("../../GomlTreeNodeBase");

class CubeGeometryNode extends GeometryNodeBase
{
  private gridGeometry:CubeGeometry;

  constructor(elem: HTMLElement,parent:GomlTreeNodeBase)
  {
      super(elem,parent);
  }

  protected ConstructGeometry():Geometry
  {
    return this.gridGeometry=new CubeGeometry(this.Name);
  }

    public beforeLoad()
  {
    super.beforeLoad();
  }

}

export=CubeGeometryNode
