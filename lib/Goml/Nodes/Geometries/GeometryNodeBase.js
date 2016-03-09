import CoreRelatedNodeBase from "../../CoreRelatedNodeBase";
import ContextComponents from "../../../ContextComponents";
import JThreeContext from "../../../JThreeContext";
/**
* Base class for managing geometry node.
*/
class GeometryNodeBase extends CoreRelatedNodeBase {
    constructor() {
        super();
        this.__groupPrefix = "geometry";
        this._primitiveRegistory = JThreeContext.getContextComponent(ContextComponents.PrimitiveRegistory);
        this.attributes.defineAttribute({
            "name": {
                value: undefined,
                converter: "string",
                onchanged: this._onNameAttrChanged.bind(this),
            }
        });
    }
    __onMount() {
        super.__onMount();
    }
    _onNameAttrChanged(attr) {
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
