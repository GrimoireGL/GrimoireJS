import GeometryNodeBase from "./GeometryNodeBase";
import QuadGeometry from "../../../Core/Geometries/QuadGeometry";
class QuadGeometryNode extends GeometryNodeBase {
    constructor() {
        super();
    }
    __onMount() {
        super.__onMount();
    }
    __constructGeometry(name) {
        return new QuadGeometry(name);
    }
}
export default QuadGeometryNode;
