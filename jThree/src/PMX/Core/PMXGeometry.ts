import BasicGeometry from "../../Core/Geometries/Base/BasicGeometry";
import IVariableDescription from "../../Core/Materials/Base/IVariableDescription";
import ProgramWrapper from "../../Core/Resources/Program/ProgramWrapper";
import PrimitiveTopology from "../../Wrapper/PrimitiveTopology";
import BufferTargetType from "../../Wrapper/BufferTargetType";
import BufferUsageType from "../../Wrapper/BufferUsageType";
import ElementType from "../../Wrapper/ElementType";
import PMX from "../PMXLoader";
import Buffer from "../../Core/Resources/Buffer/Buffer";
import ContextComponents from "../../ContextComponents";
import JThreeContext from "../../JThreeContext";
import ResourceManager from "../../Core/ResourceManager";

class PMXGeometry extends BasicGeometry {

  public edgeSizeBuffer: Buffer;

  public boneIndexBuffer: Buffer;

  public boneWeightBuffer: Buffer;

  public positionBuferSource: Float32Array;

  public uvBufferSource: Float32Array;

  constructor(pmx: PMX) {
    super();
    const name = `${pmx.Header.modelName}(${pmx.Header.modelNameEn})`;
    const rm = JThreeContext.getContextComponent<ResourceManager>(ContextComponents.ResourceManager);
    this.primitiveTopology = PrimitiveTopology.Triangles;
    this.indexBuffer = rm.createBuffer(name + "-index", BufferTargetType.ElementArrayBuffer, BufferUsageType.StaticDraw, 1, ElementType.UnsignedInt);
    this.positionBuffer = rm.createBuffer(name + "-pos", BufferTargetType.ArrayBuffer, BufferUsageType.StaticDraw, 3, ElementType.Float);
    this.normalBuffer = rm.createBuffer(name + "-nor", BufferTargetType.ArrayBuffer, BufferUsageType.StaticDraw, 3, ElementType.Float);
    this.uvBuffer = rm.createBuffer(name + "-uv", BufferTargetType.ArrayBuffer, BufferUsageType.StaticDraw, 2, ElementType.Float);
    this.edgeSizeBuffer = rm.createBuffer(name + "-edgeSize", BufferTargetType.ArrayBuffer, BufferUsageType.StaticDraw, 1, ElementType.Float);
    this.boneIndexBuffer = rm.createBuffer(name + "-boneIndex", BufferTargetType.ArrayBuffer, BufferUsageType.StaticDraw, 4, ElementType.Float);
    this.boneWeightBuffer = rm.createBuffer(name + "-boneWeight", BufferTargetType.ArrayBuffer, BufferUsageType.StaticDraw, 4, ElementType.Float);
    this.updateBuffers(pmx);
  }

  /**
   * apply pmx geometries to buffer.
   */
  protected updateBuffers(pmx: PMX): void {
    const surfaceBuffer = new Uint32Array(pmx.Surfaces);
    const verticies = pmx.Verticies;
    this.positionBuferSource = new Float32Array(verticies.positions);
    this.uvBufferSource = new Float32Array(verticies.uvs);
    this.indexBuffer.update(surfaceBuffer, surfaceBuffer.length);
    this.normalBuffer.update(verticies.normals, verticies.normals.length);
    this.uvBuffer.update(this.uvBufferSource, this.uvBufferSource.length);
    this.positionBuffer.update(this.positionBuferSource, this.positionBuferSource.length);
    this.edgeSizeBuffer.update(verticies.edgeScaling, verticies.edgeScaling.length);
    this.boneIndexBuffer.update(verticies.boneIndicies, verticies.boneIndicies.length);
    this.boneWeightBuffer.update(verticies.boneWeights, verticies.boneWeights.length);
  }

  public updatePositionBuffer() {
    this.positionBuffer.update(this.positionBuferSource, this.positionBuferSource.length);
  }

  public updateUVBuffer() {
    this.uvBuffer.update(this.uvBufferSource, this.uvBufferSource.length);
  }


  public applyAttributeVariables(pWrapper: ProgramWrapper, attributes: { [key: string]: IVariableDescription }): void {
    super.applyAttributeVariables(pWrapper, attributes);
    this.__assignAttributeIfExists(pWrapper, attributes, "edgeScaling", this.edgeSizeBuffer);
    this.__assignAttributeIfExists(pWrapper, attributes, "boneIndicies", this.boneIndexBuffer);
    this.__assignAttributeIfExists(pWrapper, attributes, "boneWeights", this.boneWeightBuffer);
  }
}

export default PMXGeometry;
