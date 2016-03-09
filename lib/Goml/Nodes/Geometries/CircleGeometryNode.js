import GeometryNodeBase from "./GeometryNodeBase";
import CircleGeometry from "../../../Core/Geometries/CircleGeometry";
class CircleGeometryNode extends GeometryNodeBase {
    constructor() {
        super();
        this.attributes.defineAttribute({
            "divide": {
                value: 30,
                converter: "int",
                onchanged: this._onDivideAttrChanged,
            }
        });
    }
    __onMount() {
        super.__onMount();
    }
    __constructGeometry(name) {
        return new CircleGeometry(name);
    }
    _onDivideAttrChanged(attr) {
        this.target.DiviceCount = attr.Value;
        attr.done();
    }
}
export default CircleGeometryNode;
