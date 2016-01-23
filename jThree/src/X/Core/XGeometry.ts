import XFileData = require("../XFileData");
import ResourceManager = require("../../Core/ResourceManager");
import JThreeContext = require("../../JThreeContext");
import ContextComponents = require("../../ContextComponents");
import ElementType = require("../../Wrapper/ElementType");
import BufferUsageType = require("../../Wrapper/BufferUsageType");
import BufferTargetType = require("../../Wrapper/BufferTargetType");
import BasicGeometry = require("../../Core/Geometries/Base/BasicGeometry");
class XGeometry extends BasicGeometry {
  constructor(x: XFileData) {
    super();
    const rm = JThreeContext.getContextComponent<ResourceManager>(ContextComponents.ResourceManager);
    this.indexBuffer = rm.createBuffer(name + "-index", BufferTargetType.ElementArrayBuffer, BufferUsageType.StaticDraw, 1, ElementType.UnsignedInt);
    this.positionBuffer = rm.createBuffer(name + "-pos", BufferTargetType.ArrayBuffer, BufferUsageType.StaticDraw, 3, ElementType.Float);
    this.normalBuffer = rm.createBuffer(name + "-nor", BufferTargetType.ArrayBuffer, BufferUsageType.StaticDraw, 3, ElementType.Float);
    this.uvBuffer = rm.createBuffer(name + "-uv", BufferTargetType.ArrayBuffer, BufferUsageType.StaticDraw, 2, ElementType.Float);
    this.updateBuffers(x);
  }

  /**
   * apply pmx geometries to buffer.
   */
  protected updateBuffers(x: XFileData): void {
    this.indexBuffer.update(x.indicies, x.indicies.length);
    this.normalBuffer.update(x.normals, x.normals.length);
    this.uvBuffer.update(x.texCoords, x.texCoords.length);
    this.positionBuffer.update(x.positions, x.texCoords.length);
  }
}

export = XGeometry;
