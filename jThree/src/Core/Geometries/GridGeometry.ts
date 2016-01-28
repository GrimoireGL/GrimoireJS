import BasicGeometry from "./Base/BasicGeometry";
import BufferTargetType from "../../Wrapper/BufferTargetType";
import BufferUsageType from "../../Wrapper/BufferUsageType";
import ElementType from "../../Wrapper/ElementType";
import PrimitiveTopology from "../../Wrapper/PrimitiveTopology";
import JThreeContext from "../../JThreeContext";
import ContextComponents from "../../ContextComponents";
import ResourceManager from "../ResourceManager";
class GridGeometry extends BasicGeometry {
    constructor(name: string) {
        super();
        const rm = JThreeContext.getContextComponent<ResourceManager>(ContextComponents.ResourceManager);
        this.primitiveTopology = PrimitiveTopology.Lines;
        this.indexBuffer = rm.createBuffer(name + "index", BufferTargetType.ElementArrayBuffer, BufferUsageType.StaticDraw, 1, ElementType.UnsignedShort);
        this.positionBuffer = rm.createBuffer(name + "-pos", BufferTargetType.ArrayBuffer, BufferUsageType.StaticDraw, 3, ElementType.Float);
        this.normalBuffer = rm.createBuffer(name + "-nor", BufferTargetType.ArrayBuffer, BufferUsageType.StaticDraw, 3, ElementType.Float);
        this.uvBuffer = rm.createBuffer(name + "-uv", BufferTargetType.ArrayBuffer, BufferUsageType.StaticDraw, 2, ElementType.Float);
        this.updateBuffers();
    }

    private holizontalDivide = 10;
    private verticalDivide = 10;

    public get HolizontalDivide(): number {
        return this.holizontalDivide;
    }

    public get VerticalDivide(): number {
        return this.verticalDivide;
    }

    public set HolizontalDivide(num: number) {
        this.holizontalDivide = num;
        this.updateBuffers();
    }

    public set VerticalDivide(num: number) {
        this.verticalDivide = num;
        this.updateBuffers();
    }


    private get VerticiesCount(): number {
        return (this.HolizontalDivide + 1) * 2 + (this.VerticalDivide + 1) * 2;
    }
    protected updatePositionBuffer(): void {
        const arr: number[] = [];
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

    protected updateNormalBuffer(): void {
        this.normalBuffer.update(new Float32Array(new Array(this.VerticiesCount * 3)), this.VerticiesCount * 3);
    }

    protected updateUvBuffer(): void {
        this.uvBuffer.update(new Float32Array(new Array(this.VerticiesCount * 2)), this.VerticiesCount * 2);
    }

    protected updateIndexBuffer(): void {
        const arr: number[] = [];
        for (let v = 0; v < this.VerticiesCount; v++) {
            arr.push(v);
        }
        this.indexBuffer.update(new Uint16Array(arr), this.VerticiesCount);
    }

    protected updateBuffers(): void {
        this.updatePositionBuffer();
        this.updateNormalBuffer();
        this.updateUvBuffer();
        this.updateIndexBuffer();
    }
}

export default GridGeometry;
