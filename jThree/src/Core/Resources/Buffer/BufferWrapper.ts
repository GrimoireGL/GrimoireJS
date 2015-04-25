import BufferProxy = require("./BufferProxy");
import GLContextWrapperBase = require("../../../Wrapper/GLContextWrapperBase");
import Buffer = require("./Buffer");
import ElementType = require("../../../Wrapper/ElementType");

/**
 * Most based wrapper of buffer.
 */
class BufferWrapper extends BufferProxy
{
    private glContext: GLContextWrapperBase;

    private targetBuffer: WebGLBuffer = null;

    private length:number=0;

    constructor(parentBuffer: Buffer, glContext: GLContextWrapperBase)
    {
        super(parentBuffer, []);
        this.glContext = glContext;
        this.targetArray = [this];
    }

    private isInitialized: boolean = false;

    /**
     * Get the flag wheather this buffer is initialized or not.
     */
    get IsInitialized()
    {
        return this.isInitialized;
    }

    get Length(): number {
        return this.length;
    }

    get UnitCount(): number {
        return this.parentBuffer.UnitCount;
    }

    get ElementType():ElementType
    {
      return this.parentBuffer.ElementType;
    }

    get Normalized():boolean
    {
      return this.parentBuffer.Normalized;
    }

    get Stride():number
    {
      return this.parentBuffer.Stride;
    }

    get Offset():number
    {
      return this.parentBuffer.Offset;
    }

    get isAllInitialized(): boolean { return this.IsInitialized; }

    update(array: Float32Array, length: number): void
    {
        if (!this.isInitialized)
        {
            this.loadAll();
        }
        this.bindBuffer();
        this.glContext.BufferData(this.parentBuffer.Target, array.buffer, this.parentBuffer.Usage);
        this.unbindBuffer();
        this.length = length;
    }

    loadAll(): void
    {
        if (this.targetBuffer == null)
        {
            this.targetBuffer = this.glContext.CreateBuffer();
            this.isInitialized = true;
        }
    }

    bindBuffer(): void
    {
        if (this.isInitialized)
        {
            this.glContext.BindBuffer(this.parentBuffer.Target, this.targetBuffer);
        } else {
            this.loadAll();
            this.glContext.BindBuffer(this.parentBuffer.Target, this.targetBuffer);
            //TODO 初期化されていなかった場合の対処
        }
    }

    unbindBuffer(): void
    {
        if (this.isInitialized)
        {
            this.glContext.UnbindBuffer(this.parentBuffer.Target);
        }
    }

    get ManagedProxies() { return [this]; }
}
export=BufferWrapper;
