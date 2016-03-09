import ResourceWrapper from "../ResourceWrapper";
class FBOWrapper extends ResourceWrapper {
    constructor(canvas) {
        super(canvas);
        this._textures = [];
    }
    get TargetShader() {
        if (!this.Initialized) {
            this.init();
        }
        return this._targetFBO;
    }
    init() {
        if (!this.Initialized) {
            this._targetFBO = this.GL.createFramebuffer();
            this.GL.bindFramebuffer(this.GL.FRAMEBUFFER, this._targetFBO);
            this.__setInitialized();
        }
    }
    bind() {
        if (!this.Initialized) {
            this.init();
        }
        this.GL.bindFramebuffer(this.GL.FRAMEBUFFER, this._targetFBO);
    }
    unbind() {
        this.GL.bindFramebuffer(this.GL.FRAMEBUFFER, null);
        /*        this.textures.forEach(tex=> {
                    tex.getForContext(this.OwnerCanvas).bind();
                    tex.generateMipmapIfNeed();
                });*/
    }
    attachTexture(attachmentType, tex) {
        if (!this.Initialized) {
            this.init();
        }
        this.bind();
        if (tex == null) {
            this.GL.framebufferTexture2D(this.GL.FRAMEBUFFER, attachmentType, this.GL.TEXTURE_2D, null, 0);
            return;
        }
        let wt = tex.getForContext(this.OwnerCanvas);
        wt.preTextureUpload();
        this.GL.framebufferTexture2D(this.GL.FRAMEBUFFER, attachmentType, this.GL.TEXTURE_2D, wt.TargetTexture, 0);
        tex.getForContext(this.OwnerCanvas).bind();
        tex.generateMipmapIfNeed();
        if (this._textures.indexOf(tex) !== -1) {
            this._textures.push(tex);
        }
        this.GL.bindTexture(tex.TargetTextureType, null);
    }
    attachRBO(attachmentType, rbo) {
        if (!this.Initialized) {
            this.init();
        }
        this.bind();
        if (rbo == null) {
            this.GL.framebufferRenderbuffer(this.GL.FRAMEBUFFER, attachmentType, this.GL.RENDERBUFFER, null);
            return;
        }
        let wrapper = rbo.getForContext(this.OwnerCanvas);
        this.GL.framebufferRenderbuffer(this.GL.FRAMEBUFFER, attachmentType, this.GL.RENDERBUFFER, wrapper.Target);
    }
    dispose() {
        if (this.Initialized) {
            this.GL.deleteFramebuffer(this._targetFBO);
            this._targetFBO = null;
            this.__setInitialized(false);
        }
    }
}
export default FBOWrapper;
