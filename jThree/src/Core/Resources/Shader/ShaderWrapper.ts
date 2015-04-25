import JThreeObject=require('Base/JThreeObject');
import Shader = require("./Shader");
import ContextManagerBase = require("../../ContextManagerBase");
import GLContextWrapperBase = require("../../../Wrapper/GLContextWrapperBase");

class ShaderWrapper extends JThreeObject
{

    constructor(parent: Shader,renderer:ContextManagerBase) {
        super();
        this.parentShader = parent;
        this.glContext = renderer.Context;
        this.ID = renderer.ID;
    }

    private ID:string="";

    private initialized: boolean = false;

    private targetShader: WebGLShader = null;

    private glContext: GLContextWrapperBase = null;

    private parentShader: Shader;

    get TargetShader(): WebGLShader {
        if (!this.initialized) this.init();
        return this.targetShader;
    }

    init(): void {
        if (!this.initialized) {
            this.targetShader = this.glContext.CreateShader(this.parentShader.ShaderType);
            this.glContext.ShaderSource(this.targetShader, this.parentShader.ShaderSource);
            this.glContext.CompileShader(this.targetShader);
        }
    }

    dispose() {
        if (this
            .initialized) {
            this.glContext.DeleteShader(this.targetShader);
            this.targetShader = null;
            this.initialized = false;
        }
    }
}

export=ShaderWrapper;
