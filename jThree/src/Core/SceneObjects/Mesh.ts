import SceneObject from "../SceneObjects/SceneObject";
import Geometry from "../Geometries/Base/Geometry";
import Material from "../Materials/Material";

class Mesh extends SceneObject {
  constructor(geometry: Geometry, mat: Material) {
    super();
    if (mat) {
      this.addMaterial(mat);
    }
    if (geometry) {
      this.geometry = geometry;
    }
  }
}

export default Mesh;
