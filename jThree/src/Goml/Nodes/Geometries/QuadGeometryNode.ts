import GeometryNodeBase from "./GeometryNodeBase";
import QuadGeometry from "../../../Core/Geometries/QuadGeometry";

class QuadGeometryNode extends GeometryNodeBase<QuadGeometry> {

  constructor() {
    super();
  }

  protected onMount(): void {
    super.onMount();
  }

  protected ConstructGeometry(name: string): QuadGeometry {
    return new QuadGeometry(name);
  }
}

export default QuadGeometryNode;
