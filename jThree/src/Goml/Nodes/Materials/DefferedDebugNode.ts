import Sprite = require("../../../Core/Materials/SpriteMaterial");
import GomlTreeNodeBase = require("../../GomlTreeNodeBase");
import GomlLoader = require("../../GomlLoader");
import Color4 = require("../../../Base/Color/Color4");
import JThreeID = require("../../../Base/JThreeID");
import MaterialNodeBase = require('./MaterialNodeBase');
import Material = require('../../../Core/Materials/Material')
import JThreeContextProxy = require('../../../Core/JThreeContextProxy');
import ViewportNode = require('../Renderers/ViewPortNode');
class SpriteNode extends MaterialNodeBase {
    material: Sprite;

    constructor(elem: HTMLElement, loader: GomlLoader, parent: GomlTreeNodeBase) {
        super(elem, loader, parent);
        this.attributes.defineAttribute({
            "target":{
                value:"rb1",converter:"string"
            },
            "viewport":
            {//TODO implement texture node
                value: "viewport", converter: "string", handler: (v) => {
                    var context = JThreeContextProxy.getJThreeContext();
                    var viewportTargets=loader.getNodeByQuery(v.Value);
                    if(viewportTargets.length>0){
                      var viewport=<ViewportNode>viewportTargets[0];
                    context.ResourceManager.getTextureHandler(viewport.TargetViewport.ID+".deffered."+this.attributes.getValue("target"), (v) => {
                        this.material.Texture = v;
                    });
                    }
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
