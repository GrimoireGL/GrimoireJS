import PrimaryBufferMaterial from "../Materials/Buffering/PrimaryBufferMaterial";
import Geometry from "../Geometries/Base/Geometry";
import Material from "../Materials/Material";
import Mesh from "./Mesh";
import HitAreaTestMaterial from "../Materials/Buffering/HitAreaMaterial";
import BasicMaterial from "../Materials/Base/BasicMaterial";
class BasicMeshObject extends Mesh {
  constructor(geometry: Geometry, mat: Material) {
    super(geometry, mat);
    this.addMaterial(new PrimaryBufferMaterial());
    this.addMaterial(new BasicMaterial(require("../Materials/BuiltIn/GBuffer/Depth.html")));
    this.addMaterial(new HitAreaTestMaterial());
  }
}

export default BasicMeshObject;
