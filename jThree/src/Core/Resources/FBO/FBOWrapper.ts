import ContextManagerBase = require("../../ContextManagerBase");
import GLContextWrapperBase = require("../../../Wrapper/GLContextWrapperBase");
import ResourceWrapper = require('../ResourceWrapper');
import FrameBufferAttachmentType = require('../../../Wrapper/FrameBufferAttachmentType');
import ClearTargetType = require('../../../Wrapper/ClearTargetType');
import TextureBase = require('../Texture/TextureBase')
import RBO = require('../RBO/RBO');
class FBOWrapper extends ResourceWrapper {

    constructor(renderer: ContextManagerBase) {
        super(renderer);
        this.glContext = renderer.GLContext;
    }

    private glContext: GLContextWrapperBase = null;

    private targetFBO: WebGLFramebuffer;

    private textures: TextureBase[] = [];

    public get TargetShader(): WebGLShader {
        if (!this.Initialized) this.init();
        return this.targetFBO;
    }

    public init(): void {
        if (!this.Initialized) {
            this.targetFBO = this.glContext.CreateFrameBuffer();
            this.glContext.BindFrameBuffer(this.targetFBO);
            this.setInitialized();
        }
    }

    public bind() {
        if (!this.Initialized) this.init();
        this.WebGLContext.BindFrameBuffer(this.targetFBO);
    }

    public unbind() {
        this.WebGLContext.BindFrameBuffer(null);
/*        this.textures.forEach(tex=> {
            tex.getForContext(this.OwnerCanvas).bind();
            tex.generateMipmapIfNeed();
        });*/
    }

    public attachTexture(attachmentType: FrameBufferAttachmentType, tex: TextureBase) {
        if (!this.Initialized) this.init();
        this.bind();
        if (tex == null) {
            this.WebGLContext.FrameBufferTexture2D(attachmentType, null);
            return;
        }
        var wt = tex.getForContext(this.OwnerCanvas);
        wt.preTextureUpload();
        this.WebGLContext.FrameBufferTexture2D(attachmentType, wt.TargetTexture);
        tex.getForContext(this.OwnerCanvas).bind();
        tex.generateMipmapIfNeed();
        if (this.textures.indexOf(tex) !== -1) this.textures.push(tex);
        this.WebGLContext.BindTexture(tex.TargetTextureType,null);
    }

    public attachRBO(attachmentType: FrameBufferAttachmentType, rbo: RBO) {
        if (!this.Initialized) this.init();
        this.bind();
        if(rbo==null)
        {
            this.WebGLContext.FrameBufferRenderBuffer(attachmentType,null);
            return;
        }
        var wrapper = rbo.getForContext(this.OwnerCanvas);
        this.WebGLContext.FrameBufferRenderBuffer(attachmentType, wrapper.Target);
    }

    public dispose() {
        if (this.Initialized) {
            //TODO Dispose frame buffer
            this.targetFBO = null;
            this.setInitialized(false);
        }
    }

    public clear(r: number, g: number, b: number, a: number, d?: number, s?: number) {
        this.bind();
        var clearFlag = 0;
        if (typeof r !== 'undefined' && typeof g !== 'undefined' && typeof b !== 'undefined' && typeof a !== 'undefined') {
            clearFlag = clearFlag | ClearTargetType.ColorBits;
            this.glContext.ClearColor(r, g, b, a);
        }
        if (typeof d !== 'undefined') {
            clearFlag = clearFlag | ClearTargetType.DepthBits;
            this.glContext.ClearDepth(d);
        }
        //TODO add stencil
        this.glContext.Clear(clearFlag);
    }
}

export =FBOWrapper;
