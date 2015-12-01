import TextureBase = require("./TextureBase");
import CubeTextureWrapper = require("./CubeTextureWrapper");
import Canvas = require("../../Canvas");
type ImageSource = HTMLCanvasElement|HTMLImageElement|ImageData|ArrayBufferView;
class CubeTexture extends TextureBase
{
    constructor(source: ImageSource[],textureName:string,flipY:boolean)
    {
        super(textureName,flipY,true);
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

    protected getInstanceForRenderer(canvas: Canvas): CubeTextureWrapper
    {
        var textureWrapper = new CubeTextureWrapper(canvas, this);
        return textureWrapper;
    }
}

export =CubeTexture;