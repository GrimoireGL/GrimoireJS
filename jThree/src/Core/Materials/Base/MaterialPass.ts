import DefaultValuePreProcessor from "./DefaultValuePreProcessor";
import IConfigureEventArgs from "../../IConfigureEventArgs";
import JThreeObjectWithID from "../../../Base/JThreeObjectWithID";
import IRenderStageRenderConfigure from "../../Renderers/RenderStages/IRenderStageRendererConfigure";
import Material from "../Material";
import ProgramWrapper from "../../Resources/Program/ProgramWrapper";
import IVariableDescription from "./IVariableDescription";
import IProgramDescription from "./IProgramDescription";
import IApplyMaterialArgument from "./IApplyMaterialArgument";
import XMLRenderConfigUtility from "./XMLRenderConfigUtility";
import Program from "../../Resources/Program/Program";
import Shader from "../../Resources/Shader/Shader";
import ContextComponents from "../../../ContextComponents";
import JThreeContext from "../../../JThreeContext";
import ResourceManager from "../../ResourceManager";
import ShaderParser from "./ShaderParser";
import {Action4} from "../../../Base/Delegates";
import Q from "q";
class MaterialPass extends JThreeObjectWithID {

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

  public initialize(): Q.IPromise<void> {
    const shaderCode = this._passDocument.getElementsByTagName("glsl").item(0).textContent;
    return ShaderParser.parseCombined(shaderCode).then((result) => {
      this.programDescription = result;
      DefaultValuePreProcessor.preprocess(this.programDescription.uniforms);
      this._constructProgram(this.materialName + this.passIndex);
      this.ready = true;
    });
  }

  public apply(matArg: IApplyMaterialArgument, uniformRegisters: Action4<WebGLRenderingContext, ProgramWrapper, IApplyMaterialArgument, { [key: string]: IVariableDescription }>[], material: Material): void {
    if (!this.ready) {
      return;
    }
    const gl = matArg.renderStage.GL;
    const pWrapper = this.program.getForContext(matArg.renderStage.Renderer.Canvas);
    const renderConfig = this._fetchRenderConfigure(matArg);
    XMLRenderConfigUtility.applyAll(gl, renderConfig);
    // Declare using program before assigning material variables
    pWrapper.useProgram();
    // Apply attribute variables by geometries
    matArg.object.Geometry.applyAttributeVariables(pWrapper, this.programDescription.attributes);
    // Apply uniform variables
    uniformRegisters.forEach((r) => {
      r(gl, pWrapper, matArg, this.programDescription.uniforms);
    });
    material.registerMaterialVariables(matArg.renderStage.Renderer, pWrapper, this.programDescription.uniforms);
  }

  protected __preprocessUniformVariables(): void {
    // Preprocess default value for uniforms
  }

  private _fetchRenderConfigure(matArg: IApplyMaterialArgument): IRenderStageRenderConfigure {
    const id = matArg.renderStage.ID;
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
