import Shader = require("./Shader");
import ContextManagerBase = require("../../ContextManagerBase");
import ResourceWrapper = require('../ResourceWrapper');
class ShaderWrapper extends ResourceWrapper
{

    constructor(parent: Shader,contextManager:ContextManagerBase) {
        super(contextManager);
        this.parentShader = parent;
    }

    private targetShader: WebGLShader = null;

    private parentShader: Shader;

    public get TargetShader(): WebGLShader {
        if (!this.Initialized) this.init();
        return this.targetShader;
    }

    public init(): void {
        if (!this.Initialized) {
            this.targetShader = this.GL.createShader(this.parentShader.ShaderType);
            this.WebGLContext.ShaderSource(this.targetShader, this.parentShader.ShaderSource);
            this.WebGLContext.CompileShader(this.targetShader);
            this.setInitialized(true);
        }
    }

    public dispose() {
        if (this.Initialized) {
            this.WebGLContext.DeleteShader(this.targetShader);
            this.targetShader = null;
            this.setInitialized(false);
        }
    }

    /**
     * Update shader source from Shader class.
     */
    public update() {
        var gl=this.WebGLContext;
        gl.DeleteShader(this.targetShader);
        this.targetShader = this.GL.createShader(this.parentShader.ShaderType);
        gl.ShaderSource(this.TargetShader, this.parentShader.ShaderSource);
        gl.CompileShader(this.TargetShader);
    }
}

export=ShaderWrapper;
