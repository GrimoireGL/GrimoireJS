import GeometryNodeBase from "./GeometryNodeBase";
import CubeGeometry from "../../../Core/Geometries/CubeGeometry";

class CubeGeometryNode extends GeometryNodeBase<CubeGeometry> {
  constructor() {
    super();
  }

  protected __onMount(): void {
    super.__onMount();
  }

  protected __constructGeometry(name: string): CubeGeometry {
    return new CubeGeometry(name);
  }
}

export default CubeGeometryNode;
