import ConeGeometry from "../../../Core/Geometries/ConeGeometry";
import GeometryNodeBase from "./GeometryNodeBase";

class ConeGeometryNode extends GeometryNodeBase<ConeGeometry> {
  constructor() {
    super();
  }

  protected __onMount(): void {
    super.__onMount();
  }

  protected __constructGeometry(name: string): ConeGeometry {
    return new ConeGeometry(name);
  }
}

export default ConeGeometryNode;
