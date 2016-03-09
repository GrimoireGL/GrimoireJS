import GeometryBuilder from "./Base/GeometryBuilder";
import BasicGeometry from "./Base/BasicGeometry";
import ContextComponents from "../../ContextComponents";
import JThreeContext from "../../JThreeContext";
class QuadGeometry extends BasicGeometry {
    constructor(name) {
        super();
        this._divX = 2;
        this._divY = 2;
        const rm = JThreeContext.getContextComponent(ContextComponents.ResourceManager);
        this.indexBuffer = rm.createBuffer(name + "index", WebGLRenderingContext.ELEMENT_ARRAY_BUFFER, WebGLRenderingContext.STATIC_DRAW, 1, WebGLRenderingContext.UNSIGNED_BYTE);
        this.positionBuffer = rm.createBuffer(name + "-pos", WebGLRenderingContext.ARRAY_BUFFER, WebGLRenderingContext.STATIC_DRAW, 3, WebGLRenderingContext.FLOAT);
        this.normalBuffer = rm.createBuffer(name + "-nor", WebGLRenderingContext.ARRAY_BUFFER, WebGLRenderingContext.STATIC_DRAW, 3, WebGLRenderingContext.FLOAT);
        this.uvBuffer = rm.createBuffer(name + "-uv", WebGLRenderingContext.ARRAY_BUFFER, WebGLRenderingContext.STATIC_DRAW, 2, WebGLRenderingContext.FLOAT);
        this.__updateBuffers();
    }
    set DivX(num) {
        this._divX = num;
        this.__updateBuffers();
    }
    set DivY(num) {
        this._divX = num;
        this.__updateBuffers();
    }
    __updateBuffers() {
        const pos = [];
        const nor = [];
        const uv = [];
        const index = [];
        GeometryBuilder.addDividedQuad(pos, nor, uv, index, this._divX, this._divY);
        this.positionBuffer.update(new Float32Array(pos), pos.length);
        this.normalBuffer.update(new Float32Array(nor), nor.length);
        this.uvBuffer.update(new Float32Array(uv), uv.length);
        this.indexBuffer.update(new Uint8Array(index), index.length);
    }
}
export default QuadGeometry;
