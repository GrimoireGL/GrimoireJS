import BasicMaterial = require("../../../Core/Materials/Base/BasicMaterial");
import SolidColor = require("../../../Core/Materials/Forward/SolidColorMaterial");
import GomlTreeNodeBase = require("../../GomlTreeNodeBase");
import MaterialNodeBase = require('./MaterialNodeBase');
import Material = require('../../../Core/Materials/Material');

class SolidColorNode extends MaterialNodeBase {
  public material: BasicMaterial;

  constructor() {
    super();
  }

  protected ConstructMaterial(): Material {
    this.material = new BasicMaterial(require("../../../Core/Materials/BuiltIn/Materials/SolidColor.html"));
    return this.material;
  }


}

export = SolidColorNode;
