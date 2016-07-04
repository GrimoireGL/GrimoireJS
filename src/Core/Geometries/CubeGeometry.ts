import GeometryBuilder from "./Base/GeometryBuilder";
import BasicGeometry from "./Base/BasicGeometry";
import Vector3 from "../../Math/Vector3";
import ResourceManager from "../ResourceManager";
class CubeGeometry extends BasicGeometry {
    constructor(name: string) {
        super();
        this.indexBuffer = ResourceManager.createBuffer(name + "index", WebGLRenderingContext.ELEMENT_ARRAY_BUFFER, WebGLRenderingContext.STATIC_DRAW, 1, WebGLRenderingContext.UNSIGNED_BYTE);
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
        GeometryBuilder.addQuad(pos, normal, uv, index, [new Vector3(-1, 1, 1), new Vector3(-1, -1, 1), new Vector3(1, 1, 1)]);
        GeometryBuilder.addQuad(pos, normal, uv, index, [new Vector3(1, 1, 1), new Vector3(1, -1, 1), new Vector3(1, 1, -1)]);
        GeometryBuilder.addQuad(pos, normal, uv, index, [new Vector3(1, 1, -1), new Vector3(1, -1, -1), new Vector3(-1, 1, -1)]);
        GeometryBuilder.addQuad(pos, normal, uv, index, [new Vector3(-1, 1, -1), new Vector3(-1, -1, -1), new Vector3(-1, 1, 1)]);
        GeometryBuilder.addQuad(pos, normal, uv, index, [new Vector3(-1, 1, 1), new Vector3(1, 1, 1), new Vector3(-1, 1, -1)]);
        GeometryBuilder.addQuad(pos, normal, uv, index, [new Vector3(1, -1, 1), new Vector3(-1, -1, 1), new Vector3(1, -1, -1)]);
        this.indexBuffer.update(new Uint8Array(index), index.length);
        this.normalBuffer.update(new Float32Array(normal), normal.length);
        this.uvBuffer.update(new Float32Array(uv), uv.length);
        this.positionBuffer.update(new Float32Array(pos), pos.length);
    }

}

export default CubeGeometry;
