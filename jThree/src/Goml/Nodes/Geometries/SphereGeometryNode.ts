import SphereGeometry from "../../../Core/Geometries/SphereGeometry";
import GeometryNodeBase from "./GeometryNodeBase";
import Geometry from "../../../Core/Geometries/Base/Geometry";

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

export default CubeGeometryNode;
