import GeometryBuilder from "./Base/GeometryBuilder";
import BasicGeometry from "./Base/BasicGeometry";
import ResourceManager from "../ResourceManager";
class QuadGeometry extends BasicGeometry {

  private _divX: number = 2;
  private _divY: number = 2;

  constructor(name: string) {
    super();
    this.indexBuffer = ResourceManager.createBuffer(name + "index", WebGLRenderingContext.ELEMENT_ARRAY_BUFFER, WebGLRenderingContext.STATIC_DRAW, 1, WebGLRenderingContext.UNSIGNED_SHORT);
    this.positionBuffer = ResourceManager.createBuffer(name + "-pos", WebGLRenderingContext.ARRAY_BUFFER, WebGLRenderingContext.STATIC_DRAW, 3, WebGLRenderingContext.FLOAT);
    this.normalBuffer = ResourceManager.createBuffer(name + "-nor", WebGLRenderingContext.ARRAY_BUFFER, WebGLRenderingContext.STATIC_DRAW, 3, WebGLRenderingContext.FLOAT);
    this.uvBuffer = ResourceManager.createBuffer(name + "-uv", WebGLRenderingContext.ARRAY_BUFFER, WebGLRenderingContext.STATIC_DRAW, 2, WebGLRenderingContext.FLOAT);
    this.__updateBuffers();
  }

  public set DivX(num: number) {
    this._divX = num;
    this.__updateBuffers();
  }
  public set DivY(num: number) {
    this._divY = num;
    this.__updateBuffers();
  }

  protected __updateBuffers(): void {
    const pos: number[] = [];
    const nor: number[] = [];
    const uv: number[] = [];
    const index: number[] = [];
    GeometryBuilder.addDividedQuad(pos, nor, uv, index, this._divX, this._divY);
    this.positionBuffer.update(new Float32Array(pos), pos.length);
    this.normalBuffer.update(new Float32Array(nor), nor.length);
    this.uvBuffer.update(new Float32Array(uv), uv.length);
    this.__updateIndexBuffer(index, index.length);
  }
}

export default QuadGeometry;
