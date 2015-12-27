import GeometryNodeBase = require("./GeometryNodeBase");
import Geometry = require("../../../Core/Geometries/Geometry")
import CylinderGeometry = require("../../../Core/Geometries/CylinderGeometry");
import GomlTreeNodeBase = require("../../GomlTreeNodeBase");
class CylinderGeometryNode extends GeometryNodeBase {
  private gridGeometry: CylinderGeometry;

  constructor() {
    super();
    this.attributes.defineAttribute({
      "divide": {
        value: 30,
        converter: "int",
        onchanged: this._onDivideAttrChanged,
      }
    });
  }

  private _onDivideAttrChanged(attr): void {
    this.gridGeometry.DivideCount = attr.Value;
  }

  protected ConstructGeometry(): Geometry {
    return this.gridGeometry = new CylinderGeometry(this.Name);
  }

  protected onMount() {
    super.onMount();
    this.gridGeometry.DivideCount = this.attributes.getValue("divide");
  }

}

export = CylinderGeometryNode;
