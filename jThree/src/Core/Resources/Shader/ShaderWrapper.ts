import Shader = require("./Shader");
import ContextManagerBase = require("../../ContextManagerBase");
import ResourceWrapper = require("../ResourceWrapper");
class ShaderWrapper extends ResourceWrapper
{

    constructor(parent: Shader,contextManager:ContextManagerBase) {
        super(contextManager);
        this.parentShader = parent;
    }

    private targetShader: WebGLShader = null;

    private parentShader: Shader;

    get TargetShader(): WebGLShader {
        if (!this.Initialized) this.init();
        return this.targetShader;
    }

    init(): void {
        if (!this.Initialized) {
            this.targetShader = this.WebGLContext.CreateShader(this.parentShader.ShaderType);
            this.WebGLContext.ShaderSource(this.targetShader, this.parentShader.ShaderSource);
            this.WebGLContext.CompileShader(this.targetShader);
            this.setInitialized(true);
        }
    }

    dispose() {
        if (this.Initialized) {
            this.WebGLContext.DeleteShader(this.targetShader);
            this.targetShader = null;
            this.setInitialized(false);
        }
    }
}

export=ShaderWrapper;
