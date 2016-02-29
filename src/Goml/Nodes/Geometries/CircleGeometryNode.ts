import GeometryNodeBase from "./GeometryNodeBase";
import CircleGeometry from "../../../Core/Geometries/CircleGeometry";
import GomlAttribute from "../../GomlAttribute";

class CircleGeometryNode extends GeometryNodeBase<CircleGeometry> {
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

  protected __onMount(): void {
    super.__onMount();
  }

  protected __constructGeometry(name: string): CircleGeometry {
    return new CircleGeometry(name);
  }

  private _onDivideAttrChanged(attr: GomlAttribute): void {
    this.target.DiviceCount = attr.Value;
    attr.done();
  }
}

export default CircleGeometryNode;
