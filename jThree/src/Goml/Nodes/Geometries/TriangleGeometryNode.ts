import GeometryNodeBase = require("./GeometryNodeBase");
import Vector3 = require("../../../Math/Vector3");
import Geometry = require("../../../Core/Geometries/Base/Geometry");
import TriangleGeometry = require("../../../Core/Geometries/TriangleGeometry");

class GomlTreeTriNode extends GeometryNodeBase {
  private geometry: TriangleGeometry;

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

  protected onMount(): void {
    super.onMount();
  }

  protected ConstructGeometry(name: string): Geometry {
    return this.geometry = new TriangleGeometry(name);
  }

  private _onFirstAttrChanged(attr): void {
    this.geometry.First = attr.Value;
  }
  private _onSecondAttrChanged(attr): void {
    this.geometry.Second = attr.Value;
  }
  private _onThirdAttrChanged(attr): void {
    this.geometry.Third = attr.Value;
  }
}

export = GomlTreeTriNode;
