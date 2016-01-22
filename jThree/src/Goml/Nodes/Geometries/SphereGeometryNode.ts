import SphereGeometry = require("../../../Core/Geometries/SphereGeometry");
import GeometryNodeBase = require("./GeometryNodeBase");
import Geometry = require("../../../Core/Geometries/Base/Geometry");

class CubeGeometryNode extends GeometryNodeBase {
  constructor() {
    super();
  }

  protected onMount(): void {
    super.onMount();
  }

  protected ConstructGeometry(name: string): Geometry {
    return new SphereGeometry(name);
  }

}

export = CubeGeometryNode;
