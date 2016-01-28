import GeometryBuilder from "./Base/GeometryBuilder";
import BasicGeometry from "./Base/BasicGeometry";
import BufferTargetType from "../../Wrapper/BufferTargetType";
import BufferUsageType from "../../Wrapper/BufferUsageType";
import ElementType from "../../Wrapper/ElementType";
import Vector3 from "../../Math/Vector3";
import PrimitiveTopology from "../../Wrapper/PrimitiveTopology";
import ResourceManager from "../ResourceManager";
import JThreeContext from "../../JThreeContext";
import ContextComponents from "../../ContextComponents";
class CubeGeometry extends BasicGeometry {
    constructor(name: string) {
        super();
        const rm = JThreeContext.getContextComponent<ResourceManager>(ContextComponents.ResourceManager);
        this.primitiveTopology = PrimitiveTopology.Triangles;
        this.indexBuffer = rm.createBuffer(name + "index", BufferTargetType.ElementArrayBuffer, BufferUsageType.StaticDraw, 1, ElementType.UnsignedByte);
        this.positionBuffer = rm.createBuffer(name + "-pos", BufferTargetType.ArrayBuffer, BufferUsageType.StaticDraw, 3, ElementType.Float);
        this.normalBuffer = rm.createBuffer(name + "-nor", BufferTargetType.ArrayBuffer, BufferUsageType.StaticDraw, 3, ElementType.Float);
        this.uvBuffer = rm.createBuffer(name + "-uv", BufferTargetType.ArrayBuffer, BufferUsageType.StaticDraw, 2, ElementType.Float);
        this.updateBuffers();
    }


    protected updateBuffers(): void {
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
