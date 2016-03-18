import Canvas from "../../Canvas/Canvas";
import ContextSafeResourceContainer from "../ContextSafeResourceContainer";
import BufferWrapper from "./BufferWrapper";
/**
 * Provides buffer resource without considering context.
 */
class Buffer extends ContextSafeResourceContainer<BufferWrapper> {

  constructor(target: number, usage: number, unitCount: number, elementType: number) {
    super();
    this._target = target;
    this._usage = usage;
    this._unitCount = unitCount;
    this._elementType = elementType;
    this.__initializeForFirst();

  }
  /**
   * Buffer target.
   * ArrayBuffer => VertexBuffer, ArrayElementBuffer => IndexBuffer
   */
  private _target: number;
  /**
  * Buffer target.
  * ArrayBuffer => VertexBuffer, ArrayElementBuffer => IndexBuffer
  */
  public get Target(): number {
    return this._target;
  }
  /**
   * Buffer usage.
   * StaticDraw,DynamicDraw,StreamDraw
   */
  private _usage: number;
  /**
  * Buffer usage.
  * StaticDraw,DynamicDraw,StreamDraw
  */
  public get Usage(): number {
    return this._usage;
  }

  private _elementType: number;

  public get ElementType(): number {
    return this._elementType;
  }

  public set ElementType(type: number) {
    this._elementType = type;
  }

  /**
   * This elements are normalized or not.
   * It must be false in WebGL1.0.
   */
  private _normalized: boolean = false;

  /**
  * This elements are normalized or not.
  * It must be false in WebGL1.0.
  */
  public get Normalized(): boolean {
    return this._normalized;
  }

  /**
  * This elements are normalized or not.
  * It must be false in WebGL1.0.
  */
  public set Normalized(normalized: boolean) {
    this._normalized = normalized;
  }

  private _stride: number = 0;

  private _offset: number = 0;

  public get Stride(): number {
    return this._stride;
  }

  public set Stride(stride: number) {
    this._stride = stride;
  }

  public get Offset(): number {
    return this._offset;
  }

  public set Offset(offset: number) {
    this._offset = offset;
  }

  /**
   * Element count per 1 vertex.
   */
  private _unitCount: number;
  /**
* Element count per 1 vertex.
* This accessor is readonly.
*/
  public get UnitCount(): number {
    return this._unitCount;
  }

  /**
   * Cached source for buffer.
   */
  private _elementCache: ArrayBuffer|ArrayBufferView;

  public get ElementCache(): ArrayBuffer|ArrayBufferView {
    return this._elementCache;
  }
  /**
* Length of this buffer.
*/
  private _length: number = 0;
  /**
   * Length of this buffer.
   */
  public get Length(): number {
    return this._length;
  }

  public update(array: ArrayBuffer|ArrayBufferView, length: number): void {
    this._elementCache = array;
    this._length = length;
    this.each((a) => a.update(array, length));
  }

  protected __createWrapperForCanvas(canvas: Canvas): BufferWrapper {
    return new BufferWrapper(this, canvas);
  }
}


export default Buffer;
