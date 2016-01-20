import ResourceManager = require("../../../Core/ResourceManager");
import TextureBase = require("../../../Core/Resources/Texture/TextureBase");
import TextureNodeBase = require("./TextureNodeBase");
import Q = require("q");
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

  protected constructTexture(name: string, rm: ResourceManager): Q.IPromise<TextureBase> {
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
}

export = TextureNode;
