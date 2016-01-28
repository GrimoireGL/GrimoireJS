import GomlTreeNodeBase from "../../GomlTreeNodeBase";
import Geometry from "../../../Core/Geometries/Base/Geometry";
import GomlAttribute from "../../GomlAttribute";
/**
* Base class for managing geometry node.
*/
class GeometryNodeBase extends GomlTreeNodeBase {
  protected groupPrefix: string = "geometry";

  private targetGeometry: Geometry;

  constructor() {
    super();
    this.attributes.defineAttribute({
      "name": {
        value: undefined,
        converter: "string",
        onchanged: this._onNameAttrChanged.bind(this),
      }
    });
  }

  /**
  * The geometry this node managing.
  */
  public get TargetGeometry(): Geometry {
    return this.targetGeometry;
  }

  protected onMount(): void {
    super.onMount();
  }

  /**
  * Generate geometry instance for the geometry.
  * This methods must be overridden.
  */
  protected ConstructGeometry(name: string): Geometry {
    return null;
  }

  private _onNameAttrChanged(attr: GomlAttribute): void {
    const name = attr.Value;
    if (typeof name !== "string") {
      throw Error(`${this.getTypeName()}: name attribute must be required.`);
    }
    this.targetGeometry = this.ConstructGeometry(attr.Value);
    this.nodeExport(name);
  }
}
export default GeometryNodeBase;
