import SphereGeometry = require("../../../Core/Geometries/SphereGeometry");
import GeometryNodeBase = require("./GeometryNodeBase");
import Geometry = require("../../../Core/Geometries/Geometry")
import CubeGeometry = require("../../../Core/Geometries/CubeGeometry");
import GomlTreeNodeBase = require("../../GomlTreeNodeBase");

class CubeGeometryNode extends GeometryNodeBase {
  private gridGeometry: Geometry;

  constructor() {
    super();
  }

  protected ConstructGeometry(): Geometry {
    return this.gridGeometry = new SphereGeometry(this.Name);
  }

}

export = CubeGeometryNode;
