import GeometryNodeBase from "./GeometryNodeBase";
import Vector3 from "../../../Math/Vector3";
import TriangleGeometry from "../../../Core/Geometries/TriangleGeometry";

class GomlTreeTriNode extends GeometryNodeBase<TriangleGeometry> {

  constructor() {
    super();
    this.attributes.defineAttribute({
      "first": {
        value: new Vector3(-1, 0, 0),
        converter: "vec3",
        onchanged: this._onFirstAttrChanged,
      },
      "second": {
        value: new Vector3(0, 1, 0),
        converter: "vec3",
        onchanged: this._onSecondAttrChanged,
      },
      "third": {
        value: new Vector3(1, 0, 0),
        converter: "vec3",
        onchanged: this._onThirdAttrChanged,
      },
    });
  }

  protected __onMount(): void {
    super.__onMount();
  }

  protected __constructGeometry(name: string): TriangleGeometry {
    return new TriangleGeometry(name);
  }

  private _onFirstAttrChanged(attr): void {
    this.target.First = attr.Value;
    attr.done();
  }
  private _onSecondAttrChanged(attr): void {
    this.target.Second = attr.Value;
    attr.done();
  }
  private _onThirdAttrChanged(attr): void {
    this.target.Third = attr.Value;
    attr.done();
  }
}

export default GomlTreeTriNode;
