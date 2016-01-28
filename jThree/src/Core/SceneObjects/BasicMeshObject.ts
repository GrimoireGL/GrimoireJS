import PrimaryBufferMaterial = require("../Materials/Buffering/PrimaryBufferMaterial");
import Geometry = require("../Geometries/Base/Geometry");
import Material = require("../Materials/Material");
import Mesh = require("./Mesh");
import ShadowMapMaterial = require("../Materials/Buffering/ShadowMapMaterial");
import HitAreaTestMaterial = require("../Materials/Buffering/HitAreaMaterial");
class BasicMeshObject extends Mesh {
  constructor(geometry: Geometry, mat: Material) {
    super(geometry, mat);
    this.addMaterial(new PrimaryBufferMaterial());
    this.addMaterial(new ShadowMapMaterial());
    this.addMaterial(new HitAreaTestMaterial());
  }
}

export = BasicMeshObject;
