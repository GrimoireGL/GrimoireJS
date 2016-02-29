import Texture from "../../../Core/Resources/Texture/Texture";
import ImageLoader from "../../../Core/Resources/ImageLoader";
import ResourceManager from "../../../Core/ResourceManager";
import TextureBase from "../../../Core/Resources/Texture/TextureBase";
import TextureNodeBase from "./TextureNodeBase";
import GomlAttribute from "../../GomlAttribute";
import Q from "q";
/**
 * Basic 2d texture resource node.
 */
class TextureNode extends TextureNodeBase<Texture> {
  protected __groupPrefix: string = "Texture2D";

  constructor() {
    super();
    this.attributes.defineAttribute({
      src: {
        converter: "string",
        src: undefined,
        onchanged: this._onSrcAttrChanged.bind(this),
      }
    });
    this.on("update-target", (obj: Texture) => {
      this._onSrcAttrChanged.call(this, this.attributes.getAttribute("src"));
    });
  }

  protected __constructTexture(name: string, rm: ResourceManager): Q.IPromise<Texture> {
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

  private _onSrcAttrChanged(attr: GomlAttribute): void {
    if (this.target) {
      ImageLoader.loadImage(attr.Value).then(imgTag => {
        this.target.ImageSource = imgTag;
      });
      attr.done();
    }
  }
}

export default TextureNode;
