import TextureWrapperBase from "./TextureWrapperBase";
class TextureWrapper extends TextureWrapperBase {
    constructor(canvas, parent) {
        super(canvas, parent);
    }
    init(isChanged) {
        if (this.Initialized && !isChanged) {
            return;
        }
        if (this.TargetTexture == null) {
            this.__setTargetTexture(this.GL.createTexture());
        }
        this.updateTexture();
        this.GL.bindTexture(WebGLRenderingContext.TEXTURE_2D, null);
        this.__setInitialized();
    }
    updateTexture() {
        const parentTexture = this.Parent;
        this.GL.bindTexture(WebGLRenderingContext.TEXTURE_2D, this.TargetTexture);
        if (parentTexture.ImageSource == null) {
            this.GL.texImage2D(WebGLRenderingContext.TEXTURE_2D, 0, WebGLRenderingContext.RGBA, 1, 1, 0, WebGLRenderingContext.RGBA, WebGLRenderingContext.UNSIGNED_BYTE, TextureWrapperBase.__altTextureBuffer);
        }
        else {
            this.preTextureUpload();
            this.GL.texImage2D(WebGLRenderingContext.TEXTURE_2D, 0, WebGLRenderingContext.RGBA, WebGLRenderingContext.RGBA, WebGLRenderingContext.UNSIGNED_BYTE, parentTexture.ImageSource);
        }
    }
}
export default TextureWrapper;
