import XFileData from "../XFileData";
import ResourceManager from "../../Core/ResourceManager";
import JThreeContext from "../../JThreeContext";
import ContextComponents from "../../ContextComponents";
import BasicGeometry from "../../Core/Geometries/Base/BasicGeometry";
class XGeometry extends BasicGeometry {
  constructor(x: XFileData) {
    super();
    const rm = JThreeContext.getContextComponent<ResourceManager>(ContextComponents.ResourceManager);
    this.indexBuffer = rm.createBuffer(name + "-index", WebGLRenderingContext.ELEMENT_ARRAY_BUFFER, WebGLRenderingContext.STATIC_DRAW, 1, WebGLRenderingContext.UNSIGNED_INT);
    this.positionBuffer = rm.createBuffer(name + "-pos", WebGLRenderingContext.ARRAY_BUFFER, WebGLRenderingContext.STATIC_DRAW, 3, WebGLRenderingContext.FLOAT);
    this.normalBuffer = rm.createBuffer(name + "-nor", WebGLRenderingContext.ARRAY_BUFFER, WebGLRenderingContext.STATIC_DRAW, 3, WebGLRenderingContext.FLOAT);
    this.uvBuffer = rm.createBuffer(name + "-uv", WebGLRenderingContext.ARRAY_BUFFER, WebGLRenderingContext.STATIC_DRAW, 2, WebGLRenderingContext.FLOAT);
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
