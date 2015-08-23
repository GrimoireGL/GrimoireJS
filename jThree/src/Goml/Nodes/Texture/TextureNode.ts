import GomlTreeNodeBase = require("../../GomlTreeNodeBase");
import GomlLoader = require("../../GomlLoader");
import Texture = require("../../../Core/Resources/Texture/Texture");
import JThreeContext = require("../../../Core/JThreeContext");
import JThreeContextProxy = require("../../../Core/JThreeContextProxy");

class TextureDebugNode extends GomlTreeNodeBase
{
    private targetTexture: Texture;

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
            src: {
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
        this.targetTexture= rm.createTextureWithSource("jthree.goml." + name, null);
        var img = new Image();
        img.onload = () => {
            this.targetTexture.ImageSource = img;
        };
        img.src = this.attributes.getValue("src");
        this.loader.nodeRegister.addObject("jthree.resource.texture",name,this);
    }

}

export =TextureDebugNode;
