import MaterialNodeBase = require("./MaterialNodeBase");
import Material = require("../../../Core/Materials/Material");

class SolidColorNode extends MaterialNodeBase {
  constructor() {
    super();
  }

  protected onMount(): void {
    super.onMount();
  }

  protected ConstructMaterial(): Material {
    return this.__getMaterialFromMatName("jthree.basic.solid");
  }
}

export = SolidColorNode;
