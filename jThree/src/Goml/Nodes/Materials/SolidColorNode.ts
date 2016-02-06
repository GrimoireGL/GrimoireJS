import MaterialNodeBase from "./MaterialNodeBase";
import Material from "../../../Core/Materials/Material";

class SolidColorNode extends MaterialNodeBase<Material> {
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

export default SolidColorNode;
