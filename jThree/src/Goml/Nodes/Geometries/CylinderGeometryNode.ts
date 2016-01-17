import GeometryNodeBase = require("./GeometryNodeBase");
import Geometry = require("../../../Core/Geometries/Base/Geometry")
import CylinderGeometry = require("../../../Core/Geometries/CylinderGeometry");
import GomlTreeNodeBase = require("../../GomlTreeNodeBase");
class CylinderGeometryNode extends GeometryNodeBase {
  private geometry: CylinderGeometry;

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
    this.geometry.DivideCount = attr.Value;
  }

  protected ConstructGeometry(): Geometry {
    return this.geometry = new CylinderGeometry(this.Name);
  }

  protected onMount() {
    super.onMount();
    this.geometry.DivideCount = this.attributes.getValue("divide");
  }

}

export = CylinderGeometryNode;
