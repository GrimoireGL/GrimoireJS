import GeometryNodeBase = require("./GeometryNodeBase");
import GomlTreeNodeBase = require("../../GomlTreeNodeBase");
import Geometry = require("../../../Core/Geometries/Geometry");
import QuadGeometry = require("../../../Core/Geometries/QuadGeometry");

class QuadGeometryNode extends GeometryNodeBase
{
  private TriGeometry:QuadGeometry;

  constructor(parent:GomlTreeNodeBase)
  {
      super(parent);
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
