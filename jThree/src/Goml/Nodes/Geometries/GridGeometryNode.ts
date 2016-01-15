import GeometryNodeBase = require("./GeometryNodeBase");
import Geometry = require("../../../Core/Geometries/Base/Geometry")
import GridGeometry = require("../../../Core/Geometries/GridGeometry");
import GomlTreeNodeBase = require("../../GomlTreeNodeBase");
class GridGeometryNode extends GeometryNodeBase {
  private geometry: GridGeometry;

  constructor() {
    super();
    this.attributes.defineAttribute({
      'hdiv': {
        value: 10,
        converter: 'float',
        onchanged: this._onHdivAttrChanged,
      },
      'vdiv': {
        value: 10,
        converter: 'float',
        onchanged: this._onVdivAttrChanged,
      }
    });
  }

  private _onHdivAttrChanged(attr): void {
    this.geometry.HolizontalDivide = attr.Value;
  }

  private _onVdivAttrChanged(attr): void {
    this.geometry.VerticalDivide = attr.Value;
  }

  protected ConstructGeometry(): Geometry {
    return this.geometry = new GridGeometry(this.Name);
  }

  protected onMount(): void {
    super.onMount();
  }

}

export = GridGeometryNode;
