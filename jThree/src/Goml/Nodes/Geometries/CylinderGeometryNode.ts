import GeometryNodeBase from "./GeometryNodeBase";
import CylinderGeometry from "../../../Core/Geometries/CylinderGeometry";

class CylinderGeometryNode extends GeometryNodeBase<CylinderGeometry> {

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
  }

  protected constructGeometry(name: string): CylinderGeometry {
    return  new CylinderGeometry(name);
  }

  private _onDivideAttrChanged(attr): void {
    this.target.DivideCount = attr.Value;
    attr.done();
  }
}

export default CylinderGeometryNode;
