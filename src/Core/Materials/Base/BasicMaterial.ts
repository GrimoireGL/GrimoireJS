import BasicRegisterer from "./Registerer/BasicRegisterer";
import Material from "../Material";
import ContextComponents from "../../../ContextComponents";
import JThreeContext from "../../../JThreeContext";
import MaterialManager from "./MaterialManager";
import MaterialPass from "./MaterialPass";
import IApplyMaterialArgument from "./IApplyMaterialArgument";
import Q from "q";
class BasicMaterial extends Material {
  private _passes: MaterialPass[] = [];

  private _uniformRegisters: BasicRegisterer[] = [];

  private _materialGroup: string;

  private _materialName: string;

  private _passCount: number = 0;

  constructor(sourceString: string, name?: string) {
    super();
    this._parseMaterialDocument(sourceString, name);
  }

  /**
* Apply configuration of program.
* This is used for passing variables,using programs,binding index buffer.
*/
  public apply(matArg: IApplyMaterialArgument): void {
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
  public getPassCount(techniqueIndex: number): number {
    return this._passCount;
  }

  public get MaterialGroup() {
    return this._materialGroup;
  }

  private _parseMaterialDocument(source: string, name?: string): void {
    const xmml = (new DOMParser()).parseFromString(source, "text/xml");
    this._materialName = xmml.querySelector("material").getAttribute("name");
    this._materialGroup = xmml.querySelector("material").getAttribute("group");
    if (!this._materialName && !name) {
      console.error("Material name must be specified");
    }
    this._materialName = this._materialName || name;
    this._initializeUniformRegisters(xmml);
    this._parsePasses(xmml).then(() => {
      this.setLoaded();
    });
  }

  private _parsePasses(doc: Document): Q.IPromise<void[]> {
    const passes = doc.querySelectorAll("material > passes > pass");
    for (let i = 0; i < passes.length; i++) {
      const pass = passes.item(i);
      this._passes.push(new MaterialPass(this, pass, this._materialName, i));
    }
    this._passCount = passes.length;
    return Q.all(this._passes.map<Q.IPromise<void>>(e => e.initialize(this._uniformRegisters)));
  }

  private _initializeUniformRegisters(doc: Document): void {
    const registersDOM = doc.querySelectorAll("material > uniform-register > register");
    for (let i = 0; i < registersDOM.length; i++) {
      const registerDOM = registersDOM.item(i);
      const registererConstructor = this._materialManager.getUniformRegister(registerDOM.attributes.getNamedItem("name").value);
      if (!registererConstructor) { continue; }
      this._uniformRegisters.push(new registererConstructor());
    }
  }

  private get _materialManager(): MaterialManager {
    return JThreeContext.getContextComponent<MaterialManager>(ContextComponents.MaterialManager);
  }
}

export default BasicMaterial;
