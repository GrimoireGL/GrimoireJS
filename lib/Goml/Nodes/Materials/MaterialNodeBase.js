import CoreRelatedNodeBase from "../../CoreRelatedNodeBase";
import Color4 from "../../../Math/Color4";
import JThreeContext from "../../../JThreeContext";
import ContextComponents from "../../../ContextComponents";
import Vector3 from "../../../Math/Vector3";
import Vector2 from "../../../Math/Vector2";
class MaterialNodeBase extends CoreRelatedNodeBase {
    constructor() {
        super();
        this.__groupPrefix = "material";
        this._name = "";
        this.attributes.defineAttribute({
            "name": {
                value: undefined,
                converter: "string",
                onchanged: this._onNameAttrChanged,
            }
        });
    }
    __onMount() {
        super.__onMount();
    }
    /**
     * Construct material. This method must be overridden.
     * @return {Material} [description]
     */
    __setMaterial(material, callbackfn) {
        this.target = material;
        this.target.on("ready", () => {
            this._generateAttributeForPasses();
            this.nodeExport(this._name);
            callbackfn();
        });
    }
    get Material() {
        return this.target;
    }
    __getMaterialFromMatName(name) {
        return JThreeContext.getContextComponent(ContextComponents.MaterialManager).constructMaterial(name);
    }
    _onNameAttrChanged(attr) {
        const name = attr.Value;
        if (typeof name !== "string") {
            throw Error(`${this.getTypeName()}: name attribute must be required.`);
        }
        this._name = name;
        if (this.target && this.target.Initialized) {
            this.nodeExport(this._name);
        }
        attr.done();
    }
    _generateAttributeForPasses() {
        if (this.target["_passes"]) {
            let passes = this.target["_passes"];
            let passVariables = {};
            for (let i = 0; i < passes.length; i++) {
                const pass = passes[i];
                const uniforms = pass.programDescription.uniforms;
                for (let variableName in uniforms) {
                    if (variableName[0] === "_") {
                        continue; // Ignore system variables
                    }
                    if (!passVariables[variableName]) {
                        // When the pass variable are not found yet.
                        passVariables[variableName] = uniforms[variableName];
                    }
                    else {
                        // When the pass variable are already found.
                        if (passVariables[variableName] === uniforms[variableName]) {
                            continue; // When the variable was found and same type.(This is not matter)
                        }
                        else {
                            console.error("Material can not contain same variables even if these variable are included in different passes");
                        }
                    }
                }
            }
            let attributes = {};
            for (let variableName in passVariables) {
                const attribute = this._generateAttributeForVariable(variableName, passVariables[variableName]);
                if (attribute) {
                    attributes[variableName] = attribute;
                }
            }
            this.attributes.defineAttribute(attributes);
        }
    }
    _generateAttributeForVariable(variableName, variableInfo) {
        let converter;
        let initialValue;
        if (variableInfo.variableType === "vec2") {
            converter = "vec2";
            initialValue = Vector2.Zero;
        }
        if (variableInfo.variableType === "vec3") {
            converter = "color3";
            initialValue = Vector3.Zero;
        }
        if (variableInfo.variableType === "vec4") {
            converter = "color4"; // TODO add vector4 converter
            initialValue = new Color4(0, 0, 0, 1);
        }
        if (variableInfo.variableType === "float") {
            converter = "float"; // This should be float
            initialValue = 0.0;
        }
        if (variableInfo.variableType === "sampler2D") {
            return {
                converter: "string",
                value: "",
                onchanged: (attr) => {
                    if (attr.Value) {
                        this.nodeImport("jthree.resource.Texture2D", attr.Value, (node) => {
                            if (node) {
                                this.target.materialVariables[variableName] = node.target;
                                attr.done();
                            }
                            else {
                            }
                        });
                    }
                }
            };
        }
        if (variableInfo.variableType === "samplerCube") {
            return {
                converter: "string",
                value: "",
                onchanged: (attr) => {
                    if (attr.Value) {
                        this.nodeImport("jthree.resource.TextureCube", attr.Value, (node) => {
                            if (node) {
                                this.target.materialVariables[variableName] = node.target;
                                attr.done();
                            }
                            else {
                            }
                        });
                    }
                }
            };
        }
        if (!converter) {
            console.warn(`Variable forwarding for ${variableInfo.variableType} is not implemented yet. Attribute declaration of ${variableInfo.variableName} was skipped.`);
            return undefined;
        }
        return {
            converter: converter,
            value: initialValue,
            onchanged: (attr) => {
                this.target.materialVariables[variableName] = attr.Value;
                attr.done();
            }
        };
    }
}
export default MaterialNodeBase;
