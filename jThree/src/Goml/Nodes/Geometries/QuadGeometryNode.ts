import GeometryNodeBase = require("./GeometryNodeBase");
import Geometry = require("../../../Core/Geometries/Base/Geometry");
import QuadGeometry = require("../../../Core/Geometries/QuadGeometry");

class QuadGeometryNode extends GeometryNodeBase {
  private geometry: QuadGeometry;

  constructor() {
    super();
  }

  protected onMount(): void {
    super.onMount();
  }

  protected ConstructGeometry(name: string): Geometry {
    return this.geometry = new QuadGeometry(name);
  }
}

export = QuadGeometryNode;
