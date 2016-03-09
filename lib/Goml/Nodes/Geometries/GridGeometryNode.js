import GeometryNodeBase from "./GeometryNodeBase";
import GridGeometry from "../../../Core/Geometries/GridGeometry";
class GridGeometryNode extends GeometryNodeBase {
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
    __onMount() {
        super.__onMount();
    }
    __constructGeometry(name) {
        return new GridGeometry(name);
    }
    _onHdivAttrChanged(attr) {
        this.target.HolizontalDivide = attr.Value;
        attr.done();
    }
    _onVdivAttrChanged(attr) {
        this.target.VerticalDivide = attr.Value;
        attr.done();
    }
}
export default GridGeometryNode;
