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
        converter: 'vector3',
      },
      'second': {
        value: new Vector3(0, 1, 0),
        converter: 'vector3',
      },
      'third': {
        value: new Vector3(1, 0, 0),
        converter: 'vector3',
      },
    });
    this.attributes.getAttribute('first').on('changed', this._onFirstAttrChanged.bind(this));
    this.attributes.getAttribute('second').on('changed', this._onSecondAttrChanged.bind(this));
    this.attributes.getAttribute('third').on('changed', this._onThirdAttrChanged.bind(this));
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

  public beforeLoad() {
    super.beforeLoad();
  }

}

export = GomlTreeTriNode;
