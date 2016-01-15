import SphereGeometry = require("../../../Core/Geometries/SphereGeometry");
import GeometryNodeBase = require("./GeometryNodeBase");
import Geometry = require("../../../Core/Geometries/Base/Geometry")
import CubeGeometry = require("../../../Core/Geometries/CubeGeometry");
import GomlTreeNodeBase = require("../../GomlTreeNodeBase");

class CubeGeometryNode extends GeometryNodeBase {
  private geometry: Geometry;

  constructor() {
    super();
  }

  protected ConstructGeometry(): Geometry {
    return this.geometry = new SphereGeometry(this.Name);
  }

}

export = CubeGeometryNode;
