import GeometryNodeBase = require("./GeometryNodeBase");
import GomlLoader = require("../../GomlLoader");
import Geometry = require("../../../Core/Geometry")
import CubeGeometry = require("../../../Core/Geometries/CubeGeometry");
import GomlTreeNodeBase = require("../../GomlTreeNodeBase");
class CubeGeometryNode extends GeometryNodeBase
{
  private gridGeometry:CubeGeometry;

  constructor(elem: HTMLElement,loader:GomlLoader,parent:GomlTreeNodeBase)
  {
      super(elem,loader,parent);
  }

  protected ConstructGeometry():Geometry
  {
    return this.gridGeometry=new CubeGeometry(this.Name);
  }

  beforeLoad()
  {
    super.beforeLoad();
  }




}

export=CubeGeometryNode
