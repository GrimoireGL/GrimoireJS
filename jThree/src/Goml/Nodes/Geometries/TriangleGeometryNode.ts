import GeometryNodeBase = require("./GeometryNodeBase");
import GomlTreeNodeBase = require("../../GomlTreeNodeBase");
import Vector3 = require("../../../Math/Vector3");
import Geometry = require("../../../Core/Geometries/Geometry");
import TriangleGeometry = require("../../../Core/Geometries/TriangleGeometry");

class GomlTreeTriNode extends GeometryNodeBase {
  private TriGeometry: TriangleGeometry;

  constructor() {
    super();
    this.attributes.defineAttribute({
      'first': {
        value: new Vector3(-1, 0, 0),
        converter: 'vec3',
        onchanged: this._onFirstAttrChanged,
      },
      'second': {
        value: new Vector3(0, 1, 0),
        converter: 'vec3',
        onchanged: this._onSecondAttrChanged,
      },
      'third': {
        value: new Vector3(1, 0, 0),
        converter: 'vec3',
        onchanged: this._onThirdAttrChanged,
      },
    });
  }

  private _onFirstAttrChanged(attr): void {
    this.TriGeometry.First = attr.Value;
  }
  private _onSecondAttrChanged(attr): void {
    this.TriGeometry.Second = attr.Value;
  }
  private _onThirdAttrChanged(attr): void {
    this.TriGeometry.Third = attr.Value;
  }

  protected ConstructGeometry(): Geometry {
    return this.TriGeometry = new TriangleGeometry(this.Name);
  }



}

export = GomlTreeTriNode;
