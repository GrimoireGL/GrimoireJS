import TextureBase = require("./TextureBase");
import JThreeContext = require("../../JThreeContext");
type ImageSource = HTMLCanvasElement|HTMLImageElement|ImageData|ArrayBufferView;
class CubeTexture extends TextureBase {
    constructor(context: JThreeContext, source: ImageSource[]) {
        super(context);

    }

    private imageSource: ImageSource[] = null;

    public get ImageSource(): ImageSource[]
    {
        return this.imageSource;
    }

    public set ImageSource(img: ImageSource[])
    {
        this.imageSource = img;
        this.each((v) => (<>v).init(true));
        this.generateMipmapIfNeed();
    }
}

export =CubeTexture;