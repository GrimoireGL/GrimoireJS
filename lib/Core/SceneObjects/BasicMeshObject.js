import PrimaryBufferMaterial from "../Materials/Buffering/PrimaryBufferMaterial";
import Mesh from "./Mesh";
import HitAreaTestMaterial from "../Materials/Buffering/HitAreaMaterial";
import BasicMaterial from "../Materials/Base/BasicMaterial";
class BasicMeshObject extends Mesh {
    constructor(geometry, mat) {
        super(geometry, mat);
        this.addMaterial(new PrimaryBufferMaterial());
        this.addMaterial(new BasicMaterial(require("../Materials/BuiltIn/GBuffer/Depth.html")));
        this.addMaterial(new HitAreaTestMaterial());
    }
}
export default BasicMeshObject;
