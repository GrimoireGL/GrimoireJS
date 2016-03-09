import IndexedGeometry from "./IndexedGeometry";
/**
 * Basic geometry for builtin primitives. This geometry contains position,normal,uv as buffer.
 *
 * ビルトインのプリミティブのためのジオメトリ、このジオメトリはposition,normal,uvをバッファとして持つ。
 * @type {[type]}
 */
class BasicGeometry extends IndexedGeometry {
    applyAttributeVariables(pWrapper, attributes) {
        this.__assignAttributeIfExists(pWrapper, attributes, "position", this.positionBuffer);
        this.__assignAttributeIfExists(pWrapper, attributes, "normal", this.normalBuffer);
        this.__assignAttributeIfExists(pWrapper, attributes, "uv", this.uvBuffer);
    }
    dispose() {
        // TODO implement this
    }
}
export default BasicGeometry;
