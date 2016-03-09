import ConeGeometry from "../../../Core/Geometries/ConeGeometry";
import GeometryNodeBase from "./GeometryNodeBase";
class ConeGeometryNode extends GeometryNodeBase {
    constructor() {
        super();
    }
    __onMount() {
        super.__onMount();
    }
    __constructGeometry(name) {
        return new ConeGeometry(name);
    }
}
export default ConeGeometryNode;
