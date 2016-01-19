import ContextComponents = require("../../../ContextComponents");
import MaterialManager = require("../../../Core/Materials/Base/MaterialManager");
import JThreeContext = require("../../../JThreeContext");
﻿import BasicMaterial = require("../../../Core/Materials/Base/BasicMaterial");
import GomlTreeNodeBase = require("../../GomlTreeNodeBase");
import MaterialNodeBase = require("./MaterialNodeBase");
import Material = require("../../../Core/Materials/Material");
import TextureNode = require("../Texture/TextureNode")
class PhongNode extends MaterialNodeBase {
  public material: BasicMaterial;

  constructor() {
    super();
  }

  private _onTextureAttrChanged(attr): void {
    if (attr.Value) {
      this.nodeManager.nodeRegister.getObject("jthree.resource.texture2d", attr.Value, (node: TextureNode) => {
        this.material.materialVariables["texture"] = node.TargetTexture;
      });
    }
  }

  protected ConstructMaterial(): Material {
    this.material = this.__getMaterialFromMatName("jthree.basic.phong");
    return this.material;
  }

  protected onMount(): void {
    super.onMount();
  }

}

export = PhongNode;
