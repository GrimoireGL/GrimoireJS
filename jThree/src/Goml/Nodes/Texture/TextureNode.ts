import ResourceManager from "../../../Core/ResourceManager";
import TextureBase from "../../../Core/Resources/Texture/TextureBase";
import TextureNodeBase from "./TextureNodeBase";
import Q from "q";
/**
 * Basic 2d texture resource node.
 */
class TextureNode extends TextureNodeBase {
  protected groupPrefix: string = "Texture2D";

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

export default TextureNode;
