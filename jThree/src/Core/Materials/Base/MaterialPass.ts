import IParsedProgramResult = require("./IParsedProgramResult");
import IMaterialConfigureArgument = require("./IMaterialConfigureArgument");
import BasicMaterial = require("./BasicMaterial");
import XMMLRenderConfigUtility = require("./XMMLRenderConfigUtility");
import Program = require("../../Resources/Program/Program");
import Shader = require("../../Resources/Shader/Shader");
import ShaderType = require("../../../Wrapper/ShaderType");
import ContextComponents = require("../../../ContextComponents");
import JThreeContext = require("../../../JThreeContext");
import ResourceManager = require("../../ResourceManager");
import XMMLShaderParser = require("./XMMLShaderParser");
class MaterialPass {
    public fragmentShaderSource: string;

    public vertexShaderSource: string;

    public fragmentShader: Shader;

    public vertexShader: Shader;

    public program: Program;

    private _passDocument: Element;

    private _parsedProgram: IParsedProgramResult;

    constructor(passDocument: Element, materialName: string, index: number) {
        this._passDocument = passDocument;
        this._parseGLSL(passDocument);
        this._constructProgram(materialName + index);
    }

    private _parseGLSL(passDocument: Element): void {
        const shaderCode = passDocument.getElementsByTagName("glsl").item(0).textContent;
        const parsedCodes = XMMLShaderParser.parseCombined(shaderCode);
        this._parsedProgram = parsedCodes;
        this.fragmentShaderSource = parsedCodes.fragment;
        this.vertexShaderSource = parsedCodes.vertex;
    }

    private _constructProgram(idPrefix: string): void {
        this.fragmentShader = MaterialPass._resourceManager.createShader(idPrefix + "-fs", this.fragmentShaderSource, ShaderType.FragmentShader);
        this.vertexShader = MaterialPass._resourceManager.createShader(idPrefix + "-vs", this.fragmentShaderSource, ShaderType.VertexShader);
        this.fragmentShader.loadAll();
        this.vertexShader.loadAll();
        this.program = MaterialPass._resourceManager.createProgram(idPrefix + "-program", [this.vertexShader, this.fragmentShader]);
    }

    public configureMaterial(matArg: IMaterialConfigureArgument): void {
        const gl = matArg.renderStage.GL;
        const pWrapper = this.program.getForContext(matArg.renderStage.Renderer.ContextManager);
        //TODO fix all of these default value to be fetched from renderer default configuration
        XMMLRenderConfigUtility.applyCullConfigure(gl, this._passDocument, false, "");
        XMMLRenderConfigUtility.applyDepthTestConfigure(gl, this._passDocument, true, "less", true);
        XMMLRenderConfigUtility.applyBlendFuncConfigure(gl, this._passDocument, false, "", "", "", "");
        //Declare using program before assigning material variables
        pWrapper.useProgram();
        //Apply attribute variables by geometries
        matArg.object.Geometry.applyAttributeVariables(pWrapper, this._parsedProgram.attributes);
        //Apply uniform variables
        this._applyUniformVariables(gl,matArg);
    }

    private _applyUniformVariables(gl: WebGLRenderingContext, matArg: IMaterialConfigureArgument): void {

    }

    private static get _resourceManager(): ResourceManager {
        return JThreeContext.getContextComponent<ResourceManager>(ContextComponents.ResourceManager);
    }
}

export = MaterialPass;
