import CubeTexture from "../../../Core/Resources/Texture/CubeTexture";
﻿import TextureNodeBase from "./TextureNodeBase";
import ResourceManager from "../../../Core/ResourceManager";
import Q from "q";
/**
 * Cube texture resource node.
 */
class CubeTextureNode extends TextureNodeBase<CubeTexture> {
  protected __groupPrefix: string = "TextureCube";

  constructor() {
    super();
    this.attributes.defineAttribute({
      srcs: {
        // this src should be passed by splitted with ' '(space).
        // src urls should be arranged in the layout below.
        // PositiveX NegativeX PositiveY NegativeY PositiveZ NegativeZ
        converter: "string",
        src: undefined,
        constant: true,
      }
    });
  }

  protected __constructTexture(name: string, rm: ResourceManager): Q.IPromise<CubeTexture> {
    const deferred = Q.defer<CubeTexture>();
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

export default CubeTextureNode;
