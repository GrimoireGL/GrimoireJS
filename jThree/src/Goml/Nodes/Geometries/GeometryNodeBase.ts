import CoreRelatedNodeBase from "../../CoreRelatedNodeBase";
import Geometry from "../../../Core/Geometries/Base/Geometry";
import GomlAttribute from "../../GomlAttribute";
import ContextComponents from "../../../ContextComponents";
import PrimitiveRegistory from "../../../Core/Geometries/Base/PrimitiveRegistory";
import JThreeContext from "../../../JThreeContext";
/**
* Base class for managing geometry node.
*/
abstract class GeometryNodeBase<T extends Geometry> extends CoreRelatedNodeBase<T> {
  protected groupPrefix: string = "geometry";

  private name: string;

  private primitiveRegistory: PrimitiveRegistory = JThreeContext.getContextComponent<PrimitiveRegistory>(ContextComponents.PrimitiveRegistory);

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

  protected abstract constructGeometry(name: string);

  private _onNameAttrChanged(attr: GomlAttribute): void {
    const name = attr.Value;
    if (typeof name !== "string") {
      throw Error(`${this.getTypeName()}: name attribute must be required.`);
    }
    if (this.name !== name) {
      if (typeof this.name !== "undefined" && this.primitiveRegistory.getPrimitive(this.name)) {
        this.primitiveRegistory.deregisterPrimitive(this.name);
      }
      this.name = name;
      this.target = this.constructGeometry(this.name);
      if (this.target) {
        this.primitiveRegistory.registerPrimitive(this.name, this.target);
        console.log("registered", this.name);
        this.nodeExport(this.name);
      }
    }
  }
}
export default GeometryNodeBase;
