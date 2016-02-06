import ConeGeometry from "../../../Core/Geometries/ConeGeometry";
import GeometryNodeBase from "./GeometryNodeBase";

class ConeGeometryNode extends GeometryNodeBase<ConeGeometry> {
  constructor() {
    super();
  }

  protected onMount(): void {
    super.onMount();
  }

  protected ConstructGeometry(name: string): ConeGeometry {
    return new ConeGeometry(name);
  }
}

export default ConeGeometryNode;
