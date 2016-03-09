import SphereGeometry from "../../../Core/Geometries/SphereGeometry";
import GeometryNodeBase from "./GeometryNodeBase";
class CubeGeometryNode extends GeometryNodeBase {
    constructor() {
        super();
    }
    __onMount() {
        super.__onMount();
    }
    __constructGeometry(name) {
        return new SphereGeometry(name);
    }
}
export default CubeGeometryNode;
