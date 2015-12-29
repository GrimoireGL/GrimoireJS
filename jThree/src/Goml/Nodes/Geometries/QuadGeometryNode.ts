import GeometryNodeBase = require("./GeometryNodeBase");
import GomlTreeNodeBase = require("../../GomlTreeNodeBase");
import Geometry = require("../../../Core/Geometries/Geometry");
import QuadGeometry = require("../../../Core/Geometries/QuadGeometry");

class QuadGeometryNode extends GeometryNodeBase {
  private TriGeometry: QuadGeometry;

  constructor() {
    super();
  }

  protected ConstructGeometry(): Geometry {
    return this.TriGeometry = new QuadGeometry(this.Name);
  }



}

export = QuadGeometryNode;
