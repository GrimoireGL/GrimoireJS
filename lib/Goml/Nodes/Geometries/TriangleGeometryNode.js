import GeometryNodeBase from "./GeometryNodeBase";
import Vector3 from "../../../Math/Vector3";
import TriangleGeometry from "../../../Core/Geometries/TriangleGeometry";
class GomlTreeTriNode extends GeometryNodeBase {
    constructor() {
        super();
        this.attributes.defineAttribute({
            "first": {
                value: new Vector3(-1, 0, 0),
                converter: "vec3",
                onchanged: this._onFirstAttrChanged,
            },
            "second": {
                value: new Vector3(0, 1, 0),
                converter: "vec3",
                onchanged: this._onSecondAttrChanged,
            },
            "third": {
                value: new Vector3(1, 0, 0),
                converter: "vec3",
                onchanged: this._onThirdAttrChanged,
            },
        });
    }
    __onMount() {
        super.__onMount();
    }
    __constructGeometry(name) {
        return new TriangleGeometry(name);
    }
    _onFirstAttrChanged(attr) {
        this.target.First = attr.Value;
        attr.done();
    }
    _onSecondAttrChanged(attr) {
        this.target.Second = attr.Value;
        attr.done();
    }
    _onThirdAttrChanged(attr) {
        this.target.Third = attr.Value;
        attr.done();
    }
}
export default GomlTreeTriNode;
