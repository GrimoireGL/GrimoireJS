import GeometryBuilder from "./Base/GeometryBuilder";
import BasicGeometry from "./Base/BasicGeometry";
import Vector3 from "../../Math/Vector3";
import ResourceManager from "../ResourceManager";
class SphereGeometry extends BasicGeometry {

    private _divX: number = 10;

    public get DivX() {
        return this._divX;
    }

    public set DivX(count: number) {
        this._divX = count;
        this.__updateBuffers();
    }

    private _divY: number = 10;

    public get DivY() {
        return this._divY;
    }

    public set DivY(count: number) {
        this._divY = count;
        this.__updateBuffers();
    }


    constructor(name: string) {
        super();
        this.indexBuffer = ResourceManager.createBuffer(name + "index", WebGLRenderingContext.ELEMENT_ARRAY_BUFFER, WebGLRenderingContext.STATIC_DRAW, 1, WebGLRenderingContext.UNSIGNED_SHORT);
        this.positionBuffer = ResourceManager.createBuffer(name + "-pos", WebGLRenderingContext.ARRAY_BUFFER, WebGLRenderingContext.STATIC_DRAW, 3, WebGLRenderingContext.FLOAT);
        this.normalBuffer = ResourceManager.createBuffer(name + "-nor", WebGLRenderingContext.ARRAY_BUFFER, WebGLRenderingContext.STATIC_DRAW, 3, WebGLRenderingContext.FLOAT);
        this.uvBuffer = ResourceManager.createBuffer(name + "-uv", WebGLRenderingContext.ARRAY_BUFFER, WebGLRenderingContext.STATIC_DRAW, 2, WebGLRenderingContext.FLOAT);
        this.__updateBuffers();
    }


    protected __updateBuffers(): void {
        const pos: number[] = [];
        const normal: number[] = [];
        const uv: number[] = [];
        const index: number[] = [];
        GeometryBuilder.addSphere(pos, normal, uv, index, this._divY, this._divX, new Vector3(0, 0, 0));
        this.normalBuffer.update(new Float32Array(normal), normal.length);
        this.uvBuffer.update(new Float32Array(uv), uv.length);
        this.positionBuffer.update(new Float32Array(pos), pos.length);
        this.__updateIndexBuffer(index, index.length);
    }
}

export default SphereGeometry;
