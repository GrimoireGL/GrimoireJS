import GeometryNodeBase from "./GeometryNodeBase";
import Geometry from "../../../Core/Geometries/Base/Geometry";
import CubeGeometry from "../../../Core/Geometries/CubeGeometry";

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

export default CubeGeometryNode;
