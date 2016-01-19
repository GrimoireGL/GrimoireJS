import GomlTreeNodeBase = require("../../GomlTreeNodeBase");
import CubeTexture = require("../../../Core/Resources/Texture/CubeTexture")
import TextureNodeBase = require("./TextureNodeBase");
import ResourceManager = require("../../../Core/ResourceManager");
import TextureBase = require("../../../Core/Resources/Texture/TextureBase");
import Q = require("q");
/**
 * Cube texture resource node.
 */
class CubeTextureNode extends TextureNodeBase {

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

  protected generateTexture(name: string, rm: ResourceManager): Q.IPromise<TextureBase> {
    const deferred = Q.defer<TextureBase>();
    var srcsv = this.attributes.getValue("srcs");
    if (srcsv) {
      var srcs = srcsv.split(" ");
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

  protected get TextureGroupName() {
    return "cubetexture";
  }
}

export =CubeTextureNode;
