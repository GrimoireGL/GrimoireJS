import GeometryBuilder = require("./GeometryBuilder");
import BasicGeometry = require("./BasicGeometry");
import BufferTargetType = require("../../Wrapper/BufferTargetType");
import BufferUsageType = require("../../Wrapper/BufferUsageType");
import ElementType = require("../../Wrapper/ElementType");
import Vector3 = require("../../Math/Vector3");
import ContextComponents = require("../../ContextComponents");
import ResourceManager = require("../ResourceManager");
import JThreeContext = require("../../JThreeContext");
class QuadGeometry extends BasicGeometry {
    constructor(name: string) {
        super();
        const rm = JThreeContext.getContextComponent<ResourceManager>(ContextComponents.ResourceManager);
        this.indexBuffer = rm.createBuffer(name + "index", BufferTargetType.ElementArrayBuffer, BufferUsageType.StaticDraw, 1, ElementType.UnsignedByte);
        this.positionBuffer = rm.createBuffer(name + "-pos", BufferTargetType.ArrayBuffer, BufferUsageType.StaticDraw, 3, ElementType.Float);
        this.normalBuffer = rm.createBuffer(name + "-nor", BufferTargetType.ArrayBuffer, BufferUsageType.StaticDraw, 3, ElementType.Float);
        this.uvBuffer = rm.createBuffer(name + "-uv", BufferTargetType.ArrayBuffer, BufferUsageType.StaticDraw, 2, ElementType.Float);
        this.updateBuffers();
    }

    protected updateBuffers(): void {
        const pos: number[] = [];
        const nor: number[] = [];
        const uv: number[] = [];
        const index: number[] = [];
        GeometryBuilder.addQuad(pos, nor, uv, index, [new Vector3(-1, 1, 0), new Vector3(-1, -1, 0), new Vector3(1, 1, 0)]);
        this.positionBuffer.update(new Float32Array(pos), pos.length);
        this.normalBuffer.update(new Float32Array(nor), nor.length);
        this.uvBuffer.update(new Float32Array(uv), uv.length);
        this.indexBuffer.update(new Uint8Array(index), index.length);
    }
}

export = QuadGeometry;
