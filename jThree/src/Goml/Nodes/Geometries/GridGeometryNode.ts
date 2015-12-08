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
      },
      'vdiv': {
        value: 10,
        converter: 'number',
      }
    });
    this.attributes.getAttribute('hdiv').on('changed', this._onHdivAttrChanged.bind(this));
    this.attributes.getAttribute('vdiv').on('changed', this._onVdivAttrChanged.bind(this));
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

  public beforeLoad() {
    super.beforeLoad();
  }

}

export = GridGeometryNode;
