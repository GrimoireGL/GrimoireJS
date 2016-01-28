import ConeGeometry from "../ConeGeometry";
import CylinderGeometry from "../CylinderGeometry";
import CubeGeometry from "../CubeGeometry";
import SphereGeometry from "../SphereGeometry";
import QuadGeometry from "../QuadGeometry";
import Geometry from "./Geometry";
import ContextComponents from "../../../ContextComponents";
import IContextComponent from "../../../IContextComponent";
class PrimitiveRegistory implements IContextComponent {
  /**
   * Registered primitives
   */
  private _primitives: { [primitiveName: string]: Geometry } = {};

  public getContextComponentIndex(): number {
    return ContextComponents.PrimitiveRegistory;
  }

  public registerDefaultPrimitives(): void {
    this.addPrimitive("quad", new QuadGeometry("quad"));
    this.addPrimitive("sphere", new SphereGeometry("sphere"));
    this.addPrimitive("cube", new CubeGeometry("cube"));
    this.addPrimitive("cylinder", new CylinderGeometry("cylinder"));
    this.addPrimitive("cone", new ConeGeometry("cone"));
  }

  public addPrimitive(key: string, geo: Geometry): void {
    if (this._primitives[key]) {
      console.warn(`The geometry '${key}' is already assigned. The old geometry will be replaced, this might lead some bug.`);
    }
    this._primitives[key] = geo;
  }

  public getPrimitive(key: string): Geometry {
    return this._primitives[key];
  }
}
export default PrimitiveRegistory;
