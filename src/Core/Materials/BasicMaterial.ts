import NamedValue from "../../Base/NamedValue";
import IXMMLDescription from "./Parser/IXMMLDescription";
import ArgumentMerger from "./ArgumentMerger";
import Material from "./Material";
import MaterialPass from "../Pass/MaterialPass";
import IApplyMaterialArgument from "./IApplyMaterialArgument";
import XMMLParser from "./Parser/XMMLParser";

class BasicMaterial extends Material {
  private _passes: MaterialPass[];

  private _mergedShaderVariables: NamedValue<any> = {};

  private _description: IXMMLDescription;

  constructor(sourceString: string, name: string) {
    super();
    XMMLParser.parse(name, sourceString).then((desc) => {
      this._description = desc;
      this._passes = desc.pass.map(pass => {
        return new MaterialPass(this, pass);
      });
      this.__setLoaded();
    });
  }

  public dispose(): void {
    super.dispose();
    this._passes.forEach((p) => {
      p.dispose();
    });
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
    this._mergedShaderVariables = ArgumentMerger.merge(matArg.renderStage, this, matArg.object); // should be optimized
    const targetPass = this._passes[matArg.passIndex];
    targetPass.apply(matArg, this._description.registerers, this, this._mergedShaderVariables);
  }

  /**
  * Should return how many times required to render this material.
  * If you render some of model with edge,it can be 2 or greater.
  * Because it needs rendering edge first,then rendering forward shading.
  */
  public getPassCount(techniqueIndex: number): number {
    return this._description.pass.length;
  }

  public get MaterialGroup() {
    return this._description.group;
  }
}

export default BasicMaterial;
