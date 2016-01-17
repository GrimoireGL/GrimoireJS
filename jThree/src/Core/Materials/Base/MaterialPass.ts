import IRenderStageRenderConfigure = require("../../Renderers/RenderStages/IRenderStageRendererConfigure");
import Material = require("../Material");
import ProgramWrapper = require("../../Resources/Program/ProgramWrapper");
import IVariableInfo = require("./IVariableInfo");
import IParsedProgramResult = require("./IParsedProgramResult");
import IMaterialConfigureArgument = require("./IMaterialConfigureArgument");
import BasicMaterial = require("./BasicMaterial");
import XMLRenderConfigUtility = require("./XMLRenderConfigUtility");
import Program = require("../../Resources/Program/Program");
import Shader = require("../../Resources/Shader/Shader");
import ShaderType = require("../../../Wrapper/ShaderType");
import ContextComponents = require("../../../ContextComponents");
import JThreeContext = require("../../../JThreeContext");
import ResourceManager = require("../../ResourceManager");
import ShaderParser = require("./ShaderParser");
import Delegates = require("../../../Base/Delegates");
class MaterialPass {
    public fragmentShaderSource: string;

    public vertexShaderSource: string;

    public fragmentShader: Shader;

    public vertexShader: Shader;

    public program: Program;

    private _passDocument: Element;

    public parsedProgram: IParsedProgramResult;

    private _renderConfigureCache:{[id:string]:IRenderStageRenderConfigure} = {};

    private _fetchRenderConfigure(matArg:IMaterialConfigureArgument):IRenderStageRenderConfigure
    {
      const id = matArg.renderStage.ID;
      if(this._renderConfigureCache[id])
      {
        return this._renderConfigureCache[id];
      }else
      {
        const configure =  XMLRenderConfigUtility.parseRenderConfig(this._passDocument,matArg.renderStage.getDefaultRendererConfigure(matArg.techniqueIndex));
        this._renderConfigureCache[id] = configure;
        return configure;
      }
    }

    constructor(passDocument: Element, materialName: string, index: number) {
        this._passDocument = passDocument;
        this._parseGLSL();
        this._constructProgram(materialName + index);
    }

    private _parseGLSL(): void {
        const shaderCode = this._passDocument.getElementsByTagName("glsl").item(0).textContent;
        const parsedCodes = ShaderParser.parseCombined(shaderCode);
        this.parsedProgram = parsedCodes;
        this.fragmentShaderSource = parsedCodes.fragment;
        this.vertexShaderSource = parsedCodes.vertex;
    }

    private _constructProgram(idPrefix: string): void {
        this.fragmentShader = MaterialPass._resourceManager.createShader(idPrefix + "-fs", this.fragmentShaderSource, ShaderType.FragmentShader);
        this.vertexShader = MaterialPass._resourceManager.createShader(idPrefix + "-vs", this.vertexShaderSource, ShaderType.VertexShader);
        this.fragmentShader.loadAll();
        this.vertexShader.loadAll();
        this.program = MaterialPass._resourceManager.createProgram(idPrefix + "-program", [this.vertexShader, this.fragmentShader]);
    }

    public configureMaterial(matArg: IMaterialConfigureArgument, uniformRegisters: Delegates.Action4<WebGLRenderingContext, ProgramWrapper, IMaterialConfigureArgument, { [key: string]: IVariableInfo }>[],material:Material): void {
        const gl = matArg.renderStage.GL;
        const pWrapper = this.program.getForContext(matArg.renderStage.Renderer.ContextManager);
        const renderConfig = this._fetchRenderConfigure(matArg);
        XMLRenderConfigUtility.applyAll(gl,renderConfig);
        //Declare using program before assigning material variables
        pWrapper.useProgram();
        //Apply attribute variables by geometries
        matArg.object.Geometry.applyAttributeVariables(pWrapper, this.parsedProgram.attributes);
        //Apply uniform variables
        uniformRegisters.forEach((r) => {
            r(gl, pWrapper, matArg, this.parsedProgram.uniforms);
        });
        material.registerMaterialVariables(matArg.renderStage.Renderer,pWrapper,this.parsedProgram.uniforms);
    }

    private static get _resourceManager(): ResourceManager {
        return JThreeContext.getContextComponent<ResourceManager>(ContextComponents.ResourceManager);
    }
}

export = MaterialPass;
