import GomlTreeNodeBase = require("../../GomlTreeNodeBase");
import GomlLoader = require("../../GomlLoader");
import CubeTexture = require("../../../Core/Resources/Texture/CubeTexture")
import JThreeContextProxy = require("../../../Core/JThreeContextProxy");
import TextureNodeBase = require("./TextureNodeBase");
import ResourceManager = require("../../../Core/ResourceManager");
import TextureBase = require("../../../Core/Resources/Texture/TextureBase");
/**
 * Cube texture resource node.
 */
class CubeTextureNode extends TextureNodeBase
{

    constructor(elem: HTMLElement, loader: GomlLoader, parent: GomlTreeNodeBase)
    {
        super(elem, loader, parent);
        this.attributes.defineAttribute({
            srcs: {
              // this src should be passed by splitted with ' '(space).
              // src urls should be arranged in the layout below.
              // PositiveX NegativeX PositiveY NegativeY PositiveZ NegativeZ
                converter: "string",
                src:""
            }
        });
    }

    protected generateTexture(name: string, rm: ResourceManager): TextureBase
    {
        var texture=rm.createCubeTextureWithSource("jthree.goml.cubetexture." + name, null, false);
        var srcsv = this.attributes.getValue("srcs");
        if (srcsv)
        {
            var srcs = srcsv.split(" ");
            for (var i = 0; i < 6; i++)
            {
                this.loadImg(i, srcs[i]);
            }
        }
        return texture;
    }

    protected get TextureGroupName()
    {
        return "cubetexture";
    }

    private loadedFlags: boolean[] = [false, false, false, false, false, false];

    private loadedImages:HTMLImageElement[] =[null,null,null,null,null,null];

    private loadImg(index:number,src:string) {
        var img = this.loadedImages[index] = new Image();
        img.onload = () =>
        {
            this.loadedFlags[index] = true;
            var allTrue = true;
            for (var j = 0; j < 6; j++)
            {
                if (!this.loadedFlags[j]) allTrue = false;
            }
            if (allTrue)
            {
                (<CubeTexture>this.TargetTexture).ImageSource = this.loadedImages;
            }
        }
        img.src = src;
    }
}

export =CubeTextureNode;
