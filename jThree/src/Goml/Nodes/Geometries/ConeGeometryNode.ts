import ConeGeometry = require("../../../Core/Geometries/ConeGeometry");
import GeometryNodeBase = require("./GeometryNodeBase");
import Geometry = require("../../../Core/Geometries/Geometry")
import CubeGeometry = require("../../../Core/Geometries/CubeGeometry");
import GomlTreeNodeBase = require("../../GomlTreeNodeBase");

class ConeGeometryNode extends GeometryNodeBase {
  private geometry: Geometry;

  constructor() {
    super();
  }

  protected ConstructGeometry(): Geometry {
    return this.geometry = new ConeGeometry(this.Name);
  }

}

export = ConeGeometryNode;
