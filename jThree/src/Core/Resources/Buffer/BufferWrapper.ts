import GLContextWrapperBase = require("../../../Wrapper/GLContextWrapperBase");
import Buffer = require("./Buffer");
import ElementType = require("../../../Wrapper/ElementType");
import ResourceWrapper = require("../ResourceWrapper");
import ContextManagerBase = require("../../ContextManagerBase");
/**
 * Most based wrapper of buffer.
 */
class BufferWrapper extends ResourceWrapper
{
    private glContext: GLContextWrapperBase;

    private targetBuffer: WebGLBuffer = null;

    private length: number = 0;

    private parentBuffer:Buffer;

    constructor(parentBuffer: Buffer,contextManager:ContextManagerBase)
    {
        super(contextManager);
        this.glContext = contextManager.GLContext;
        this.parentBuffer = parentBuffer;
    }

    private isInitialized: boolean = false;

    /**
     * Get the flag wheather this buffer is initialized or not.
     */
    public get IsInitialized()
    {
        return this.isInitialized;
    }

    public get Length(): number {
        return this.length;
    }

    public get UnitCount(): number {
        return this.parentBuffer.UnitCount;
    }

    public get ElementType():ElementType
    {
      return this.parentBuffer.ElementType;
    }

    public get Normalized():boolean
    {
      return this.parentBuffer.Normalized;
    }

    public get Stride():number
    {
      return this.parentBuffer.Stride;
    }

    public get Offset():number
    {
      return this.parentBuffer.Offset;
    }

    public get isAllInitialized(): boolean { return this.IsInitialized; }

    public update(array: Float32Array, length: number): void
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

    public loadAll(): void
    {
        if (this.targetBuffer == null)
        {
            this.targetBuffer = this.glContext.CreateBuffer();
            this.isInitialized = true;
        }
    }

    public bindBuffer(): void
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

    public unbindBuffer(): void
    {
        if (this.isInitialized)
        {
            this.glContext.UnbindBuffer(this.parentBuffer.Target);
        }
    }
}
export=BufferWrapper;
