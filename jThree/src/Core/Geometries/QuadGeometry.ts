import GeometryBuilder from "./Base/GeometryBuilder";
import BasicGeometry from "./Base/BasicGeometry";
import Vector3 from "../../Math/Vector3";
import ContextComponents from "../../ContextComponents";
import ResourceManager from "../ResourceManager";
import JThreeContext from "../../JThreeContext";
class QuadGeometry extends BasicGeometry {
  constructor(name: string) {
    super();
    const rm = JThreeContext.getContextComponent<ResourceManager>(ContextComponents.ResourceManager);
    this.indexBuffer = rm.createBuffer(name + "index", WebGLRenderingContext.ELEMENT_ARRAY_BUFFER, WebGLRenderingContext.STATIC_DRAW, 1, WebGLRenderingContext.UNSIGNED_BYTE);
    this.positionBuffer = rm.createBuffer(name + "-pos", WebGLRenderingContext.ARRAY_BUFFER, WebGLRenderingContext.STATIC_DRAW, 3, WebGLRenderingContext.FLOAT);
    this.normalBuffer = rm.createBuffer(name + "-nor", WebGLRenderingContext.ARRAY_BUFFER, WebGLRenderingContext.STATIC_DRAW, 3, WebGLRenderingContext.FLOAT);
    this.uvBuffer = rm.createBuffer(name + "-uv", WebGLRenderingContext.ARRAY_BUFFER, WebGLRenderingContext.STATIC_DRAW, 2, WebGLRenderingContext.FLOAT);
    this.updateBuffers();
  }

  private divX: number = 2;
  private divY: number = 2;

  public set DivX(num: number) {
    this.divX = num;
    this.updateBuffers();
  }
  public set DivY(num: number) {
    this.divX = num;
    this.updateBuffers();
  }

  protected updateBuffers(): void {
    const pos: number[] = [];
    const nor: number[] = [];
    const uv: number[] = [];
    const index: number[] = [];
    GeometryBuilder.addDividedQuad(pos, nor, uv, index, this.divX, this.divY);
    this.positionBuffer.update(new Float32Array(pos), pos.length);
    this.normalBuffer.update(new Float32Array(nor), nor.length);
    this.uvBuffer.update(new Float32Array(uv), uv.length);
    this.indexBuffer.update(new Uint8Array(index), index.length);
  }
}

export default QuadGeometry;
