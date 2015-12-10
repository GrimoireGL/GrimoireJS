import DebugSprite = require("../../../Core/Materials/Forward/SpriteMaterial");
import GomlTreeNodeBase = require("../../GomlTreeNodeBase");
import MaterialNodeBase = require('./MaterialNodeBase');
import Material = require('../../../Core/Materials/Material')
import ContextComponents = require("../../../ContextComponents");
import JThreeContext = require("../../../JThreeContext");
import ResourceManager = require("../../../Core/ResourceManager");

class TextureDebugNode extends MaterialNodeBase {
  public material: DebugSprite;

  constructor() {
    super();
    this.attributes.defineAttribute({
      "target": {
        value: "rb1",
        converter: "string",
        onchanged: this._onTargetAttrChanged,
      },
      "R": {
        value: "0",
        converter: "number",
        onchanged: (attr) => {
          this.material.ctR = attr.Value;
        },
      },
      "G": {
        value: "1",
        converter: "number",
        onchanged: (attr) => {
          this.material.ctG = attr.Value;
        },
      },
      "B": {
        value: "2",
        converter: "number",
        onchanged: (attr) => {
          this.material.ctB = attr.Value;
        },
      },
      "A": {
        value: "3",
        converter: "number",
        onchanged: (attr) => {
          this.material.ctA = attr.Value;
        },
      },
    });
  }

  private _onTargetAttrChanged(attr): void {
    JThreeContext.getContextComponent<ResourceManager>(ContextComponents.ResourceManager)
      .getTextureHandler(this.attributes.getValue("target"), (v) => {
        this.material.texture = v;
    });
  }

  protected ConstructMaterial(): Material {
    this.material = new DebugSprite();
    return this.material;
  }

  protected nodeDidMounted() {
    super.nodeDidMounted();
  }

}

export = TextureDebugNode;
