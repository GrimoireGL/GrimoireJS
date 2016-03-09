import jThreeObject from "../../../Base/JThreeObject";
/**
 * Base abstraction for geometry.
 */
class Geometry extends jThreeObject {
    constructor(...args) {
        super(...args);
        this.primitiveTopology = WebGLRenderingContext.TRIANGLES;
    }
    get GeometryOffset() {
        return 0;
    }
    __assignAttributeIfExists(pWrapper, attributes, valName, buffer) {
        if (attributes[valName]) {
            pWrapper.assignAttributeVariable(valName, buffer);
        }
    }
}
export default Geometry;
