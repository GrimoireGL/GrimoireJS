import SphereGeometry from "../../../Core/Geometries/SphereGeometry";
import GeometryNodeBase from "./GeometryNodeBase";

class CubeGeometryNode extends GeometryNodeBase<SphereGeometry> {
  constructor() {
    super();
  }

  protected __onMount(): void {
    super.__onMount();
  }

  protected __constructGeometry(name: string): SphereGeometry {
    return new SphereGeometry(name);
  }

}

export default CubeGeometryNode;
