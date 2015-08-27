import BufferTargetType = require("../../../Wrapper/BufferTargetType");
import BufferUsageType = require("../../../Wrapper/BufferUsageType");
import ContextManagerBase = require("../../ContextManagerBase");
import ElementType = require("../../../Wrapper/ElementType");
import JThreeContext = require('../../JThreeContext');
import ContextSafeResourceContainer = require("../ContextSafeResourceContainer")
import BufferWrapper = require("./BufferWrapper");
import AssociativeArray = require("../../../Base/Collections/AssociativeArray")
class Buffer extends ContextSafeResourceContainer<BufferWrapper>
{

    constructor(context:JThreeContext,target:BufferTargetType,usage:BufferUsageType,unitCount:number,elementType:ElementType)
    {
        super(context);
        this.target = target;
        this.usage = usage;
        this.unitCount = unitCount;
        this.elementType = elementType;
        this.initializeForFirst();

    }

    private target: BufferTargetType;

    public get Target(): BufferTargetType
    {
        return this.target;
    }

    private usage:BufferUsageType;

    public get Usage():BufferUsageType {
        return this.usage;
    }

    private elementType: ElementType;

    public get ElementType(): ElementType {
        return this.elementType;
    }

    private normalized: boolean=false;

    public get Normalized():boolean {
        return this.normalized;
    }

    public set Normalized(normalized: boolean) {
        this.normalized = normalized;
    }

    private stride: number=0;

    private offset: number=0;

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
     * 1頂点あたりの要素数
     */
    private unitCount: number;

    public get UnitCount(): number {
        return this.unitCount;
    }

    private bufWrappers: AssociativeArray<BufferWrapper> = new AssociativeArray<BufferWrapper>();

    public get BufferWrappers(): AssociativeArray<BufferWrapper> {
        return this.bufWrappers;
    }
    private elementCache:Float32Array;
    private length:number=0;

    public get Length():number{
      return this.length;
    }

    public update(array: Float32Array, length: number): void
    {
      this.elementCache=array;
      this.length=length;
        this.each((a) => a.update(array, length));
    }

    protected getInstanceForRenderer(renderer: ContextManagerBase): BufferWrapper {
        return new BufferWrapper(this, renderer);
    }
}


export=Buffer;
