import GeometryNodeBase from "./GeometryNodeBase";
import QuadGeometry from "../../../Core/Geometries/QuadGeometry";

class QuadGeometryNode extends GeometryNodeBase<QuadGeometry> {

  constructor() {
    super();
  }

  protected __onMount(): void {
    super.__onMount();
  }

  protected __constructGeometry(name: string): QuadGeometry {
    return new QuadGeometry(name);
  }
}

export default QuadGeometryNode;
