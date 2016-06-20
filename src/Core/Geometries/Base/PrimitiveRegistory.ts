import NamedValue from "../../../Base/NamedValue";
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
  private _primitives: NamedValue<Geometry> = {};

  public getContextComponentIndex(): number {
    return ContextComponents.PrimitiveRegistory;
  }

  public registerDefaultPrimitives(): void {
    this.registerPrimitive("quad", new QuadGeometry("quad"));
    this.registerPrimitive("sphere", new SphereGeometry("sphere"));
    this.registerPrimitive("cube", new CubeGeometry("cube"));
    this.registerPrimitive("cylinder", new CylinderGeometry("cylinder"));
    this.registerPrimitive("cone", new ConeGeometry("cone"));
  }

  public registerPrimitive(key: string, geo: Geometry): void {
    this._primitives[key] = geo;
  }

  public deregisterPrimitive(key: string): void {
    delete this._primitives[key];
  }

  public getPrimitive(key: string): Geometry {
    return this._primitives[key];
  }
}
export default PrimitiveRegistory;
