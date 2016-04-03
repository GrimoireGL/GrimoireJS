import IXMMLPassDescription from "../Materials/Parser/IXMMLPassDescription";
import IDisposable from "../../Base/IDisposable";
import BasicRegisterer from "./Registerer/BasicRegisterer";
import IConfigureEventArgs from "../IConfigureEventArgs";
import JThreeObjectWithID from "../../Base/JThreeObjectWithID";
import IRenderStageRenderConfigure from "../Renderers/RenderStages/IRenderStageRendererConfigure";
import Material from "../Materials/Material";
import IApplyMaterialArgument from "../Materials/IApplyMaterialArgument";
import XMLRenderConfigUtility from "./XMLRenderConfigUtility";
class MaterialPass extends JThreeObjectWithID implements IDisposable {
  public passDescription: IXMMLPassDescription;

  private _renderConfigureCache: { [id: string]: IRenderStageRenderConfigure } = {};

  private _material: Material;

  constructor(material: Material, pass: IXMMLPassDescription) {
    super();
    this._material = material;
    this.passDescription = pass;
  }

  public dispose(): void {
    return;
  }

  public apply(matArg: IApplyMaterialArgument, uniformRegisters: BasicRegisterer[], material: Material, shaderVariables: { [name: string]: any }): void {
    const gl = matArg.renderStage.gl;
    const pWrapper = this.passDescription.program.getForGL(gl);
    const renderConfig = this._fetchRenderConfigure(matArg);
    XMLRenderConfigUtility.applyAll(gl, renderConfig);
    // Declare using program before assigning material variables
    pWrapper.useProgram();
    // Apply attribute variables by geometries
    matArg.object.Geometry.useGeometry(pWrapper, this.passDescription.programDescription.attributes);
    // Apply uniform variables
    uniformRegisters.forEach((r) => {
      r.register(gl, pWrapper, matArg, this.passDescription.programDescription.uniforms);
    });
    material.registerMaterialVariables(matArg.renderStage.renderer, pWrapper, this.passDescription.programDescription.uniforms, shaderVariables);
  }

  private _fetchRenderConfigure(matArg: IApplyMaterialArgument): IRenderStageRenderConfigure {
    const id = matArg.renderStage.id + matArg.techniqueIndex;
    let result: IRenderStageRenderConfigure;
    if (this._renderConfigureCache[id]) {
      result = this._renderConfigureCache[id];
    } else {
      const configure = this._renderConfigureCache[id] = XMLRenderConfigUtility.mergeRenderConfigure(this.passDescription.renderConfig, matArg.renderStage.getDefaultRendererConfigure(matArg.techniqueIndex));
      result = configure;
    }
    this._material.emit("configure", <IConfigureEventArgs>{
      pass: this,
      passIndex: this.passDescription.passIndex,
      material: this._material,
      configure: result
    });
    return result;
  }
}

export default MaterialPass;
