import SphereGeometry from "../../../Core/Geometries/SphereGeometry";
import GeometryNodeBase from "./GeometryNodeBase";

class CubeGeometryNode extends GeometryNodeBase<SphereGeometry> {
  constructor() {
    super();
  }

  protected onMount(): void {
    super.onMount();
  }

  protected ConstructGeometry(name: string): SphereGeometry {
    return new SphereGeometry(name);
  }

}

export default CubeGeometryNode;
