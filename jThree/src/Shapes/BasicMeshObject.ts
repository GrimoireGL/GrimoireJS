import PrimaryBufferMaterial = require("../Core/Materials/Buffering/PrimaryBufferMaterial");
import BasicMaterial = require("../Core/Materials/Base/BasicMaterial");
import Geometry = require("../Core/Geometries/Base/Geometry");
import Material = require("../Core/Materials/Material");
import Mesh = require('./Mesh');
import ShadowMapMaterial = require("../Core/Materials/Buffering/ShadowMapMaterial");
import HitAreaTestMaterial = require("../Core/Materials/Buffering/HitAreaMaterial");
class BasicMeshObject extends Mesh {
  constructor(geometry: Geometry, mat: Material) {
    super(geometry, mat);
    this.addMaterial(new PrimaryBufferMaterial());
    this.addMaterial(new ShadowMapMaterial());
    this.addMaterial(new HitAreaTestMaterial());
  }
}

export = BasicMeshObject;
