import TextureWrapper from "./TextureWrapper";
import TextureBase from "./TextureBase";
class Texture extends TextureBase {
    constructor(source, textureName) {
        super(textureName);
        this._imageSource = null;
        this._imageSource = source;
    }
    get ImageSource() {
        return this._imageSource;
    }
    set ImageSource(img) {
        this._imageSource = img;
        this.each((v) => v.updateTexture());
        this.generateMipmapIfNeed();
    }
    __createWrapperForCanvas(canvas) {
        const textureWrapper = new TextureWrapper(canvas, this);
        return textureWrapper;
    }
}
export default Texture;
