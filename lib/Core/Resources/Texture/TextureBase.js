import ContextSafeResourceContainer from "../ContextSafeResourceContainer";
import JThreeEvent from "../../../Base/JThreeEvent";
/**
 *
 */
class TextureBase extends ContextSafeResourceContainer {
    constructor(textureName, flipY, isCubeTexture) {
        super();
        this.__textureFormat = WebGLRenderingContext.RGBA;
        this.__elementFormat = WebGLRenderingContext.UNSIGNED_BYTE;
        this._targetTextureType = WebGLRenderingContext.TEXTURE_2D;
        this._onFilterParameterChangedHandler = new JThreeEvent();
        this._minFilter = WebGLRenderingContext.NEAREST;
        this._magFilter = WebGLRenderingContext.NEAREST;
        this._tWrap = WebGLRenderingContext.CLAMP_TO_EDGE;
        this._sWrap = WebGLRenderingContext.CLAMP_TO_EDGE;
        this._flipY = false;
        if (typeof flipY === "undefined") {
            flipY = false;
        }
        if (typeof isCubeTexture === "undefined") {
            isCubeTexture = false;
        }
        this._flipY = flipY;
        this._targetTextureType = isCubeTexture ? WebGLRenderingContext.TEXTURE_CUBE_MAP : WebGLRenderingContext.TEXTURE_2D;
        this.__initializeForFirst();
    }
    get TargetTextureType() {
        return this._targetTextureType;
    }
    get TextureFormat() {
        return this.__textureFormat;
    }
    get ElementFormat() {
        return this.__elementFormat;
    }
    get FlipY() {
        return this._flipY;
    }
    set FlipY(val) {
        this._flipY = val;
    }
    get MinFilter() {
        return this._minFilter;
    }
    set MinFilter(value) {
        if (value === this._minFilter) {
            return;
        }
        this._minFilter = value;
        this._onFilterParameterChangedHandler.fire(this, WebGLRenderingContext.TEXTURE_MIN_FILTER);
    }
    get MagFilter() {
        return this._magFilter;
    }
    set MagFilter(value) {
        if (value === this._magFilter) {
            return;
        }
        this._magFilter = value;
        this._onFilterParameterChangedHandler.fire(this, WebGLRenderingContext.TEXTURE_MAG_FILTER);
    }
    get SWrap() {
        return this._sWrap;
    }
    set SWrap(value) {
        if (this._sWrap === value) {
            return;
        }
        this._sWrap = value;
        this._onFilterParameterChangedHandler.fire(this, WebGLRenderingContext.TEXTURE_WRAP_S);
    }
    get TWrap() {
        return this._tWrap;
    }
    set TWrap(value) {
        if (this._tWrap === value) {
            return;
        }
        this._tWrap = value;
        this._onFilterParameterChangedHandler.fire(this, WebGLRenderingContext.TEXTURE_WRAP_T);
    }
    onFilterParameterChanged(handler) {
        this._onFilterParameterChangedHandler.addListener(handler);
    }
    generateMipmapIfNeed() {
        switch (this.MinFilter) {
            case WebGLRenderingContext.LINEAR_MIPMAP_LINEAR:
            case WebGLRenderingContext.LINEAR_MIPMAP_NEAREST:
            case WebGLRenderingContext.NEAREST_MIPMAP_LINEAR:
            case WebGLRenderingContext.NEAREST_MIPMAP_NEAREST:
                this.each((v) => {
                    v.bind();
                    v.GL.generateMipmap(this.TargetTextureType);
                });
                break;
            default:
        }
    }
    get TextureName() {
        return this._textureName;
    }
}
export default TextureBase;
