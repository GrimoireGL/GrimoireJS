import TextureNodeBase = require("./TextureNodeBase");
import ResourceManager = require("../../../Core/ResourceManager");
import TextureBase = require("../../../Core/Resources/Texture/TextureBase");
import Q = require("q");
/**
 * Cube texture resource node.
 */
class CubeTextureNode extends TextureNodeBase {
  protected groupPrefix: string = "TextureCube";

  constructor() {
    super();
    this.attributes.defineAttribute({
      srcs: {
        // this src should be passed by splitted with ' '(space).
        // src urls should be arranged in the layout below.
        // PositiveX NegativeX PositiveY NegativeY PositiveZ NegativeZ
        converter: "string",
        src: ""
      }
    });
  }

  protected constructTexture(name: string, rm: ResourceManager): Q.IPromise<TextureBase> {
    const deferred = Q.defer<TextureBase>();
    const srcsv = this.attributes.getValue("srcs");
    if (srcsv) {
      const srcs = srcsv.split(" ");
      rm.loadCubeTexture(srcs).then((texture) => {
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

export = CubeTextureNode;
