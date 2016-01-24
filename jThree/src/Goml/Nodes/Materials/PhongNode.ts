import MaterialNodeBase = require("./MaterialNodeBase");
import Material = require("../../../Core/Materials/Material");
// import TextureNode = require("../Texture/TextureNode");

class PhongNode extends MaterialNodeBase {
  constructor() {
    super();
  }

  protected onMount(): void {
    super.onMount();
  }

  protected ConstructMaterial(): Material {
    return this.__getMaterialFromMatName("jthree.basic.phong");
  }
}

export = PhongNode;
