import GomlTreeNodeBase = require("../../GomlTreeNodeBase");
import Texture = require("../../../Core/Resources/Texture/Texture");
import ResourceManager = require("../../../Core/ResourceManager");
import TextureBase = require("../../../Core/Resources/Texture/TextureBase");
import TextureNodeBase = require("./TextureNodeBase");
import Q = require("q");
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

  protected generateTexture(name: string, rm: ResourceManager): Q.IPromise<TextureBase> {
    const deferred = Q.defer<TextureBase>();
    if (this.attributes.getValue("src")) {
      rm.loadTexture(this.attributes.getValue("src")).then((texture) => {
        deferred.resolve(texture);
      });
    } else {
      process.nextTick(() => {
        deferred.resolve(null);
      });
    }
    return deferred.promise;
  }

  protected get TextureGroupName() {
    return "Texture2D";
  }
}

export = TextureNode;
