import GomlTreeNodeBase = require("../../GomlTreeNodeBase");
import Texture = require("../../../Core/Resources/Texture/Texture");
import ResourceManager = require("../../../Core/ResourceManager")
import TextureBase = require("../../../Core/Resources/Texture/TextureBase")
import TextureNodeBase = require("./TextureNodeBase");
/**
 * Basic 2d texture resource node.
 */
class TextureNode extends TextureNodeBase {
  constructor() {
    super();
    this.attributes.defineAttribute({
      src: {
        converter: "string",
        src: ""
      }
    });
  }

  protected generateTexture(name: string, rm: ResourceManager): TextureBase {
    var texture = rm.createTextureWithSource("jthree.goml.texture." + name, null);
    var img = new Image();
    img.onload = () => {
      (<Texture>this.TargetTexture).ImageSource = img;
    };
    img.src = this.attributes.getValue("src");
    return texture;
  }

  protected groupPrefix: string = 'texture2d';
}

export =TextureNode;
