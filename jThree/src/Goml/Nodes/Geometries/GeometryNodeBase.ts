import CoreRelatedNodeBase from "../../CoreRelatedNodeBase";
import Geometry from "../../../Core/Geometries/Base/Geometry";
import GomlAttribute from "../../GomlAttribute";
/**
* Base class for managing geometry node.
*/
class GeometryNodeBase<T extends Geometry> extends CoreRelatedNodeBase<T> {
  protected groupPrefix: string = "geometry";

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


  protected onMount(): void {
    super.onMount();
  }

  /**
  * Generate geometry instance for the geometry.
  * This methods must be overridden.
  */
  protected ConstructGeometry(name: string): T {
    return null;
  }

  private _onNameAttrChanged(attr: GomlAttribute): void {
    const name = attr.Value;
    if (typeof name !== "string") {
      throw Error(`${this.getTypeName()}: name attribute must be required.`);
    }
    this.target = this.ConstructGeometry(attr.Value);
    this.nodeExport(name);
  }
}
export default GeometryNodeBase;
