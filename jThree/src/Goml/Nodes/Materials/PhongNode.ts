import MaterialNodeBase from "./MaterialNodeBase";
import Material from "../../../Core/Materials/Material";
// import TextureNode from "../Texture/TextureNode";

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

export default PhongNode;
