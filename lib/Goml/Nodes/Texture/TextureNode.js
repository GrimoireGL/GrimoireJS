import ImageLoader from "../../../Core/Resources/ImageLoader";
import TextureNodeBase from "./TextureNodeBase";
import Q from "q";
/**
 * Basic 2d texture resource node.
 */
class TextureNode extends TextureNodeBase {
    constructor() {
        super();
        this.__groupPrefix = "Texture2D";
        this.attributes.defineAttribute({
            src: {
                converter: "string",
                src: undefined,
                onchanged: this._onSrcAttrChanged.bind(this),
            }
        });
        this.on("update-target", (obj) => {
            this._onSrcAttrChanged.call(this, this.attributes.getAttribute("src"));
        });
    }
    __constructTexture(name, rm) {
        const deferred = Q.defer();
        if (this.attributes.getValue("src")) {
            rm.loadTexture(this.attributes.getValue("src")).then((texture) => {
                deferred.resolve(texture);
            });
        }
        else {
            process.nextTick(() => {
                deferred.resolve(null);
            });
        }
        return deferred.promise;
    }
    _onSrcAttrChanged(attr) {
        if (this.target) {
            ImageLoader.loadImage(attr.Value).then(imgTag => {
                this.target.ImageSource = imgTag;
            });
            attr.done();
        }
    }
}
export default TextureNode;
