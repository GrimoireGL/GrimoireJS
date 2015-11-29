import GeometryNodeBase = require("./GeometryNodeBase");
import Geometry = require("../../../Core/Geometries/Geometry")
import CircleGeometry = require("../../../Core/Geometries/CircleGeometry");
import GomlTreeNodeBase = require("../../GomlTreeNodeBase");
class CircleGeometryNode extends GeometryNodeBase
{
  private gridGeometry:CircleGeometry;

  constructor(parent:GomlTreeNodeBase)
  {
      super(parent);
      this.attributes.defineAttribute
      (
        {
          "divide":
          {
            value:30,
            converter:"integer",
            handler:(v)=>{this.gridGeometry.DiviceCount=v.Value;}
          }
        }
      );
  }

  protected ConstructGeometry():Geometry
  {
    this.gridGeometry=new CircleGeometry(this.Name);
    return this.gridGeometry;
  }

    public beforeLoad()
  {
    super.beforeLoad();
  }

}

export=CircleGeometryNode
