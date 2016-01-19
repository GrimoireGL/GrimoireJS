import JThreeObjectWithID = require("../../../Base/JThreeObjectWithID");
import IRenderStageRenderConfigure = require("../../Renderers/RenderStages/IRenderStageRendererConfigure");
import Material = require("../Material");
import ProgramWrapper = require("../../Resources/Program/ProgramWrapper");
import IVariableInfo = require("./IVariableInfo");
import IParsedProgramResult = require("./IParsedProgramResult");
import IApplyMaterialArgument = require("./IApplyMaterialArgument");
import XMLRenderConfigUtility = require("./XMLRenderConfigUtility");
import Program = require("../../Resources/Program/Program");
import Shader = require("../../Resources/Shader/Shader");
import ShaderType = require("../../../Wrapper/ShaderType");
import ContextComponents = require("../../../ContextComponents");
import JThreeContext = require("../../../JThreeContext");
import ResourceManager = require("../../ResourceManager");
import ShaderParser = require("./ShaderParser");
import Delegates = require("../../../Base/Delegates");
class MaterialPass extends JThreeObjectWithID {
  private static _lastExecutedPassProgram: string;

  public passIndex: number;

  public fragmentShaderSource: string;

  public vertexShaderSource: string;

  public fragmentShader: Shader;

  public vertexShader: Shader;

  public program: Program;

  public parsedProgram: IParsedProgramResult;

  private _passDocument: Element;

  private _renderConfigureCache: { [id: string]: IRenderStageRenderConfigure } = {};

  private _passId: string;

  private _material: Material;

  constructor(material: Material, passDocument: Element, materialName: string, index: number) {
    super();
    this.passIndex = index;
    this._material = material;
    this._passDocument = passDocument;
    this._parseGLSL();
    this._constructProgram(materialName + index);
  }
  public apply(matArg: IApplyMaterialArgument, uniformRegisters: Delegates.Action4<WebGLRenderingContext, ProgramWrapper, IApplyMaterialArgument, { [key: string]: IVariableInfo }>[], material: Material): void {
    const gl = matArg.renderStage.GL;
    const pWrapper = this.program.getForContext(matArg.renderStage.Renderer.ContextManager);
    const renderConfig = this._fetchRenderConfigure(matArg);
    if (MaterialPass._lastExecutedPassProgram !== this._passId) {
      XMLRenderConfigUtility.applyAll(gl, renderConfig);
      MaterialPass._lastExecutedPassProgram = this._passId;
      // Declare using program before assigning material variables
      pWrapper.useProgram();
    }
    // Apply attribute variables by geometries
    matArg.object.Geometry.applyAttributeVariables(pWrapper, this.parsedProgram.attributes);
    // Apply uniform variables
    uniformRegisters.forEach((r) => {
      r(gl, pWrapper, matArg, this.parsedProgram.uniforms);
    });
    material.registerMaterialVariables(matArg.renderStage.Renderer, pWrapper, this.parsedProgram.uniforms);
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
    this._material.emit("configure", {
      pass: this,
      passIndex: this.passIndex,
      material: this._material,
      configure: result
    });
    return result;
  }



  private _parseGLSL(): void {
    const shaderCode = this._passDocument.getElementsByTagName("glsl").item(0).textContent;
    const parsedCodes = ShaderParser.parseCombined(shaderCode);
    this.parsedProgram = parsedCodes;
    this.fragmentShaderSource = parsedCodes.fragment;
    this.vertexShaderSource = parsedCodes.vertex;
  }

  private _constructProgram(idPrefix: string): void {
    this._passId = idPrefix;
    this.fragmentShader = MaterialPass._resourceManager.createShader(idPrefix + "-fs", this.fragmentShaderSource, ShaderType.FragmentShader);
    this.vertexShader = MaterialPass._resourceManager.createShader(idPrefix + "-vs", this.vertexShaderSource, ShaderType.VertexShader);
    this.fragmentShader.loadAll();
    this.vertexShader.loadAll();
    this.program = MaterialPass._resourceManager.createProgram(idPrefix + "-program", [this.vertexShader, this.fragmentShader]);
  }



  private static get _resourceManager(): ResourceManager {
    return JThreeContext.getContextComponent<ResourceManager>(ContextComponents.ResourceManager);
  }
}

export = MaterialPass;
