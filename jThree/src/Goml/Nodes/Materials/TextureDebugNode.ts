import DebugSprite = require("../../../Core/Materials/DebugSpriteMaterial");
import GomlTreeNodeBase = require("../../GomlTreeNodeBase");
import GomlLoader = require("../../GomlLoader");
import MaterialNodeBase = require("./MaterialNodeBase");
import Material = require("../../../Core/Materials/Material")
import JThreeContextProxy = require("../../../Core/JThreeContextProxy");

class TextureDebugNode extends MaterialNodeBase {
    material: DebugSprite;

    constructor(elem: HTMLElement, loader: GomlLoader, parent: GomlTreeNodeBase) {
        super(elem, loader, parent);
        this.attributes.defineAttribute({
            "target": {
                value: "rb1", converter: "string",
                handler: (v) => {
                    var context = JThreeContextProxy.getJThreeContext();
                        context.ResourceManager.getTextureHandler(this.attributes.getValue("target"), (v) => {
                            this.material.Texture = v;
                        });
                }
            },
            "R":
            {
                value: "0", converter: "number", handler: (v) => { this.material.CTR = v.Value; }
            },

            "G":
            {
                value: "1", converter: "number", handler: (v) => { this.material.CTG = v.Value; }
            },

            "B":
            {
                value: "2", converter: "number", handler: (v) => { this.material.CTB = v.Value; }
            },

            "A":
            {
                value: "3", converter: "number", handler: (v) => { this.material.CTA = v.Value; }
            },
        });

    }

    protected ConstructMaterial(): Material {
        this.material = new DebugSprite();
        return this.material;
    }

    beforeLoad() {
        super.beforeLoad();
    }

}

export =TextureDebugNode;
