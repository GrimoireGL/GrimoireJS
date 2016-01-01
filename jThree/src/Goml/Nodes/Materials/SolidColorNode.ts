import BasicMaterial = require("../../../Core/Materials/Base/BasicMaterial");
import GomlTreeNodeBase = require("../../GomlTreeNodeBase");
import MaterialNodeBase = require('./MaterialNodeBase');
import Material = require('../../../Core/Materials/Material');

class SolidColorNode extends MaterialNodeBase {
  public material: BasicMaterial;

  constructor() {
    super();
  }

  protected ConstructMaterial(): Material {
    this.material = this.__getMaterialFromMatName("jthree.basic.solid");
    return this.material;
  }

  protected nodeDidMounted() {
    super.nodeDidMounted();
  }
}

export = SolidColorNode;
