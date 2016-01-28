import GeometryNodeBase = require("./GeometryNodeBase");
import Geometry = require("../../../Core/Geometries/Base/Geometry");
import GridGeometry = require("../../../Core/Geometries/GridGeometry");

class GridGeometryNode extends GeometryNodeBase {
  private geometry: GridGeometry;

  constructor() {
    super();
    this.attributes.defineAttribute({
      "hdiv": {
        value: 10,
        converter: "float",
        onchanged: this._onHdivAttrChanged,
      },
      "vdiv": {
        value: 10,
        converter: "float",
        onchanged: this._onVdivAttrChanged,
      }
    });
  }

  protected onMount(): void {
    super.onMount();
  }

  protected ConstructGeometry(name: string): Geometry {
    return this.geometry = new GridGeometry(name);
  }

  private _onHdivAttrChanged(attr): void {
    this.geometry.HolizontalDivide = attr.Value;
  }

  private _onVdivAttrChanged(attr): void {
    this.geometry.VerticalDivide = attr.Value;
  }
}

export = GridGeometryNode;
