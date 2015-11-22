import DebugSprite = require("../../../Core/Materials/SpriteMaterial");
import GomlTreeNodeBase = require("../../GomlTreeNodeBase");
import GomlLoader = require("../../GomlLoader");
import MaterialNodeBase = require('./MaterialNodeBase');
import Material = require('../../../Core/Materials/Material')
import ContextComponents = require("../../../ContextComponents");
import JThreeContext = require("../../../NJThreeContext");
import ResourceManager = require("../../../Core/ResourceManager");
class TextureDebugNode extends MaterialNodeBase {
    public material: DebugSprite;

    constructor(elem: HTMLElement, parent: GomlTreeNodeBase) {
        super(elem, parent);
        this.attributes.defineAttribute({
            "target": {
                value: "rb1", converter: "string",
                handler: (v) => {
                        JThreeContext.getContextComponent<ResourceManager>(ContextComponents.ResourceManager)
                          .getTextureHandler(this.attributes.getValue("target"), (v) => {
                            this.material.texture = v;
                        });
                }
            },
            "R":
            {
                value: "0", converter: "number", handler: (v) => { this.material.ctR = v.Value; }
            },

            "G":
            {
                value: "1", converter: "number", handler: (v) => { this.material.ctG = v.Value; }
            },

            "B":
            {
                value: "2", converter: "number", handler: (v) => { this.material.ctB = v.Value; }
            },

            "A":
            {
                value: "3", converter: "number", handler: (v) => { this.material.ctA = v.Value; }
            },
        });

    }

    protected ConstructMaterial(): Material {
        this.material = new DebugSprite();
        return this.material;
    }

    public beforeLoad() {
        super.beforeLoad();
    }

}

export =TextureDebugNode;
