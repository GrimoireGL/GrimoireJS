import MaterialNodeBase = require("./MaterialNodeBase");
import Material = require("../../../Core/Materials/Material");
// import TextureNode = require("../Texture/TextureNode");

class PhongNode extends MaterialNodeBase {
  constructor() {
    super();
  }

  // private _onTextureAttrChanged(attr): void {
  //   if (attr.Value) {
  //     this.nodeImport("jthree.resource.texture2D", attr.Value, (node: TextureNode) => {
  //       this.material.materialVariables["texture"] = node.TargetTexture;
  //     });
  //   }
  // }

  protected onMount(): void {
    super.onMount();
  }

  protected ConstructMaterial(): Material {
    return this.__getMaterialFromMatName("jthree.basic.phong");
  }
}

export = PhongNode;
