import BasicGeometry = require("./BasicGeometry");
import BufferTargetType = require("../../Wrapper/BufferTargetType");
import BufferUsageType = require("../../Wrapper/BufferUsageType");
import ElementType = require("../../Wrapper/ElementType");
import Vector3 = require("../../Math/Vector3");
import PrimitiveTopology = require("../../Wrapper/PrimitiveTopology");
import ContextComponents = require("../../ContextComponents");
import JThreeContext = require("../../JThreeContext");
import ResourceManager = require("../ResourceManager");
class TriangleGeometry extends BasicGeometry {
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

    private first: Vector3 = new Vector3(0, 1, 0);
    private second: Vector3 = new Vector3(1, 0, 0);
    private third: Vector3 = new Vector3(-1, 0, 0);

    public set First(vec: Vector3) {
        this.first = vec;
        this.updateBuffers();
    }


    public set Second(vec: Vector3) {
        this.second = vec;
        this.updateBuffers();
    }

    public set Third(vec: Vector3) {
        this.third = vec;
        this.updateBuffers();
    }

    protected updatePositionBuffer(): void {
        this.positionBuffer.update(new Float32Array([this.first.X, this.first.Y, this.first.Z, this.second.X, this.second.Y, this.second.Z, this.third.X, this.third.Y, this.third.Z]), 9);
    }

    protected updateNormalBuffer(): void {
        this.normalBuffer.update(new Float32Array([0, 0, -1, 0, 0, -1, 0, 0, -1]), 9);
    }

    protected updateUvBuffer(): void {
        this.uvBuffer.update(new Float32Array([0.5, 0.5, 1, 0, 0, 0]), 6);
    }

    protected updateIndexBuffer(): void {
        this.indexBuffer.update(new Uint8Array([0, 1, 2]), 3);
    }

    protected updateBuffers(): void {
        this.updatePositionBuffer();
        this.updateNormalBuffer();
        this.updateUvBuffer();
        this.updateIndexBuffer();
    }
}

export = TriangleGeometry;
