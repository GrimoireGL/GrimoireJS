import Material from "../Material";
import ContextComponents from "../../../ContextComponents";
import JThreeContext from "../../../JThreeContext";
import MaterialPass from "./MaterialPass";
import Q from "q";
class BasicMaterial extends Material {
    constructor(sourceString, name) {
        super();
        this._passes = [];
        this._uniformRegisters = [];
        this._passCount = 0;
        this._parseMaterialDocument(sourceString, name);
    }
    /**
  * Apply configuration of program.
  * This is used for passing variables,using programs,binding index buffer.
  */
    apply(matArg) {
        if (!this.Initialized) {
            return;
        }
        super.apply(matArg);
        const targetPass = this._passes[matArg.passIndex];
        targetPass.apply(matArg, this._uniformRegisters, this);
    }
    /**
    * Should return how many times required to render this material.
    * If you render some of model with edge,it can be 2 or greater.
    * Because it needs rendering edge first,then rendering forward shading.
    */
    getPassCount(techniqueIndex) {
        return this._passCount;
    }
    get MaterialGroup() {
        return this._materialGroup;
    }
    _parseMaterialDocument(source, name) {
        const xmml = (new DOMParser()).parseFromString(source, "text/xml");
        this._materialName = xmml.querySelector("material").getAttribute("name");
        this._materialGroup = xmml.querySelector("material").getAttribute("group");
        if (!this._materialName && !name) {
            console.error("Material name must be specified");
        }
        this._materialName = this._materialName || name;
        this._initializeUniformRegisters(xmml);
        this._parsePasses(xmml).then(() => {
            this.__setLoaded();
        });
    }
    _parsePasses(doc) {
        const passes = doc.querySelectorAll("material > passes > pass");
        for (let i = 0; i < passes.length; i++) {
            const pass = passes.item(i);
            this._passes.push(new MaterialPass(this, pass, this._materialName, i));
        }
        this._passCount = passes.length;
        return Q.all(this._passes.map(e => e.initialize(this._uniformRegisters)));
    }
    _initializeUniformRegisters(doc) {
        const registersDOM = doc.querySelectorAll("material > uniform-register > register");
        for (let i = 0; i < registersDOM.length; i++) {
            const registerDOM = registersDOM.item(i);
            const registererConstructor = this._materialManager.getUniformRegister(registerDOM.attributes.getNamedItem("name").value);
            if (!registererConstructor) {
                continue;
            }
            this._uniformRegisters.push(new registererConstructor());
        }
    }
    get _materialManager() {
        return JThreeContext.getContextComponent(ContextComponents.MaterialManager);
    }
}
export default BasicMaterial;
