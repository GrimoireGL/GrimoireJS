
import Sprite = require("../../../Core/Materials/SpriteMaterial");
import GomlTreeNodeBase = require("../../GomlTreeNodeBase");
import MaterialNodeBase = require('./MaterialNodeBase');
import Material = require('../../../Core/Materials/Material')
import ResourceManager = require("../../../Core/ResourceManager");
import JThreeContext = require("../../../NJThreeContext");
import ContextComponents = require("../../../ContextComponents");
class SpriteNode extends MaterialNodeBase {
    public material: Sprite;

    constructor(elem: HTMLElement, parent: GomlTreeNodeBase) {
        super(elem, parent);
        this.attributes.defineAttribute({
            "texture":
            {//TODO implement texture node
                value: "tex", converter: "string", handler: (v) => {
                    JThreeContext.getContextComponent<ResourceManager>(ContextComponents.ResourceManager).getTextureHandler(v.Value, (v) => {
                        this.material.texture = v;
                    });
                }
            }
        });

    }

    protected ConstructMaterial(): Material {
        this.material = new Sprite();
        return this.material;
    }

    public beforeLoad() {
        super.beforeLoad();
    }

}

export =SpriteNode;
