import GeometryNodeBase = require("./GeometryNodeBase");
import Geometry = require("../../../Core/Geometries/Geometry")
import GridGeometry = require("../../../Core/Geometries/GridGeometry");
import GomlTreeNodeBase = require("../../GomlTreeNodeBase");
class GridGeometryNode extends GeometryNodeBase {
  private gridGeometry: GridGeometry;

  constructor() {
    super();
    this.attributes.defineAttribute({
      'hdiv': {
        value: 10,
        converter: 'number',
        onchanged: this._onHdivAttrChanged,
      },
      'vdiv': {
        value: 10,
        converter: 'number',
        onchanged: this._onVdivAttrChanged,
      }
    });
  }

  private _onHdivAttrChanged(attr): void {
    this.gridGeometry.HolizontalDivide = attr.Value;
  }

  private _onVdivAttrChanged(attr): void {
    this.gridGeometry.VerticalDivide = attr.Value;
  }

  protected ConstructGeometry(): Geometry {
    return this.gridGeometry = new GridGeometry(this.Name);
  }

  protected nodeDidMounted() {
    super.nodeDidMounted();
  }

}

export = GridGeometryNode;
