import JThreeObject = require('../../../Base/JThreeObject');
import ContextManagerBase = require("../../ContextManagerBase");
import GLContextWrapperBase = require("../../../Wrapper/GLContextWrapperBase");
import ResourceWrapper = require('../ResourceWrapper');
class FBOWrapper extends ResourceWrapper
{

    constructor(renderer:ContextManagerBase) {
        super(renderer);
        this.glContext = renderer.Context;
    }

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
            this.glContext.BindFrameBuffer(this.targetFBO);
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
