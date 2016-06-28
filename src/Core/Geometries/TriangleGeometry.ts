import BasicGeometry from "./Base/BasicGeometry";
import Vector3 from "../../Math/Vector3";
import ContextComponents from "../../ContextComponents";
import JThreeContext from "../../JThreeContext";
import ResourceManager from "../ResourceManager";
class TriangleGeometry extends BasicGeometry {
    private _first: Vector3 = new Vector3(0, 1, 0);
    private _second: Vector3 = new Vector3(1, 0, 0);
    private _third: Vector3 = new Vector3(-1, 0, 0);

    constructor(name: string) {
        super();
        const rm = JThreeContext.getContextComponent<ResourceManager>(ContextComponents.ResourceManager);
        this.indexBuffer = rm.createBuffer(name + "index", WebGLRenderingContext.ELEMENT_ARRAY_BUFFER, WebGLRenderingContext.STATIC_DRAW, 1, WebGLRenderingContext.UNSIGNED_BYTE);
        this.positionBuffer = rm.createBuffer(name + "-pos", WebGLRenderingContext.ARRAY_BUFFER, WebGLRenderingContext.STATIC_DRAW, 3, WebGLRenderingContext.FLOAT);
        this.normalBuffer = rm.createBuffer(name + "-nor", WebGLRenderingContext.ARRAY_BUFFER, WebGLRenderingContext.STATIC_DRAW, 3, WebGLRenderingContext.FLOAT);
        this.uvBuffer = rm.createBuffer(name + "-uv", WebGLRenderingContext.ARRAY_BUFFER, WebGLRenderingContext.STATIC_DRAW, 2, WebGLRenderingContext.FLOAT);
        this.__updateBuffers();
    }

    public set First(vec: Vector3) {
        this._first = vec;
        this.__updateBuffers();
    }


    public set Second(vec: Vector3) {
        this._second = vec;
        this.__updateBuffers();
    }

    public set Third(vec: Vector3) {
        this._third = vec;
        this.__updateBuffers();
    }

    protected __updatePositionBuffer(): void {
        this.positionBuffer.update(new Float32Array([this._first.X, this._first.Y, this._first.Z, this._second.X, this._second.Y, this._second.Z, this._third.X, this._third.Y, this._third.Z]), 9);
    }

    protected __updateNormalBuffer(): void {
        this.normalBuffer.update(new Float32Array([0, 0, -1, 0, 0, -1, 0, 0, -1]), 9);
    }

    protected __updateUvBuffer(): void {
        this.uvBuffer.update(new Float32Array([0.5, 0.5, 1, 0, 0, 0]), 6);
    }

    protected __updateIndexBuffer(): void {
        this.indexBuffer.update(new Uint8Array([0, 1, 2]), 3);
    }

    protected __updateBuffers(): void {
        this.__updatePositionBuffer();
        this.__updateNormalBuffer();
        this.__updateUvBuffer();
        this.__updateIndexBuffer();
    }
}

export default TriangleGeometry;
