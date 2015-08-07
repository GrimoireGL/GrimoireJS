import GeometryNodeBase = require("./GeometryNodeBase");
import GomlLoader = require("../../GomlLoader");
import Geometry = require("../../../Core/Geometries/Geometry")
import CylinderGeometry = require("../../../Core/Geometries/CylinderGeometry");
import GomlTreeNodeBase = require("../../GomlTreeNodeBase");
class CylinderGeometryNode extends GeometryNodeBase
{
  private gridGeometry:CylinderGeometry;

  constructor(elem: HTMLElement,loader:GomlLoader,parent:GomlTreeNodeBase)
  {
      super(elem,loader,parent);
      this.attributes.defineAttribute
      (
        {
          "divide":
          {
            value:30,
            converter:"integer",
            handler:(v)=>{this.gridGeometry.DivideCount=v.Value;}
          }
        }
      );
  }

  protected ConstructGeometry():Geometry
  {
    return this.gridGeometry=new CylinderGeometry(this.Name);
  }

    public beforeLoad()
  {
    super.beforeLoad();
    this.gridGeometry.DivideCount=this.attributes.getValue("divide");
  }




}

export=CylinderGeometryNode;
