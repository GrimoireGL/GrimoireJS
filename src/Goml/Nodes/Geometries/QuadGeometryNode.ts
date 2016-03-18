import GeometryNodeBase from "./GeometryNodeBase";
import QuadGeometry from "../../../Core/Geometries/QuadGeometry";

class QuadGeometryNode extends GeometryNodeBase<QuadGeometry> {

  constructor() {
    super();
    this.attributes.defineAttribute({
      "divx": {
        value: 1,
        converter: "int",
        onchanged: (v) => {
          if (v.Value > 0) {
            this.target.DivX = v.Value;
          }
          v.done();
        }
      },
      "divy": {
        value: 1,
        converter: "int",
        onchanged: (v) => {
          if (v.Value > 0) {
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

  protected __constructGeometry(name: string): QuadGeometry {
  return new QuadGeometry(name);
}
}

export default QuadGeometryNode;
