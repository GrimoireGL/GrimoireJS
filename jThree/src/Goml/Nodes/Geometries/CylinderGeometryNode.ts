import GeometryNodeBase from "./GeometryNodeBase";
import Geometry from "../../../Core/Geometries/Base/Geometry";
import CylinderGeometry from "../../../Core/Geometries/CylinderGeometry";

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

export default CylinderGeometryNode;
