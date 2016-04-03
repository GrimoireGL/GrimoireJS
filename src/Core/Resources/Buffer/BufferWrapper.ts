import Buffer from "./Buffer";
import ResourceWrapper from "../ResourceWrapper";
import Canvas from "../../Canvas/Canvas";
/**
 * Buffer wrapper based on context.
 */
class BufferWrapper extends ResourceWrapper {
  private _targetBuffer: WebGLBuffer = null;

  private _length: number = 0;

  private _parentBuffer: Buffer;

  constructor(parentBuffer: Buffer, canvas: Canvas) {
    super(canvas);
    this._parentBuffer = parentBuffer;

  }

  public dispose(): void {
    if (this._targetBuffer) {
      this.GL.deleteBuffer(this._targetBuffer);
      this.__setInitialized(false);
      this._targetBuffer = null;
    }
  }

  public get Length(): number {
    return this._length;
  }

  public get UnitCount(): number {
    return this._parentBuffer.UnitCount;
  }

  public get ElementType(): number {
    return this._parentBuffer.ElementType;
  }

  public get Normalized(): boolean {
    return this._parentBuffer.Normalized;
  }

  public get Stride(): number {
    return this._parentBuffer.Stride;
  }

  public get Offset(): number {
    return this._parentBuffer.Offset;
  }

  public update(array: ArrayBuffer|ArrayBufferView, length: number): void {
    if (!this.Initialized) {
      this.init();
    }
    this.bindBuffer();
    this.GL.bufferData(this._parentBuffer.Target, array, this._parentBuffer.Usage);
    this.unbindBuffer();
    this._length = length;
  }

  public init(): void {
    if (this._targetBuffer == null) {
      this._targetBuffer = this.GL.createBuffer();
      this.__setInitialized();
    }
  }

  public bindBuffer(): void {
    if (this.Initialized) {
      this.GL.bindBuffer(this._parentBuffer.Target, this._targetBuffer);
    } else {
      this.init();
      this.update(this._parentBuffer.ElementCache, this._parentBuffer.Length);
      this.GL.bindBuffer(this._parentBuffer.Target, this._targetBuffer);
    }
  }

  public unbindBuffer(): void {
    if (this.Initialized) {
      this.GL.bindBuffer(this._parentBuffer.Target, null);
    }
  }
}
export default BufferWrapper;
