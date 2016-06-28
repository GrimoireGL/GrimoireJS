import BasicGeometry from "./Base/BasicGeometry";
import JThreeContext from "../../JThreeContext";
import ContextComponents from "../../ContextComponents";
import ResourceManager from "../ResourceManager";
class GridGeometry extends BasicGeometry {

  private _holizontalDivide: number = 10;
  private _verticalDivide: number = 10;

  constructor(name: string) {
    super();
    const rm = JThreeContext.getContextComponent<ResourceManager>(ContextComponents.ResourceManager);
    this.primitiveTopology = WebGLRenderingContext.LINES;
    this.indexBuffer = rm.createBuffer(name + "index", WebGLRenderingContext.ELEMENT_ARRAY_BUFFER, WebGLRenderingContext.STATIC_DRAW, 1, WebGLRenderingContext.UNSIGNED_SHORT);
    this.positionBuffer = rm.createBuffer(name + "-pos", WebGLRenderingContext.ARRAY_BUFFER, WebGLRenderingContext.STATIC_DRAW, 3, WebGLRenderingContext.FLOAT);
    this.normalBuffer = rm.createBuffer(name + "-nor", WebGLRenderingContext.ARRAY_BUFFER, WebGLRenderingContext.STATIC_DRAW, 3, WebGLRenderingContext.FLOAT);
    this.uvBuffer = rm.createBuffer(name + "-uv", WebGLRenderingContext.ARRAY_BUFFER, WebGLRenderingContext.STATIC_DRAW, 2, WebGLRenderingContext.FLOAT);
    this.__updateBuffers();
  }

  public get HolizontalDivide(): number {
    return this._holizontalDivide;
  }

  public get VerticalDivide(): number {
    return this._verticalDivide;
  }

  public set HolizontalDivide(num: number) {
    this._holizontalDivide = num;
    this.__updateBuffers();
  }

  public set VerticalDivide(num: number) {
    this._verticalDivide = num;
    this.__updateBuffers();
  }


  private get VerticiesCount(): number {
    return (this.HolizontalDivide + 1) * 2 + (this.VerticalDivide + 1) * 2;
  }
  protected __updatePositionBuffer(): void {
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

  protected __updateNormalBuffer(): void {
    this.normalBuffer.update(new Float32Array(new Array(this.VerticiesCount * 3)), this.VerticiesCount * 3);
  }

  protected __updateUvBuffer(): void {
    this.uvBuffer.update(new Float32Array(new Array(this.VerticiesCount * 2)), this.VerticiesCount * 2);
  }

  protected __updateIndexBuffer(): void {
    const arr: number[] = [];
    for (let v = 0; v < this.VerticiesCount; v++) {
      arr.push(v);
    }
    this.indexBuffer.update(new Uint16Array(arr), this.VerticiesCount);
  }

  protected __updateBuffers(): void {
    this.__updatePositionBuffer();
    this.__updateNormalBuffer();
    this.__updateUvBuffer();
    this.__updateIndexBuffer();
  }
}

export default GridGeometry;
