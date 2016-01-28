import GeometryNodeBase from "./GeometryNodeBase";
import Geometry from "../../../Core/Geometries/Base/Geometry";
import QuadGeometry from "../../../Core/Geometries/QuadGeometry";

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

export default QuadGeometryNode;
