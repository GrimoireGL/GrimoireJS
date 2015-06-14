import JThreeObject = require('../../../Base/JThreeObject');
import ContextManagerBase = require("../../ContextManagerBase");
import GLContextWrapperBase = require("../../../Wrapper/GLContextWrapperBase");
import ResourceWrapper = require('../ResourceWrapper');
import TextureBuffer = require('../Texture/BufferTexture');
import FrameBufferAttachmentType = require('../../../Wrapper/FrameBufferAttachmentType');
import ClearTargetType = require('../../../Wrapper/ClearTargetType');
import TextureRegister= require('../../../Wrapper/Texture/TextureRegister');
import TargetTextureType = require('../../../Wrapper/TargetTextureType');
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
    
    bind()
    {
        if(!this.initialized)this.init();
        this.WebGLContext.BindFrameBuffer(this.targetFBO);
    }
    
    unbind()
    {
        this.WebGLContext.BindFrameBuffer(null);
    }
    
    attachTexture(attachmentType:FrameBufferAttachmentType,tex:TextureBuffer)
    {
                if(!this.initialized)this.init();
                this.bind();
                this.WebGLContext.FrameBufferTexture2D(attachmentType,tex.getForRenderer(this.OwnerCanvas).TargetTexture);
                this.WebGLContext.ClearColor(255,0,0,255);
                this.WebGLContext.Clear(ClearTargetType.ColorBits);
                this.WebGLContext.ActiveTexture(TextureRegister.Texture0);
                this.WebGLContext.BindTexture(TargetTextureType.Texture2D,tex.getForRenderer(this.OwnerCanvas).TargetTexture);
                this.WebGLContext.GenerateMipmap(TargetTextureType.Texture2D);
                this.unbind();
    }

    dispose() {
        if (this
            .initialized) {
              //TODO Dispose frame buffer
            this.targetFBO = null;
            this.initialized = false;
        }
    }
}

export=FBOWrapper;
