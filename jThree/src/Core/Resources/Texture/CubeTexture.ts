import TextureBase = require("./TextureBase");
import JThreeContext = require("../../JThreeContext");
import CubeTextureWrapper = require("./CubeTextureWrapper");
type ImageSource = HTMLCanvasElement|HTMLImageElement|ImageData|ArrayBufferView;
class CubeTexture extends TextureBase
{
    constructor(context: JThreeContext, source: ImageSource[])
    {
        super(context);
        this.ImageSource = source;
    }

    private imageSource: ImageSource[] = null;

    public get ImageSource(): ImageSource[]
    {
        return this.imageSource;
    }

    public set ImageSource(img: ImageSource[])
    {
        this.imageSource = img;
        this.each((v) => (<CubeTextureWrapper>v).init(true));
        this.generateMipmapIfNeed();
    }
}

export =CubeTexture;