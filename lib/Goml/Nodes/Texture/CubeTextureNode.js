import TextureNodeBase from "./TextureNodeBase";
import Q from "q";
/**
 * Cube texture resource node.
 */
class CubeTextureNode extends TextureNodeBase {
    constructor() {
        super();
        this.__groupPrefix = "TextureCube";
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
    __constructTexture(name, rm) {
        const deferred = Q.defer();
        const srcsv = this.attributes.getValue("srcs");
        if (srcsv) {
            const srcs = srcsv.split(" ");
            rm.loadCubeTexture(srcs).then((texture) => {
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
}
export default CubeTextureNode;
