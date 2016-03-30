import IDisposable from "../../Base/IDisposable";
import BasicRegisterer from "./Registerer/BasicRegisterer";
import DefaultValuePreProcessor from "./DefaultValuePreProcessor";
import IConfigureEventArgs from "../IConfigureEventArgs";
import JThreeObjectWithID from "../../Base/JThreeObjectWithID";
import IRenderStageRenderConfigure from "../Renderers/RenderStages/IRenderStageRendererConfigure";
import Material from "../Materials/Material";
import IProgramDescription from "../ProgramTransformer/Base/IProgramDescription";
import IApplyMaterialArgument from "../Materials/IApplyMaterialArgument";
import XMLRenderConfigUtility from "./XMLRenderConfigUtility";
import Program from "../Resources/Program/Program";
import Shader from "../Resources/Shader/Shader";
import ContextComponents from "../../ContextComponents";
import JThreeContext from "../../JThreeContext";
import ResourceManager from "../ResourceManager";
import ProgramTranspiler from "../ProgramTransformer/ProgramTranspiler";
class MaterialPass extends JThreeObjectWithID implements IDisposable {

  public ready: boolean = false;

  public materialName: string;

  public passIndex: number;

  public fragmentShader: Shader;

  public vertexShader: Shader;

  public program: Program;

  public programDescription: IProgramDescription;

  private _passDocument: Element;

  private _renderConfigureCache: { [id: string]: IRenderStageRenderConfigure } = {};

  private _passId: string;

  private _material: Material;

  constructor(material: Material, passDocument: Element, materialName: string, index: number) {
    super();
    this.passIndex = index;
    this._material = material;
    this._passDocument = passDocument;
    this.materialName = materialName;
  }

  public initialize(uniformRegisters: BasicRegisterer[]): Promise<void> {
    const shaderCode = this._passDocument.getElementsByTagName("glsl").item(0).textContent;
    return ProgramTranspiler.parseCombined(shaderCode).then((result) => {
      this.programDescription = result;
      this._constructProgram(this.materialName + this.passIndex);
      return DefaultValuePreProcessor.preprocess(this.programDescription.uniforms);
    }).then(() => {
      return Promise.all(uniformRegisters.map(m => m.preprocess(this, this.programDescription.uniforms)));
    }).then(() => {
      this.ready = true;
    });
  }

  public dispose(): void {
    this.fragmentShader.dispose();
    this.vertexShader.dispose();
    this.program.dispose();
  }

  public apply(matArg: IApplyMaterialArgument, uniformRegisters: BasicRegisterer[], material: Material, shaderVariables: { [name: string]: any }): void {
    if (!this.ready) {
      throw new Error("initialization was not completed yet!");
    }
    const gl = matArg.renderStage.gl;
    const pWrapper = this.program.getForGL(gl);
    const renderConfig = this._fetchRenderConfigure(matArg);
    XMLRenderConfigUtility.applyAll(gl, renderConfig);
    // Declare using program before assigning material variables
    pWrapper.useProgram();
    // Apply attribute variables by geometries
    matArg.object.Geometry.applyAttributeVariables(pWrapper, this.programDescription.attributes);
    // Apply uniform variables
    uniformRegisters.forEach((r) => {
      r.register(gl, pWrapper, matArg, this.programDescription.uniforms);
    });
    material.registerMaterialVariables(matArg.renderStage.renderer, pWrapper, this.programDescription.uniforms, shaderVariables);
  }

  private _fetchRenderConfigure(matArg: IApplyMaterialArgument): IRenderStageRenderConfigure {
    const id = matArg.renderStage.id;
    let result: IRenderStageRenderConfigure;
    if (this._renderConfigureCache[id]) {
      result = this._renderConfigureCache[id];
    } else {
      const configure = XMLRenderConfigUtility.parseRenderConfig(this._passDocument, matArg.renderStage.getDefaultRendererConfigure(matArg.techniqueIndex));
      this._renderConfigureCache[id] = configure;
      result = configure;
    }
    this._material.emit("configure", <IConfigureEventArgs>{
      pass: this,
      passIndex: this.passIndex,
      material: this._material,
      configure: result
    });
    return result;
  }


  private _constructProgram(idPrefix: string): void {
    this._passId = idPrefix;
    this.fragmentShader = MaterialPass._resourceManager.createShader(idPrefix + "-fs", this.programDescription.fragment, WebGLRenderingContext.FRAGMENT_SHADER);
    this.vertexShader = MaterialPass._resourceManager.createShader(idPrefix + "-vs", this.programDescription.vertex, WebGLRenderingContext.VERTEX_SHADER);
    this.fragmentShader.loadAll();
    this.vertexShader.loadAll();
    this.program = MaterialPass._resourceManager.createProgram(idPrefix + "-program", [this.vertexShader, this.fragmentShader]);
  }



  private static get _resourceManager(): ResourceManager {
    return JThreeContext.getContextComponent<ResourceManager>(ContextComponents.ResourceManager);
  }
}

export default MaterialPass;
