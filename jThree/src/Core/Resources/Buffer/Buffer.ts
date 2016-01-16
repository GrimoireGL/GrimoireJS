import BufferTargetType = require("../../../Wrapper/BufferTargetType");
import BufferUsageType = require("../../../Wrapper/BufferUsageType");
import Canvas = require("../../Canvas");
import ElementType = require("../../../Wrapper/ElementType");
import ContextSafeResourceContainer = require("../ContextSafeResourceContainer")
import BufferWrapper = require("./BufferWrapper");
/**
 * Provides buffer resource without considering context.
 */
class Buffer extends ContextSafeResourceContainer<BufferWrapper>
{

  constructor(target: BufferTargetType, usage: BufferUsageType, unitCount: number, elementType: ElementType) {
    super();
    this.target = target;
    this.usage = usage;
    this.unitCount = unitCount;
    this.elementType = elementType;
    this.initializeForFirst();

  }
  /**
   * Buffer target.
   * ArrayBuffer => VertexBuffer, ArrayElementBuffer => IndexBuffer
   */
  private target: BufferTargetType;
  /**
  * Buffer target.
  * ArrayBuffer => VertexBuffer, ArrayElementBuffer => IndexBuffer
  */
  public get Target(): BufferTargetType {
    return this.target;
  }
  /**
   * Buffer usage.
   * StaticDraw,DynamicDraw,StreamDraw
   */
  private usage: BufferUsageType;
  /**
  * Buffer usage.
  * StaticDraw,DynamicDraw,StreamDraw
  */
  public get Usage(): BufferUsageType {
    return this.usage;
  }

  private elementType: ElementType;

  public get ElementType(): ElementType {
    return this.elementType;
  }

  /**
   * This elements are normalized or not.
   * It must be false in WebGL1.0.
   */
  private normalized: boolean = false;

  /**
  * This elements are normalized or not.
  * It must be false in WebGL1.0.
  */
  public get Normalized(): boolean {
    return this.normalized;
  }

  /**
  * This elements are normalized or not.
  * It must be false in WebGL1.0.
  */
  public set Normalized(normalized: boolean) {
    this.normalized = normalized;
  }

  private stride: number = 0;

  private offset: number = 0;

  public get Stride(): number {
    return this.stride;
  }

  public set Stride(stride: number) {
    this.stride = stride;
  }

  public get Offset(): number {
    return this.offset;
  }

  public set Offset(offset: number) {
    this.offset = offset;
  }

  /**
   * Element count per 1 vertex.
   */
  private unitCount: number;
  /**
* Element count per 1 vertex.
* This accessor is readonly.
*/
  public get UnitCount(): number {
    return this.unitCount;
  }

  /**
   * Cached source for buffer.
   */
  private elementCache: Float32Array;

  public get ElementCache(): Float32Array {
    return this.elementCache;
  }
  /**
* Length of this buffer.
*/
  private length: number = 0;
  /**
   * Length of this buffer.
   */
  public get Length(): number {
    return this.length;
  }

  public update(array: Float32Array, length: number): void {
    this.elementCache = array;
    this.length = length;
    this.each((a) => a.update(array, length));
  }

  protected getInstanceForRenderer(renderer: Canvas): BufferWrapper {
    return new BufferWrapper(this, renderer);
  }
}


export = Buffer;
