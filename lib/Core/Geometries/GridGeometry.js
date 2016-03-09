import BasicGeometry from "./Base/BasicGeometry";
import JThreeContext from "../../JThreeContext";
import ContextComponents from "../../ContextComponents";
class GridGeometry extends BasicGeometry {
    constructor(name) {
        super();
        this._holizontalDivide = 10;
        this._verticalDivide = 10;
        const rm = JThreeContext.getContextComponent(ContextComponents.ResourceManager);
        this.primitiveTopology = WebGLRenderingContext.LINES;
        this.indexBuffer = rm.createBuffer(name + "index", WebGLRenderingContext.ELEMENT_ARRAY_BUFFER, WebGLRenderingContext.STATIC_DRAW, 1, WebGLRenderingContext.UNSIGNED_SHORT);
        this.positionBuffer = rm.createBuffer(name + "-pos", WebGLRenderingContext.ARRAY_BUFFER, WebGLRenderingContext.STATIC_DRAW, 3, WebGLRenderingContext.FLOAT);
        this.normalBuffer = rm.createBuffer(name + "-nor", WebGLRenderingContext.ARRAY_BUFFER, WebGLRenderingContext.STATIC_DRAW, 3, WebGLRenderingContext.FLOAT);
        this.uvBuffer = rm.createBuffer(name + "-uv", WebGLRenderingContext.ARRAY_BUFFER, WebGLRenderingContext.STATIC_DRAW, 2, WebGLRenderingContext.FLOAT);
        this.__updateBuffers();
    }
    get HolizontalDivide() {
        return this._holizontalDivide;
    }
    get VerticalDivide() {
        return this._verticalDivide;
    }
    set HolizontalDivide(num) {
        this._holizontalDivide = num;
        this.__updateBuffers();
    }
    set VerticalDivide(num) {
        this._verticalDivide = num;
        this.__updateBuffers();
    }
    get VerticiesCount() {
        return (this.HolizontalDivide + 1) * 2 + (this.VerticalDivide + 1) * 2;
    }
    __updatePositionBuffer() {
        const arr = [];
        for (let i = 0; i < this.HolizontalDivide + 1; i++) {
            const num = -1 + 1 / this.HolizontalDivide * i * 2;
            arr.push(num, 0, -1, num, 0, 1);
        }
        for (let i = 0; i < this.VerticalDivide + 1; i++) {
            const num = -1 + 1 / this.VerticalDivide * i * 2;
            arr.push(-1, 0, num, 1, 0, num);
        }
        this.positionBuffer.update(new Float32Array(arr), arr.length);
    }
    __updateNormalBuffer() {
        this.normalBuffer.update(new Float32Array(new Array(this.VerticiesCount * 3)), this.VerticiesCount * 3);
    }
    __updateUvBuffer() {
        this.uvBuffer.update(new Float32Array(new Array(this.VerticiesCount * 2)), this.VerticiesCount * 2);
    }
    __updateIndexBuffer() {
        const arr = [];
        for (let v = 0; v < this.VerticiesCount; v++) {
            arr.push(v);
        }
        this.indexBuffer.update(new Uint16Array(arr), this.VerticiesCount);
    }
    __updateBuffers() {
        this.__updatePositionBuffer();
        this.__updateNormalBuffer();
        this.__updateUvBuffer();
        this.__updateIndexBuffer();
    }
}
export default GridGeometry;
