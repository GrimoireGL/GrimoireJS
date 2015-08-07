import GeometryNodeBase = require("./GeometryNodeBase");
import GomlLoader = require("../../GomlLoader");
import GomlTreeNodeBase = require("../../GomlTreeNodeBase");
import Geometry = require("../../../Core/Geometries/Geometry");
import QuadGeometry = require("../../../Core/Geometries/QuadGeometry");

class QuadGeometryNode extends GeometryNodeBase
{
  private TriGeometry:QuadGeometry;

  constructor(elem: HTMLElement,loader:GomlLoader,parent:GomlTreeNodeBase)
  {
      super(elem,loader,parent);
  }

  protected ConstructGeometry():Geometry
  {
    return this.TriGeometry=new QuadGeometry(this.Name);
  }

    public beforeLoad()
  {
    super.beforeLoad();
  }
}

export=QuadGeometryNode;
