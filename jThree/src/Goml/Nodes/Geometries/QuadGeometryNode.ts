import GeometryNodeBase = require("./GeometryNodeBase");
import GomlTreeNodeBase = require("../../GomlTreeNodeBase");
import Geometry = require("../../../Core/Geometries/Base/Geometry");
import QuadGeometry = require("../../../Core/Geometries/QuadGeometry");

class QuadGeometryNode extends GeometryNodeBase {
  private geometry: QuadGeometry;

  constructor() {
    super();
  }

  protected ConstructGeometry(): Geometry {
    return this.geometry = new QuadGeometry(this.Name);
  }



}

export = QuadGeometryNode;
