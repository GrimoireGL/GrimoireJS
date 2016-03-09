import GeometryNodeBase from "./GeometryNodeBase";
import CylinderGeometry from "../../../Core/Geometries/CylinderGeometry";
class CylinderGeometryNode extends GeometryNodeBase {
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
        return new CylinderGeometry(name);
    }
    _onDivideAttrChanged(attr) {
        this.target.DivideCount = attr.Value;
        attr.done();
    }
}
export default CylinderGeometryNode;
