import GeometryNodeBase from "./GeometryNodeBase";
import CubeGeometry from "../../../Core/Geometries/CubeGeometry";
class CubeGeometryNode extends GeometryNodeBase {
    constructor() {
        super();
    }
    __onMount() {
        super.__onMount();
    }
    __constructGeometry(name) {
        return new CubeGeometry(name);
    }
}
export default CubeGeometryNode;
