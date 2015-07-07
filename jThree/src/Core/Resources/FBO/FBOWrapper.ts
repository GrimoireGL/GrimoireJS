import JThreeObject = require('../../../Base/JThreeObject');
import ContextManagerBase = require("../../ContextManagerBase");
import GLContextWrapperBase = require("../../../Wrapper/GLContextWrapperBase");
import ResourceWrapper = require('../ResourceWrapper');
import TextureBuffer = require('../Texture/BufferTexture');
import FrameBufferAttachmentType = require('../../../Wrapper/FrameBufferAttachmentType');
import ClearTargetType = require('../../../Wrapper/ClearTargetType');
import TextureRegister = require('../../../Wrapper/Texture/TextureRegister');
import TargetTextureType = require('../../../Wrapper/TargetTextureType');
import TextureBase = require('../Texture/TextureBase')
import RBO = require('../RBO/RBO');
class FBOWrapper extends ResourceWrapper {

    constructor(renderer: ContextManagerBase) {
        super(renderer);
        this.glContext = renderer.Context;
    }

    private glContext: GLContextWrapperBase = null;

    private targetFBO: WebGLFramebuffer;

    private textures: TextureBase[] = [];

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

    bind() {
        if (!this.Initialized) this.init();
        this.WebGLContext.BindFrameBuffer(this.targetFBO);
    }

    unbind() {
        this.WebGLContext.BindFrameBuffer(null);
        this.textures.forEach(tex=> {
            tex.getForContext(this.OwnerCanvas).bind();
            tex.generateMipmapIfNeed();
        });
    }

    attachTexture(attachmentType: FrameBufferAttachmentType, tex: TextureBase) {
        if (!this.Initialized) this.init();
        this.bind();
        if (tex == null) {
            this.WebGLContext.FrameBufferTexture2D(attachmentType, null);
            return;
        }
        this.WebGLContext.FrameBufferTexture2D(attachmentType, tex.getForContext(this.OwnerCanvas).TargetTexture);
        tex.getForContext(this.OwnerCanvas).bind();
        tex.generateMipmapIfNeed();
        if (this.textures.indexOf(tex) !== -1) this.textures.push(tex);
    }

    attachRBO(attachmentType: FrameBufferAttachmentType, rbo: RBO) {
        var wrapper = rbo.getForContext(this.OwnerCanvas);
        if (!this.Initialized) this.init();
        this.bind();
        this.WebGLContext.FrameBufferRenderBuffer(attachmentType, wrapper.Target);
    }

    dispose() {
        if (this.Initialized) {
            //TODO Dispose frame buffer
            this.targetFBO = null;
            this.setInitialized(false);
        }
    }
    
    clear(r:number,g:number,b:number,a:number,d?:number,s?:number)
    {
        this.bind();
        var clearFlag=0;
        if(typeof r !=='undefined'&&typeof g !=='undefined'&&typeof b !=='undefined'&&typeof a !=='undefined')
        {
            clearFlag=clearFlag|ClearTargetType.ColorBits;
            this.glContext.ClearColor(r,g,b,a);
        }
        if(typeof d!=='undefined')
        {
            clearFlag=clearFlag|ClearTargetType.DepthBits;
            this.glContext.ClearDepth(d);
        }
        //TODO add stencil
        this.glContext.Clear(clearFlag);
    }
}

export =FBOWrapper;
