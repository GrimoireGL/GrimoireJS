import XFileData from "../XFileData";
import ResourceManager from "../../Core/ResourceManager";
import BasicGeometry from "../../Core/Geometries/Base/BasicGeometry";
class XGeometry extends BasicGeometry {
  constructor(x: XFileData) {
    super();
    this.indexBuffer = ResourceManager.createBuffer(name + "-index", WebGLRenderingContext.ELEMENT_ARRAY_BUFFER, WebGLRenderingContext.STATIC_DRAW, 1, WebGLRenderingContext.UNSIGNED_INT);
    this.positionBuffer = ResourceManager.createBuffer(name + "-pos", WebGLRenderingContext.ARRAY_BUFFER, WebGLRenderingContext.STATIC_DRAW, 3, WebGLRenderingContext.FLOAT);
    this.normalBuffer = ResourceManager.createBuffer(name + "-nor", WebGLRenderingContext.ARRAY_BUFFER, WebGLRenderingContext.STATIC_DRAW, 3, WebGLRenderingContext.FLOAT);
    this.uvBuffer = ResourceManager.createBuffer(name + "-uv", WebGLRenderingContext.ARRAY_BUFFER, WebGLRenderingContext.STATIC_DRAW, 2, WebGLRenderingContext.FLOAT);
    this.__updateBuffers(x);
  }

  /**
   * apply pmx geometries to buffer.
   */
  protected __updateBuffers(x: XFileData): void {
    this.indexBuffer.update(x.indicies, x.indicies.length);
    this.normalBuffer.update(x.normals, x.normals.length);
    this.uvBuffer.update(x.texCoords, x.texCoords.length);
    this.positionBuffer.update(x.positions, x.texCoords.length);
  }
}

export default XGeometry;
