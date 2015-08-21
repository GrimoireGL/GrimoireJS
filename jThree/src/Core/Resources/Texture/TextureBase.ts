import ContextSafeResourceContainer = require("../ContextSafeResourceContainer");
import TextureWrapperBase = require("./TextureWrapperBase");
import TextureParameterType = require("../../../Wrapper/Texture/TextureParameterType");
import TextureMinFilterType = require("../../../Wrapper/Texture/TextureMinFilterType");
import TextureMagFilterType = require("../../../Wrapper/Texture/TextureMagFilterType");
import TextureWrapType = require("../../../Wrapper/Texture/TextureWrapType");
import JThreeEvent = require("../../../Base/JThreeEvent");
import Delegates = require("../../../Base/Delegates");
import JThreeContext = require("../../JThreeContext");
import TextureTargetType = require("../../../Wrapper/TargetTextureType");
/**
 * 
 */
class TextureBase extends ContextSafeResourceContainer<TextureWrapperBase>
{
    private targetTextureType: TextureTargetType = TextureTargetType.Texture2D;

    public get TargetTextureType() {
        return this.targetTextureType;
    }

    private onFilterParameterChangedHandler: JThreeEvent<TextureParameterType> = new JThreeEvent<TextureParameterType>();
    private minFilter: TextureMinFilterType = TextureMinFilterType.Nearest;
    private magFilter: TextureMagFilterType = TextureMagFilterType.Nearest;
    private tWrap: TextureWrapType = TextureWrapType.ClampToEdge;
    private sWrap: TextureWrapType = TextureWrapType.ClampToEdge;
    private flipY: boolean = false;

    constructor(context: JThreeContext,textureName:string);
    constructor(context: JThreeContext,textureName:string, isCubeTexture: boolean);
    constructor(context: JThreeContext,textureName:string, isCubeTexture?: boolean)
    {
        super(context);
        if (typeof isCubeTexture === "undefined") isCubeTexture = false;
        this.targetTextureType = isCubeTexture ? TextureTargetType.CubeTexture : TextureTargetType.Texture2D;
        this.initializeForFirst();
    }


    public get FlipY(): boolean
    {
        return this.flipY;
    }

    public set FlipY(val: boolean)
    {
        this.flipY = val;
    }

    public get MinFilter(): TextureMinFilterType
    {
        return this.minFilter;
    }
    public set MinFilter(value: TextureMinFilterType)
    {
        if (value === this.minFilter) return;
        this.minFilter = value;
        this.onFilterParameterChangedHandler.fire(this, TextureParameterType.MinFilter);
    }

    public get MagFilter(): TextureMagFilterType
    {
        return this.magFilter;
    }
    public set MagFilter(value: TextureMagFilterType)
    {
        if (value === this.magFilter) return;
        this.magFilter = value;
        this.onFilterParameterChangedHandler.fire(this, TextureParameterType.MagFilter);
    }

    public get SWrap(): TextureWrapType
    {
        return this.sWrap;
    }

    public set SWrap(value: TextureWrapType)
    {
        if (this.sWrap === value) return;
        this.sWrap = value;
        this.onFilterParameterChangedHandler.fire(this, TextureParameterType.WrapS);
    }

    public get TWrap(): TextureWrapType
    {
        return this.tWrap;
    }

    public set TWrap(value: TextureWrapType)
    {
        if (this.tWrap === value) return;
        this.tWrap = value;
        this.onFilterParameterChangedHandler.fire(this, TextureParameterType.WrapT);
    }

    public onFilterParameterChanged(handler: Delegates.Action2<TextureBase, TextureParameterType>): void
    {
        this.onFilterParameterChangedHandler.addListerner(handler);
    }

    public generateMipmapIfNeed()
    {
        switch (this.MinFilter)
        {
            case TextureMinFilterType.LinearMipmapLinear:
            case TextureMinFilterType.LinearMipmapNearest:
            case TextureMinFilterType.NearestMipmapLinear:
            case TextureMinFilterType.NearestMipmapNearest:
                this.each((v) =>
                {
                    v.bind();
                    v.OwnerCanvas.GLContext.GenerateMipmap(this.TargetTextureType);
                });
            default:
        }
    }

    private textureName:string;

    public get TextureName(): string {
        return this.textureName;
    }
}

export = TextureBase;