import GeometryNodeBase = require("./GeometryNodeBase");
import Geometry = require("../../../Core/Geometries/Geometry")
import GridGeometry = require("../../../Core/Geometries/GridGeometry");
import GomlTreeNodeBase = require("../../GomlTreeNodeBase");
class GridGeometryNode extends GeometryNodeBase
{
  private gridGeometry:GridGeometry;

  constructor(parent:GomlTreeNodeBase)
  {
    super(parent);
    this.attributes.defineAttribute({
      'hdiv': {
        value: 10,
        converter: 'number',
        handler: (v) => {
          this.gridGeometry.HolizontalDivide = v.Value;
        },
      },
      'vdiv': {
        value: 10,
        converter: 'number',
        handler: (v) => {
          this.gridGeometry.VerticalDivide = v.Value;
        },
      }
    });
  }

  protected ConstructGeometry():Geometry
  {
    return this.gridGeometry=new GridGeometry(this.Name);
  }

  public beforeLoad()
  {
    super.beforeLoad();
  }

}

export=GridGeometryNode
