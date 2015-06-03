import JThreeObject = require('../../../Base/JThreeObject');
import Shader = require("./Shader");
import ContextManagerBase = require("../../ContextManagerBase");
import GLContextWrapperBase = require("../../../Wrapper/GLContextWrapperBase");
import ResourceWrapper = require('../ResourceWrapper');
class ShaderWrapper extends ResourceWrapper
{

    constructor(parent: Shader,contextManager:ContextManagerBase) {
        super(contextManager);
        this.parentShader = parent;
    }

    private initialized: boolean = false;

    private targetShader: WebGLShader = null;

    private parentShader: Shader;

    get TargetShader(): WebGLShader {
        if (!this.initialized) this.init();
        return this.targetShader;
    }

    init(): void {
        if (!this.initialized) {
            this.targetShader = this.WebGLContext.CreateShader(this.parentShader.ShaderType);
            this.WebGLContext.ShaderSource(this.targetShader, this.parentShader.ShaderSource);
            this.WebGLContext.CompileShader(this.targetShader);
        }
    }

    dispose() {
        if (this
            .initialized) {
            this.WebGLContext.DeleteShader(this.targetShader);
            this.targetShader = null;
            this.initialized = false;
        }
    }
}

export=ShaderWrapper;
