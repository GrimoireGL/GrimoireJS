import Buffer = require("./Buffer");
import ElementType = require("../../../Wrapper/ElementType");
import ResourceWrapper = require("../ResourceWrapper");
import Canvas = require("../../Canvas");
/**
 * Buffer wrapper based on context.
 */
class BufferWrapper extends ResourceWrapper
{
    private targetBuffer: WebGLBuffer = null;

    private length: number = 0;

    private parentBuffer:Buffer;

    constructor(parentBuffer: Buffer,canvas:Canvas)
    {
        super(canvas);
        this.parentBuffer = parentBuffer;

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

    public update(array: Float32Array, length: number): void
    {
        if (!this.Initialized)
        {
            this.init();
        }
        this.bindBuffer();
        this.GL.bufferData(this.parentBuffer.Target, array.buffer, this.parentBuffer.Usage);
        this.unbindBuffer();
        this.length = length;
    }

    public init(): void
    {
        if (this.targetBuffer == null)
        {
            this.targetBuffer = this.GL.createBuffer();
            this.setInitialized();
        }
    }

    public bindBuffer(): void
    {
        if (this.Initialized)
        {
            this.GL.bindBuffer(this.parentBuffer.Target, this.targetBuffer);
        } else {
            this.init();
            this.GL.bindBuffer(this.parentBuffer.Target, this.targetBuffer);
            this.update(this.parentBuffer.ElementCache,this.parentBuffer.Length);
        }
    }

    public unbindBuffer(): void
    {
        if (this.Initialized)
        {
            this.GL.bindBuffer(this.parentBuffer.Target,null);
        }
    }
}
export=BufferWrapper;
