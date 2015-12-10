
import Phong = require("../../../Core/Materials/Forward/PhongMaterial");
import GomlTreeNodeBase = require("../../GomlTreeNodeBase");
import MaterialNodeBase = require('./MaterialNodeBase');
import Material = require('../../../Core/Materials/Material')
import TextureNode = require("../Texture/TextureNode")
class PhongNode extends MaterialNodeBase {
  public material: Phong;

  constructor() {
    super();
    this.attributes.defineAttribute({
      "diffuse": {
        value: "#f0C",
        converter: "color4",
      },
      "ambient": {
        value: "#222",
        converter: "color4",
      },
      "specular": {
        value: "#CCC",
        converter: "color3",
      },
      "specularpower": {
        value: 10,
        converter: "number",
      },
      "texture": {
        value: null,
        converter: "string",
      }
    });
    this.attributes.getAttribute('diffuse').on('changed', ((attr) => {
      this.material.diffuse = attr.Value;
    }).bind(this));
    this.attributes.getAttribute('ambient').on('changed', ((attr) => {
      this.material.ambient = attr.Value;
    }).bind(this));
    this.attributes.getAttribute('specular').on('changed', ((attr) => {
      this.material.specular = attr.Value;
    }).bind(this));
    this.attributes.getAttribute('specularpower').on('changed', ((attr) => {
      this.material.specularCoefficient = attr.Value;
    }).bind(this));
    this.attributes.getAttribute('texture').on('changed', this._onTextureAttrChanged.bind(this));
  }

  private _onTextureAttrChanged(attr): void {
    if (attr.Value) {
      this.material.texture = (<TextureNode>this.nodeManager.nodeRegister.getObject("jthree.resource.texture2d", attr.Value)).TargetTexture;
    }
  }

  protected ConstructMaterial(): Material {
    this.material = new Phong();
    return this.material;
  }

}

export = PhongNode;
