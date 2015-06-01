import JThreeObject = require('../../../Base/JThreeObject');
import ContextManagerBase = require("../../ContextManagerBase");
import GLContextWrapperBase = require("../../../Wrapper/GLContextWrapperBase");

class FBOWrapper extends JThreeObject
{

    constructor(renderer:ContextManagerBase) {
        super();
        this.glContext = renderer.Context;
        this.ID = renderer.ID;
    }

    private ID:string="";

    private initialized: boolean = false;

    private glContext: GLContextWrapperBase = null;

    private targetFBO:WebGLFramebuffer;

    get TargetShader(): WebGLShader {
        if (!this.initialized) this.init();
        return this.targetFBO;
    }

    init(): void {
        if (!this.initialized) {
            this.targetFBO = this.glContext.CreateFrameBuffer();

        }
    }

    dispose() {
        if (this
            .initialized) {
              //TODO Dispose frame buffer\
            this.targetFBO = null;
            this.initialized = false;
        }
    }
}

export=FBOWrapper;
