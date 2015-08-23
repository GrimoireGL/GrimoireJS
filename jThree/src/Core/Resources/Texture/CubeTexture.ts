import TextureBase = require("./TextureBase");
import JThreeContext = require("../../JThreeContext");
import CubeTextureWrapper = require("./CubeTextureWrapper");
import ContextManagerBase = require("../../ContextManagerBase");
type ImageSource = HTMLCanvasElement|HTMLImageElement|ImageData|ArrayBufferView;
class CubeTexture extends TextureBase
{
    constructor(context: JThreeContext, source: ImageSource[],textureName:string)
    {
        super(context,textureName,true);
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

    protected getInstanceForRenderer(contextManager: ContextManagerBase): CubeTextureWrapper
    {
        var textureWrapper = new CubeTextureWrapper(contextManager, this);
        return textureWrapper;
    }
}

export =CubeTexture;