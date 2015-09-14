import GomlTreeNodeBase = require("../../GomlTreeNodeBase");
import GomlLoader = require("../../GomlLoader");
import Texture = require("../../../Core/Resources/Texture/Texture");
import JThreeContextProxy = require("../../../Core/JThreeContextProxy");
import ResourceManager = require("../../../Core/ResourceManager")
import TextureBase = require("../../../Core/Resources/Texture/TextureBase")
import TextureNodeBase = require("./TextureNodeBase");
/**
 * Basic 2d texture resource node.
 */
class TextureNode extends TextureNodeBase
{
    constructor(elem: HTMLElement, loader: GomlLoader, parent: GomlTreeNodeBase)
    {
        super(elem, loader, parent);
        this.attributes.defineAttribute({
            src: {
                converter: "string",
                src:""
            }
        });
    }

    protected generateTexture(name: string, rm: ResourceManager): TextureBase
    {
        var texture =rm.createTextureWithSource("jthree.goml.texture." + name, null);
        var img = new Image();
        img.onload = () =>
        {
            (<Texture>this.TargetTexture).ImageSource = img;
        };
        img.src = this.attributes.getValue("src");
        return texture;
    }

    protected get TextureGroupName()
    {
        return "texture2d";
    }
}

export =TextureNode;
