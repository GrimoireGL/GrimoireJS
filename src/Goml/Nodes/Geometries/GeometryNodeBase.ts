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
  protected __groupPrefix: string = "geometry";

  private _name: string;

  private _primitiveRegistory: PrimitiveRegistory = JThreeContext.getContextComponent<PrimitiveRegistory>(ContextComponents.PrimitiveRegistory);

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

  protected __onMount(): void {
    super.__onMount();
  }

  protected abstract __constructGeometry(name: string): any;

  private _onNameAttrChanged(attr: GomlAttribute): void {
    const name = attr.Value;
    if (typeof name !== "string") {
      throw Error(`${this.getTypeName()}: name attribute must be required.`);
    }
    if (this._name !== name) {
      if (typeof this._name !== "undefined" && this._primitiveRegistory.getPrimitive(this._name)) {
        this._primitiveRegistory.deregisterPrimitive(this._name);
      }
      this._name = name;
      this.target = this.__constructGeometry(this._name);
      if (this.target) {
        this._primitiveRegistory.registerPrimitive(this._name, this.target);
        console.log("registered", this._name);
        this.nodeExport(this._name);
      }
    }
    attr.done();
  }
}
export default GeometryNodeBase;
