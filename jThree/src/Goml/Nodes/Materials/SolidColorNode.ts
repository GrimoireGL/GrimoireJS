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
      }
    });
    this.attributes.getAttribute('color').on('changed', ((attr) => {
      this.material.Color = v.Value;
    }).bind(this));
  }

  protected ConstructMaterial(): Material {
    this.material = new SolidColor();
    return this.material;
  }

  public beforeLoad() {
    super.beforeLoad();
  }
}

export = SolidColorNode;
