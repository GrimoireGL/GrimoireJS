import GomlTreeNodeBase = require("../../GomlTreeNodeBase");
import GomlLoader = require("../../GomlLoader");
import TextureBase = require("../../../Core/Resources/Texture/TextureBase");
import JThreeContextProxy = require("../../../Core/JThreeContextProxy");
import ResourceManager = require("../../../Core/ResourceManager");
import MinFilterType = require("../../../Wrapper/Texture/TextureMinFilterType");
import MagFilterType = require("../../../Wrapper/Texture/TextureMagFilterType");
class TextureNodeBase extends GomlTreeNodeBase
{
    private targetTexture: TextureBase;

    /**
     * Texture that is managed by this node.
     */
    public get TargetTexture()
    {
        return this.targetTexture;
    }

    constructor(elem: HTMLElement, loader: GomlLoader, parent: GomlTreeNodeBase)
    {
        super(elem, loader, parent);
        this.attributes.defineAttribute({//TODO add min/mag filter
            name: {
                converter: "string",
                value: "",
                constant: true
            },
            minFilter:
            {
                converter: "string",
                value: "LINEAR",
                handler: (v) =>
                {
                    this.targetTexture.MinFilter = this.toMinFilterParameter(v.Value);
                }
            },
            magFilter:
            {
                converter: "string",
                value: "LINEAR",
                handler: (v) =>
                {
                    this.targetTexture.MagFilter = this.toMagFilterParameter(v.Value);
                }
            }
        });
    }

    public beforeLoad()
    {
        super.beforeLoad();
        var rm = JThreeContextProxy.getJThreeContext().ResourceManager;
        var name = this.attributes.getValue("name");
        this.targetTexture = this.generateTexture(name, rm);
        this.loader.nodeRegister.addObject("jthree.resource." + this.TextureGroupName, name, this);
    }

    protected generateTexture(name: string, rm: ResourceManager): TextureBase
    {
        return null;
    }

    protected get TextureGroupName()
    {
        return "";
    }

    private toMinFilterParameter(attr: string): MinFilterType
    {
        attr = attr.toUpperCase();
        switch (attr)
        {
            case "NEARESTMIPLINEAR":
                return MinFilterType.NearestMipmapLinear;
            case "NEARESTMIPNEAREST":
                return MinFilterType.NearestMipmapNearest;
            case "LINEARMIPLINEAR":
                return MinFilterType.LinearMipmapLinear;
            case "LINEARMIPNEAREST":
                return MinFilterType.LinearMipmapNearest;
            case "NEAREST":
                return MinFilterType.Nearest;
            case "LINEAR":
            default:
                return MinFilterType.Linear;
        }
    }

    private toMagFilterParameter(attr: string): MagFilterType
    {
        attr = attr.toUpperCase();
        switch (attr)
        {
            case "NEAREST":
                return MagFilterType.Nearest;
            case "LINEAR":
            default:
                return MagFilterType.Linear;
        }
    }
}

export =TextureNodeBase;
