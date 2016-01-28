import PrimaryBufferMaterial from "../Materials/Buffering/PrimaryBufferMaterial";
import Geometry from "../Geometries/Base/Geometry";
import Material from "../Materials/Material";
import Mesh from "./Mesh";
import ShadowMapMaterial from "../Materials/Buffering/ShadowMapMaterial";
import HitAreaTestMaterial from "../Materials/Buffering/HitAreaMaterial";
class BasicMeshObject extends Mesh {
  constructor(geometry: Geometry, mat: Material) {
    super(geometry, mat);
    this.addMaterial(new PrimaryBufferMaterial());
    this.addMaterial(new ShadowMapMaterial());
    this.addMaterial(new HitAreaTestMaterial());
  }
}

export default BasicMeshObject;
