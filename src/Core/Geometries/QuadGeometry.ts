import GeometryBuilder from "./Base/GeometryBuilder";
import BasicGeometry from "./Base/BasicGeometry";
import ContextComponents from "../../ContextComponents";
import ResourceManager from "../ResourceManager";
import JThreeContext from "../../JThreeContext";
class QuadGeometry extends BasicGeometry {
  constructor(name: string) {
    super();
    const rm = JThreeContext.getContextComponent<ResourceManager>(ContextComponents.ResourceManager);
    this.indexBuffer = rm.createBuffer(name + "index", WebGLRenderingContext.ELEMENT_ARRAY_BUFFER, WebGLRenderingContext.STATIC_DRAW, 1, WebGLRenderingContext.UNSIGNED_SHORT);
    this.positionBuffer = rm.createBuffer(name + "-pos", WebGLRenderingContext.ARRAY_BUFFER, WebGLRenderingContext.STATIC_DRAW, 3, WebGLRenderingContext.FLOAT);
    this.normalBuffer = rm.createBuffer(name + "-nor", WebGLRenderingContext.ARRAY_BUFFER, WebGLRenderingContext.STATIC_DRAW, 3, WebGLRenderingContext.FLOAT);
    this.uvBuffer = rm.createBuffer(name + "-uv", WebGLRenderingContext.ARRAY_BUFFER, WebGLRenderingContext.STATIC_DRAW, 2, WebGLRenderingContext.FLOAT);
    this.__updateBuffers();
  }

  private _divX: number = 2;
  private _divY: number = 2;

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
