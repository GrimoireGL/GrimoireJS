import GeometryNodeBase = require("./GeometryNodeBase");
import Geometry = require("../../../Core/Geometries/Base/Geometry");
import CubeGeometry = require("../../../Core/Geometries/CubeGeometry");

class CubeGeometryNode extends GeometryNodeBase {
  constructor() {
    super();
  }

  protected onMount(): void {
    super.onMount();
  }

  protected ConstructGeometry(name: string): Geometry {
    return new CubeGeometry(name);
  }
}

export = CubeGeometryNode;
