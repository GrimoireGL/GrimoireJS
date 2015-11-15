import GomlTreeNodeBase = require("../../GomlTreeNodeBase");
import GomlLoader = require("../../GomlLoader");
import TextureBase = require("../../../Core/Resources/Texture/TextureBase");
import ResourceManager = require("../../../Core/ResourceManager");
import MinFilterType = require("../../../Wrapper/Texture/TextureMinFilterType");
import MagFilterType = require("../../../Wrapper/Texture/TextureMagFilterType");
import TextureWrapType = require("../../../Wrapper/Texture/TextureWrapType");
import JThreeContext = require("../../../NJThreeContext");
import ContextComponents = require("../../../ContextComponents");
/**
 * All texture resource node class inherit this class.
 */
class TextureNodeBase extends GomlTreeNodeBase
{
    /**
     * Texture reference being managed by this node.
     * @type {TextureBase}
     */
    private targetTexture: TextureBase;

    /**
     * Texture reference being managed by this node.
     */
    public get TargetTexture()
    {
        return this.targetTexture;
    }

    constructor(elem: HTMLElement, loader: GomlLoader, parent: GomlTreeNodeBase)
    {
        super(elem, loader, parent);
        this.attributes.defineAttribute({
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
            },
            twrap:{
              converter:"string",
              value:"clamp",
              handler:(v)=>{
                this.targetTexture.TWrap = this.toWrapParameter(v.Value);
              }
            },
            swrap:
            {
              converter:"string",
              value:"clamp",
              handler:(v)=>{
                this.targetTexture.SWrap = this.toWrapParameter(v.Value);
              }
            }
        });
    }

    public beforeLoad()
    {
        super.beforeLoad();
        var rm = JThreeContext.getContextComponent<ResourceManager>(ContextComponents.ResourceManager);
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
    /**
     * Min filter attribute string is changed into enum by this method.
     * @param  {string}        Attribute string
     * @return {MinFilterType} Enum value being passed into gl context.
     */
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
    /**
     * Mag filter attribute string is changed into enum by this method.
     * @param  {string}        attr Attribute string
     * @return {MagFilterType}      Enum value being passed into gl context.
     */
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
    /**
     * Wrap attribute string is changed into enum by this method.
     * @param  {string} attr Attribute string
     * @return {[type]}      Enum value being passed into gl context.
     */
    private toWrapParameter(attr:string)
    {
      attr = attr.toUpperCase();
      switch(attr)
      {
        case "REPEAT":
          return TextureWrapType.Repeat;
        case "MIRRORED_REPEAT":
          return TextureWrapType.MirroredRepeat;
          default:
          case "CLAMP":
            return TextureWrapType.ClampToEdge;
      }
    }
}

export =TextureNodeBase;
