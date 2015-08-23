import GomlTreeNodeBase = require("../../GomlTreeNodeBase");
import GomlLoader = require("../../GomlLoader");
import CubeTexture = require("../../../Core/Resources/Texture/CubeTexture")
import JThreeContextProxy = require("../../../Core/JThreeContextProxy");

class CubeTextureNode extends GomlTreeNodeBase
{
    private targetTexture: CubeTexture;

    /**
     * Texture that is managed by this node.
     */
    public get TargetTexture() {
        return this.targetTexture;
    }

    constructor(elem: HTMLElement, loader: GomlLoader, parent: GomlTreeNodeBase)
    {
        super(elem, loader, parent);
        this.attributes.defineAttribute({
            name: {
                converter: "string",
                value: "",
                constant:true
            },
            srcs: {
                converter: "string",
                src:""
            }
        });
    }

    public beforeLoad()
    {
        super.beforeLoad();
        var rm = JThreeContextProxy.getJThreeContext().ResourceManager;
        var name = this.attributes.getValue("name");
        this.targetTexture = rm.createCubeTextureWithSource("jthree.goml.cubetexture." + name, null);
        var srcsv = this.attributes.getValue("srcs");
        if(srcsv){
        var srcs = srcsv.split(" ");
            for (var i = 0; i < 6; i++) {
                this.loadImg(i,srcs[i]);
            }
        }
        this.loader.nodeRegister.addObject("jthree.resource.cubetexture",name,this);
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
                this.targetTexture.ImageSource = this.loadedImages;
            }
        }
        img.src = src;
    }
}

export =CubeTextureNode;
