import GeometryNodeBase = require("./GeometryNodeBase");
import Geometry = require("../../../Core/Geometries/Base/Geometry");
import CylinderGeometry = require("../../../Core/Geometries/CylinderGeometry");

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

  protected onMount() {
    super.onMount();
    this.geometry.DivideCount = this.attributes.getValue("divide");
  }

  protected ConstructGeometry(name: string): Geometry {
    return this.geometry = new CylinderGeometry(name);
  }

  private _onDivideAttrChanged(attr): void {
    this.geometry.DivideCount = attr.Value;
  }
}

export = CylinderGeometryNode;
