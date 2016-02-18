import TextureWrapper from "./TextureWrapper";
import Canvas from "../../Canvas/Canvas";
import TextureBase from "./TextureBase";
type ImageSource = HTMLCanvasElement|HTMLImageElement|ImageData|ArrayBufferView;

class Texture extends TextureBase {

  private imageSource: ImageSource = null;

  constructor(source: ImageSource, textureName: string) {
    super(textureName);
    this.imageSource = source;
  }

  public get ImageSource(): ImageSource {
    return this.imageSource;
  }

  public set ImageSource(img: ImageSource) {
    this.imageSource = img;
    this.each((v) => (v as TextureWrapper).updateTexture());
    this.generateMipmapIfNeed();
  }

  protected createWrapperForCanvas(canvas: Canvas): TextureWrapper {
    const textureWrapper = new TextureWrapper(canvas, this);
    return textureWrapper;
  }

}

export default Texture;
