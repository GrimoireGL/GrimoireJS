import Texture = require("../../../Core/Resources/Texture/Texture");
import ResourceManager = require("../../../Core/ResourceManager");
import TextureBase = require("../../../Core/Resources/Texture/TextureBase");
import TextureNodeBase = require("./TextureNodeBase");
/**
 * Basic 2d texture resource node.
 */
class TextureNode extends TextureNodeBase {
  protected groupPrefix: string = "texture2d";

  constructor() {
    super();
    this.attributes.defineAttribute({
      src: {
        converter: "string",
        src: ""
      }
    });
  }

  protected constructTexture(name: string, rm: ResourceManager): TextureBase {
    const texture = rm.createTextureWithSource(name, null);
    const img = new Image();
    img.onload = () => {
      (<Texture>this.TargetTexture).ImageSource = img;
    };
    img.src = this.attributes.getValue("src");
    return texture;
  }
}

export = TextureNode;
