import ConeGeometry from "../../../Core/Geometries/ConeGeometry";
import GeometryNodeBase from "./GeometryNodeBase";
import Geometry from "../../../Core/Geometries/Base/Geometry";

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

export default ConeGeometryNode;
