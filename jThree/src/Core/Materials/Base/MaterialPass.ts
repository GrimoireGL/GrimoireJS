import Program = require("../../Resources/Program/Program");
import Shader = require("../../Resources/Shader/Shader");
import ShaderType = require("../../../Wrapper/ShaderType");
import ContextComponents = require("../../../ContextComponents");
import JThreeContext = require("../../../JThreeContext");
import ResourceManager = require("../../ResourceManager");
import ShaderProgramParser = require("./ShaderProgramParser");
class MaterialPass {
    public fragmentShaderSource: string;

    public vertexShaderSource: string;

    public fragmentShader:Shader;

    public vertexShader:Shader;

    public program:Program;

    constructor(passDocument: Element) {
      this._parseGLSL(passDocument);
      this._constructProgram();
      debugger;
    }

    private _parseGLSL(passDocument:Element){
      var shaderCode = passDocument.getElementsByTagName("glsl").item(0).textContent;
      var parsedCodes = ShaderProgramParser.parseCombined(shaderCode);
      this.fragmentShaderSource = parsedCodes.fragment;
      this.vertexShaderSource = parsedCodes.vertex;
    }

    private _constructProgram()
    {
      this.fragmentShader = MaterialPass._resourceManager.createShader("passTestfs",this.fragmentShaderSource,ShaderType.FragmentShader);
      this.vertexShader = MaterialPass._resourceManager.createShader("passTestvs",this.fragmentShaderSource,ShaderType.VertexShader);
      this.fragmentShader.loadAll();
      this.vertexShader.loadAll();
      this.program = MaterialPass._resourceManager.createProgram("passTestprogram",[this.vertexShader,this.fragmentShader]);
    }

    private static get _resourceManager():ResourceManager
    {
      return JThreeContext.getContextComponent<ResourceManager>(ContextComponents.ResourceManager);
    }
}

export = MaterialPass;
