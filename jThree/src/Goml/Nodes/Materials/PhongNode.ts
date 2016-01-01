import ContextComponents = require("../../../ContextComponents");
import MaterialManager = require("../../../Core/Materials/Base/MaterialManager");
import JThreeContext = require("../../../JThreeContext");
import Phong = require("../../../Core/Materials/Forward/PhongMaterial");
﻿import BasicMaterial = require("../../../Core/Materials/Base/BasicMaterial");
import GomlTreeNodeBase = require("../../GomlTreeNodeBase");
import MaterialNodeBase = require('./MaterialNodeBase');
import Material = require('../../../Core/Materials/Material')
import TextureNode = require("../Texture/TextureNode")
class PhongNode extends MaterialNodeBase {
  public material: Phong;

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

  protected nodeWillMount(parent: GomlTreeNodeBase): void {
    super.nodeWillMount(parent);
  }

}

export = PhongNode;
