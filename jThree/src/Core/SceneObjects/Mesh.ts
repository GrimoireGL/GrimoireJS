import SceneObject = require("../SceneObjects/SceneObject");
import Geometry = require("../Geometries/Base/Geometry");
import Material = require("../Materials/Material");

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

export = Mesh;
