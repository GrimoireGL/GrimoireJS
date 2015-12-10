import SolidColor = require("../../../Core/Materials/Forward/SolidColorMaterial");
import GomlTreeNodeBase = require("../../GomlTreeNodeBase");
import MaterialNodeBase = require('./MaterialNodeBase');
import Material = require('../../../Core/Materials/Material');

class SolidColorNode extends MaterialNodeBase {
  public material: SolidColor;

  constructor() {
    super();
    this.attributes.defineAttribute({
      "color": {
        value: "#0FC",
        converter: "color4",
        onchanged: (attr) => {
          this.material.Color = attr.Value;
        },
      }
    });
  }

  protected ConstructMaterial(): Material {
    this.material = new SolidColor();
    return this.material;
  }

  protected nodeDidMounted() {
    super.nodeDidMounted();
  }
}

export = SolidColorNode;
