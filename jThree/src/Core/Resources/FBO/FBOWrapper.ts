import JThreeObject = require('../../../Base/JThreeObject');
import ContextManagerBase = require("../../ContextManagerBase");
import GLContextWrapperBase = require("../../../Wrapper/GLContextWrapperBase");
import ResourceWrapper = require('../ResourceWrapper');
import TextureBuffer = require('../Texture/BufferTexture');
import FrameBufferAttachmentType = require('../../../Wrapper/FrameBufferAttachmentType');
import ClearTargetType = require('../../../Wrapper/ClearTargetType');
import TextureRegister= require('../../../Wrapper/Texture/TextureRegister');
import TargetTextureType = require('../../../Wrapper/TargetTextureType');
import TextureBase = require('../Texture/TextureBase')
class FBOWrapper extends ResourceWrapper
{

    constructor(renderer:ContextManagerBase) {
        super(renderer);
        this.glContext = renderer.Context;
    }

    private glContext: GLContextWrapperBase = null;

    private targetFBO:WebGLFramebuffer;
    
    private textures:TextureBase[]=[];

    get TargetShader(): WebGLShader {
        if (!this.Initialized) this.init();
        return this.targetFBO;
    }

    init(): void {
        if (!this.Initialized) {
            this.targetFBO = this.glContext.CreateFrameBuffer();
            this.glContext.BindFrameBuffer(this.targetFBO);
            this.setInitialized();
        }
    }
    
    bind()
    {
        if(!this.Initialized)this.init();
        this.WebGLContext.BindFrameBuffer(this.targetFBO);
    }
    
    unbind()
    {
        this.WebGLContext.BindFrameBuffer(null);
        this.textures.forEach(tex=>{
        tex.getForRenderer(this.OwnerCanvas).bind();
        this.WebGLContext.GenerateMipmap(TargetTextureType.Texture2D);
        });
    }
    
    attachTexture(attachmentType:FrameBufferAttachmentType,tex:TextureBase)
    {
                if(!this.Initialized)this.init();
                this.bind();
                this.WebGLContext.FrameBufferTexture2D(attachmentType,tex.getForRenderer(this.OwnerCanvas).TargetTexture);
                tex.getForRenderer(this.OwnerCanvas).bind();
                this.WebGLContext.GenerateMipmap(TargetTextureType.Texture2D);
                this.textures.push(tex);
                this.unbind();
    }

    dispose() {
        if (this.Initialized) {
              //TODO Dispose frame buffer
            this.targetFBO = null;
            this.setInitialized(false);
        }
    }
}

export=FBOWrapper;
