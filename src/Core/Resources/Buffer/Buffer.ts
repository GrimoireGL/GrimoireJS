import Canvas from "../../Canvas/Canvas";
import ContextSafeResourceContainer from "../ContextSafeResourceContainer";
import BufferWrapper from "./BufferWrapper";
/**
 * Provides buffer resource without considering context.
 */
class Buffer extends ContextSafeResourceContainer<BufferWrapper> {

  constructor(target: number, usage: number, unitCount: number, elementType: number) {
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
  private target: number;
  /**
  * Buffer target.
  * ArrayBuffer => VertexBuffer, ArrayElementBuffer => IndexBuffer
  */
  public get Target(): number {
    return this.target;
  }
  /**
   * Buffer usage.
   * StaticDraw,DynamicDraw,StreamDraw
   */
  private usage: number;
  /**
  * Buffer usage.
  * StaticDraw,DynamicDraw,StreamDraw
  */
  public get Usage(): number {
    return this.usage;
  }

  private elementType: number;

  public get ElementType(): number {
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
  private elementCache: ArrayBuffer|ArrayBufferView;

  public get ElementCache(): ArrayBuffer|ArrayBufferView {
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

  public update(array: ArrayBuffer|ArrayBufferView, length: number): void {
    this.elementCache = array;
    this.length = length;
    this.each((a) => a.update(array, length));
  }

  protected createWrapperForCanvas(canvas: Canvas): BufferWrapper {
    return new BufferWrapper(this, canvas);
  }
}


export default Buffer;
