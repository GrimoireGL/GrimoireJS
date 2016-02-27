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

  protected __onMount(): void {
    super.__onMount();
  }

  protected __constructGeometry(name: string): GridGeometry {
    return new GridGeometry(name);
  }

  private _onHdivAttrChanged(attr): void {
    this.target.HolizontalDivide = attr.Value;
    attr.done();
  }

  private _onVdivAttrChanged(attr): void {
    this.target.VerticalDivide = attr.Value;
    attr.done();
  }
}

export default GridGeometryNode;
