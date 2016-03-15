import BasicGeometry from "../../Core/Geometries/Base/BasicGeometry";
import IVariableDescription from "../../Core/ProgramTransformer/Base/IVariableDescription";
import ProgramWrapper from "../../Core/Resources/Program/ProgramWrapper";
import PMX from "../PMXData";
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
    this.indexBuffer = rm.createBuffer(name + "-index", WebGLRenderingContext.ELEMENT_ARRAY_BUFFER, WebGLRenderingContext.STATIC_DRAW, 1, WebGLRenderingContext.UNSIGNED_INT);
    this.positionBuffer = rm.createBuffer(name + "-pos", WebGLRenderingContext.ARRAY_BUFFER, WebGLRenderingContext.STATIC_DRAW, 3, WebGLRenderingContext.FLOAT);
    this.normalBuffer = rm.createBuffer(name + "-nor", WebGLRenderingContext.ARRAY_BUFFER, WebGLRenderingContext.STATIC_DRAW, 3, WebGLRenderingContext.FLOAT);
    this.uvBuffer = rm.createBuffer(name + "-uv", WebGLRenderingContext.ARRAY_BUFFER, WebGLRenderingContext.STATIC_DRAW, 2, WebGLRenderingContext.FLOAT);
    this.edgeSizeBuffer = rm.createBuffer(name + "-edgeSize", WebGLRenderingContext.ARRAY_BUFFER, WebGLRenderingContext.STATIC_DRAW, 1, WebGLRenderingContext.FLOAT);
    this.boneIndexBuffer = rm.createBuffer(name + "-boneIndex", WebGLRenderingContext.ARRAY_BUFFER, WebGLRenderingContext.STATIC_DRAW, 4, WebGLRenderingContext.FLOAT);
    this.boneWeightBuffer = rm.createBuffer(name + "-boneWeight", WebGLRenderingContext.ARRAY_BUFFER, WebGLRenderingContext.STATIC_DRAW, 4, WebGLRenderingContext.FLOAT);
    this.__updateBuffers(pmx);
  }

  /**
   * apply pmx geometries to buffer.
   */
  protected __updateBuffers(pmx: PMX): void {
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

  public updatePositionBuffer(): void {
    this.positionBuffer.update(this.positionBuferSource, this.positionBuferSource.length);
  }

  public updateUVBuffer(): void {
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
