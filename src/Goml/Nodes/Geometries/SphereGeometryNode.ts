import SphereGeometry from "../../../Core/Geometries/SphereGeometry";
import GeometryNodeBase from "./GeometryNodeBase";

class CubeGeometryNode extends GeometryNodeBase<SphereGeometry> {
  constructor() {
    super();
    this.attributes.defineAttribute({
      "divx": {
        value: 20,
        converter: "int",
        onchanged: (v) => {
          if (v.Value > 1.0) {
           this.target.DivX = v.Value;
          }
          v.done();
        }
      },
      "divy": {
        value: 20,
        converter: "int",
        onchanged: (v) => {
          if (v.Value > 1.0) {
           this.target.DivY = v.Value;
          }
          v.done();
        }
      }
    });
  }

  protected __onMount(): void {
    super.__onMount();
  }

  protected __constructGeometry(name: string): SphereGeometry {
    return new SphereGeometry(name);
  }

}

export default CubeGeometryNode;
