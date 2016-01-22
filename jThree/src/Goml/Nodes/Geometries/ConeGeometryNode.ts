import ConeGeometry = require("../../../Core/Geometries/ConeGeometry");
import GeometryNodeBase = require("./GeometryNodeBase");
import Geometry = require("../../../Core/Geometries/Base/Geometry");

class ConeGeometryNode extends GeometryNodeBase {
  constructor() {
    super();
  }

  protected onMount(): void {
    super.onMount();
  }

  protected ConstructGeometry(name: string): Geometry {
    return new ConeGeometry(name);
  }
}

export = ConeGeometryNode;
