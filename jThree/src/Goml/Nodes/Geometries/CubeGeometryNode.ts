import GeometryNodeBase = require("./GeometryNodeBase");
import Geometry = require("../../../Core/Geometries/Geometry")
import CubeGeometry = require("../../../Core/Geometries/CubeGeometry");
import GomlTreeNodeBase = require("../../GomlTreeNodeBase");

class CubeGeometryNode extends GeometryNodeBase {
  private geometry: Geometry;

  constructor() {
    super();
  }

  protected ConstructGeometry(): Geometry {
    return this.geometry = new CubeGeometry(this.Name);
  }

}

export = CubeGeometryNode;
