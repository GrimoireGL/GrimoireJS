import GeometryNodeBase from "./GeometryNodeBase";
import GridGeometry from "../../../Core/Geometries/GridGeometry";

class GridGeometryNode extends GeometryNodeBase<GridGeometry> {

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

  protected constructGeometry(name: string): GridGeometry {
    return new GridGeometry(name);
  }

  private _onHdivAttrChanged(attr): void {
    this.target.HolizontalDivide = attr.Value;
  }

  private _onVdivAttrChanged(attr): void {
    this.target.VerticalDivide = attr.Value;
  }
}

export default GridGeometryNode;
