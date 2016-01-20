import Material = require("../Material");
import IVariableInfo = require("./IVariableInfo");
import ContextComponents = require("../../../ContextComponents");
import JThreeContext = require("../../../JThreeContext");
import MaterialManager = require("./MaterialManager");
import ProgramWrapper = require("../../Resources/Program/ProgramWrapper");
import MaterialPass = require("./MaterialPass");
import Delegates = require("../../../Base/Delegates");
import IApplyMaterialArgument = require("./IApplyMaterialArgument");

class BasicMaterial extends Material {
  private _passes: MaterialPass[] = [];

  private _uniformRegisters: Delegates.Action4<WebGLRenderingContext, ProgramWrapper, IApplyMaterialArgument, { [key: string]: IVariableInfo }>[] = [];

  private _materialGroup: string;

  private _materialName: string;

  private _passCount: number = 0;

  constructor(sourceString: string) {
    super();
    this._parseMaterialDocument(sourceString);
  }

  /**
* Apply configuration of program.
* This is used for passing variables,using programs,binding index buffer.
*/
  public apply(matArg: IApplyMaterialArgument): void {
    super.apply(matArg);
    const targetPass = this._passes[matArg.passIndex];
    targetPass.apply(matArg, this._uniformRegisters, this);
  }

  /**
  * Should return how many times required to render this material.
  * If you render some of model with edge,it can be 2 or greater.
  * Because it needs rendering edge first,then rendering forward shading.
  */
  public getPassCount(techniqueIndex: number) {
    return this._passCount;
  }

  public get MaterialGroup() {
    return this._materialGroup;
  }

  private _parseMaterialDocument(source: string): void {
    const xmml = (new DOMParser()).parseFromString(source, "text/xml");
    this._materialName = xmml.querySelector("material").getAttribute("name");
    this._materialGroup = xmml.querySelector("material").getAttribute("group");
    if (!this._materialName) {
      console.error("Material name must be specified");
    }
    if (!this._materialGroup) {
      console.error("Material group must be specified!");
    }
    this._parsePasses(xmml);
    this._initializeUniformRegisters(xmml);
    this.setLoaded();
  }

  private _parsePasses(doc: Document) {
    const passes = doc.querySelectorAll("material > passes > pass");
    for (let i = 0; i < passes.length; i++) {
      const pass = passes.item(i);
      this._passes.push(new MaterialPass(this, pass, this._materialName, i));
    }
    this._passCount = passes.length;
  }

  private _initializeUniformRegisters(doc: Document) {
    const registersDOM = doc.querySelectorAll("material > uniform-register > register");
    for (let i = 0; i < registersDOM.length; i++) {
      const registerDOM = registersDOM.item(i);
      const registerFunction = this._materialManager.getUniformRegister(registerDOM.attributes.getNamedItem("name").value);
      if (!registerFunction) { continue; }
      this._uniformRegisters.push(registerFunction);
    }
  }

  private get _materialManager(): MaterialManager {
    return JThreeContext.getContextComponent<MaterialManager>(ContextComponents.MaterialManager);
  }
}

export = BasicMaterial;
