import BufferTextureWrapper from "./BufferTextureWrapper";
import TextureBase from "./TextureBase";
/**
 * Buffer texture is a texture created from array programatically.
 */
class BufferTexture extends TextureBase {
    constructor(width, height, textureFormat, elementFormat, textureName) {
        super(textureName);
        this._width = width;
        this._height = height;
        this.__textureFormat = textureFormat;
        this.__elementFormat = elementFormat;
        if (this.__elementFormat === WebGLRenderingContext.FLOAT) {
            this.MinFilter = WebGLRenderingContext.NEAREST;
            this.MagFilter = WebGLRenderingContext.NEAREST;
        }
    }
    get Width() {
        return this._width;
    }
    get Height() {
        return this._height;
    }
    __createWrapperForCanvas(canvas) {
        return new BufferTextureWrapper(canvas, this);
    }
    resize(width, height) {
        if (this._width !== width || this._height !== height) {
            this._width = width;
            this._height = height;
            this.each(v => v.resize(width, height));
        }
    }
    updateTexture(buffer) {
        this.each(t => {
            t.updateTexture(buffer);
        });
    }
}
export default BufferTexture;
