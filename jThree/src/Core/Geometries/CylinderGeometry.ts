import GeometryBuilder from "./Base/GeometryBuilder";
import BasicGeometry from "./Base/BasicGeometry";
import BufferTargetType from "../../Wrapper/BufferTargetType";
import BufferUsageType from "../../Wrapper/BufferUsageType";
import ElementType from "../../Wrapper/ElementType";
import Vector3 from "../../Math/Vector3";
import PrimitiveTopology from "../../Wrapper/PrimitiveTopology";
import JThreeContext from "../../JThreeContext";
import ContextComponents from "../../ContextComponents";
import ResourceManager from "../ResourceManager";
class CylinderGeometry extends BasicGeometry {

    private divideCount: number = 10;

    public get DivideCount() {
        return this.divideCount;
    }

    public set DivideCount(count: number) {
        this.divideCount = count;
        this.updateBuffers();
    }

    constructor(name: string) {
        super();
        const rm = JThreeContext.getContextComponent<ResourceManager>(ContextComponents.ResourceManager);
        this.primitiveTopology = PrimitiveTopology.Triangles;
        this.indexBuffer = rm.createBuffer(name + "index", BufferTargetType.ElementArrayBuffer, BufferUsageType.StaticDraw, 1, ElementType.UnsignedShort);
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
        GeometryBuilder.addCylinder(pos, normal, uv, index, this.DivideCount, new Vector3(0, 1, 0), new Vector3(0, -1, 0), new Vector3(0, 0, -1), 1);
        this.indexBuffer.update(new Uint16Array(index), index.length);
        this.normalBuffer.update(new Float32Array(normal), normal.length);
        this.uvBuffer.update(new Float32Array(uv), uv.length);
        this.positionBuffer.update(new Float32Array(pos), pos.length);
    }
}

export default CylinderGeometry;
