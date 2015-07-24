
import Sprite = require("../../../Core/Materials/SpriteMaterial");
import GomlTreeNodeBase = require("../../GomlTreeNodeBase");
import GomlLoader = require("../../GomlLoader");
import Color4 = require("../../../Base/Color/Color4");
import JThreeID = require("../../../Base/JThreeID");
import MaterialNodeBase = require('./MaterialNodeBase');
import Material = require('../../../Core/Materials/Material')
import JThreeContextProxy = require('../../../Core/JThreeContextProxy');
class SpriteNode extends MaterialNodeBase {
    material: Sprite;

    constructor(elem: HTMLElement, loader: GomlLoader, parent: GomlTreeNodeBase) {
        super(elem, loader, parent);
        this.attributes.defineAttribute({
            "texture":
            {//TODO implement texture node
                value: "tex", converter: "string", handler: (v) => {
                    var context = JThreeContextProxy.getJThreeContext();
                    context.ResourceManager.getTextureHandler(v.Value, (v) => {
                        this.material.Texture = v;
                    });
                }
            }
        });

    }

    protected ConstructMaterial(): Material {
        this.material = new Sprite();
        return this.material;
    }

    beforeLoad() {
        super.beforeLoad();
    }

}

export =SpriteNode;
