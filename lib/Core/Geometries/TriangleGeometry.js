import BasicGeometry from "./Base/BasicGeometry";
import Vector3 from "../../Math/Vector3";
import ContextComponents from "../../ContextComponents";
import JThreeContext from "../../JThreeContext";
class TriangleGeometry extends BasicGeometry {
    constructor(name) {
        super();
        this._first = new Vector3(0, 1, 0);
        this._second = new Vector3(1, 0, 0);
        this._third = new Vector3(-1, 0, 0);
        const rm = JThreeContext.getContextComponent(ContextComponents.ResourceManager);
        this.indexBuffer = rm.createBuffer(name + "index", WebGLRenderingContext.ELEMENT_ARRAY_BUFFER, WebGLRenderingContext.STATIC_DRAW, 1, WebGLRenderingContext.UNSIGNED_BYTE);
        this.positionBuffer = rm.createBuffer(name + "-pos", WebGLRenderingContext.ARRAY_BUFFER, WebGLRenderingContext.STATIC_DRAW, 3, WebGLRenderingContext.FLOAT);
        this.normalBuffer = rm.createBuffer(name + "-nor", WebGLRenderingContext.ARRAY_BUFFER, WebGLRenderingContext.STATIC_DRAW, 3, WebGLRenderingContext.FLOAT);
        this.uvBuffer = rm.createBuffer(name + "-uv", WebGLRenderingContext.ARRAY_BUFFER, WebGLRenderingContext.STATIC_DRAW, 2, WebGLRenderingContext.FLOAT);
        this.__updateBuffers();
    }
    set First(vec) {
        this._first = vec;
        this.__updateBuffers();
    }
    set Second(vec) {
        this._second = vec;
        this.__updateBuffers();
    }
    set Third(vec) {
        this._third = vec;
        this.__updateBuffers();
    }
    __updatePositionBuffer() {
        this.positionBuffer.update(new Float32Array([this._first.X, this._first.Y, this._first.Z, this._second.X, this._second.Y, this._second.Z, this._third.X, this._third.Y, this._third.Z]), 9);
    }
    __updateNormalBuffer() {
        this.normalBuffer.update(new Float32Array([0, 0, -1, 0, 0, -1, 0, 0, -1]), 9);
    }
    __updateUvBuffer() {
        this.uvBuffer.update(new Float32Array([0.5, 0.5, 1, 0, 0, 0]), 6);
    }
    __updateIndexBuffer() {
        this.indexBuffer.update(new Uint8Array([0, 1, 2]), 3);
    }
    __updateBuffers() {
        this.__updatePositionBuffer();
        this.__updateNormalBuffer();
        this.__updateUvBuffer();
        this.__updateIndexBuffer();
    }
}
export default TriangleGeometry;
