import TextureWrapperBase from "./TextureWrapperBase";
class BufferTextureWrapper extends TextureWrapperBase {
    constructor(ownerCanvas, parent) {
        super(ownerCanvas, parent);
    }
    init() {
        if (this.Initialized) {
            return;
        }
        const parent = this.Parent;
        this.__setTargetTexture(this.GL.createTexture());
        this.bind();
        this.GL.texImage2D(WebGLRenderingContext.TEXTURE_2D, 0, parent.TextureFormat, parent.Width, parent.Height, 0, parent.TextureFormat, parent.ElementFormat, null);
        this.__setInitialized();
    }
    unbind() {
        // TODO consider is it really need to implement unbind
        this.GL.bindTexture(WebGLRenderingContext.TEXTURE_2D, null);
    }
    resize(width, height) {
        this.bind();
        if (this.Initialized) {
            const parent = this.Parent;
            this.preTextureUpload();
            this.GL.texImage2D(WebGLRenderingContext.TEXTURE_2D, 0, parent.TextureFormat, parent.Width, parent.Height, 0, parent.TextureFormat, parent.ElementFormat, null);
        }
    }
    updateTexture(buffer) {
        this.bind();
        if (this.Initialized) {
            const parent = this.Parent;
            this.preTextureUpload();
            this.GL.texImage2D(WebGLRenderingContext.TEXTURE_2D, 0, parent.TextureFormat, parent.Width, parent.Height, 0, parent.TextureFormat, parent.ElementFormat, buffer);
        }
        this.unbind();
    }
    generateHtmlImage(encoder) {
        const parent = this.Parent;
        return this.__encodeHtmlImage(parent.Width, parent.Height, encoder);
    }
}
export default BufferTextureWrapper;
