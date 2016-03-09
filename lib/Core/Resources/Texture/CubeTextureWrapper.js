import TextureWrapperBase from "./TextureWrapperBase";
class CubeTextureWrapper extends TextureWrapperBase {
    constructor(canvas, parent) {
        super(canvas, parent);
    }
    init(isChanged) {
        const parent = this.Parent;
        if (this.Initialized && !isChanged) {
            return;
        }
        if (this.TargetTexture == null) {
            this.__setTargetTexture(this.GL.createTexture());
        }
        this.GL.bindTexture(WebGLRenderingContext.TEXTURE_CUBE_MAP, this.TargetTexture);
        if (parent.ImageSource == null) {
            for (let i = 0; i < 6; i++) {
                this.GL.texImage2D(WebGLRenderingContext.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, WebGLRenderingContext.RGBA, 1, 1, 0, WebGLRenderingContext.RGBA, WebGLRenderingContext.UNSIGNED_BYTE, TextureWrapperBase.__altTextureBuffer);
            }
        }
        else {
            this.preTextureUpload();
            for (let i = 0; i < 6; i++) {
                if (parent.ImageSource[i]) {
                    this.GL.texImage2D(WebGLRenderingContext.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, WebGLRenderingContext.RGBA, WebGLRenderingContext.RGBA, WebGLRenderingContext.UNSIGNED_BYTE, parent.ImageSource[i]);
                }
            }
        }
        this.GL.bindTexture(WebGLRenderingContext.TEXTURE_CUBE_MAP, null);
        this.__setInitialized();
    }
}
export default CubeTextureWrapper;
