import TextureBase from "./TextureBase";
import CubeTextureWrapper from "./CubeTextureWrapper";
class CubeTexture extends TextureBase {
    constructor(source, textureName, flipY) {
        super(textureName, flipY, true);
        this._imageSource = null;
        this.ImageSource = source;
    }
    get ImageSource() {
        return this._imageSource;
    }
    set ImageSource(img) {
        this._imageSource = img;
        this.each((v) => v.init(true));
        this.generateMipmapIfNeed();
    }
    __createWrapperForCanvas(canvas) {
        const textureWrapper = new CubeTextureWrapper(canvas, this);
        return textureWrapper;
    }
}
export default CubeTexture;
