import JThreeObject=require('Base/JThreeObject');
import CanvasManager = require("../../CanvasManager");
import BufferTargetType = require("../../../Wrapper/BufferTargetType");
import BufferUsageType = require("../../../Wrapper/BufferUsageType");
import ContextManagerBase = require("../../ContextManagerBase");
import BufferProxy = require("./BufferProxy");
import ElementType = require("../../../Wrapper/ElementType");
import BufferWrapper = require("./BufferWrapper");

class Buffer extends BufferProxy
{
    static CreateBuffer(glContexts:CanvasManager[],target:BufferTargetType,usage:BufferUsageType,unitCount:number,elementType:ElementType) {
        var buf: Buffer = new Buffer();
        buf.target = target;
        buf.usage = usage;
        buf.unitCount = unitCount;
        buf.elementType = elementType;
        glContexts.forEach((v, i, a) => {
            var wrap: BufferWrapper = new BufferWrapper(buf, v.Context);
            buf.managedProxies.push(wrap);
            buf.bufWrappers.set(v.ID, wrap);
        });
        return buf;
    }

    constructor()
    {
        super(null,[]);
        this.parentBuffer = this;
    }

    private target: BufferTargetType;

    get Target(): BufferTargetType
    {
        return this.target;
    }

    private usage:BufferUsageType;

    get Usage():BufferUsageType {
        return this.usage;
    }

    private elementType: ElementType;

    get ElementType(): ElementType {
        return this.elementType;
    }

    private normalized: boolean=false;

    get Normalized():boolean {
        return this.normalized;
    }

    set Normalized(normalized: boolean) {
        this.normalized = normalized;
    }

    private stride: number=0;

    private offset: number=0;


    get Stride(): number {
        return this.stride;
    }

    set Stride(stride: number) {
        this.stride = stride;
    }

    get Offse(): number {
        return this.offset;
    }

    set Offset(offset: number) {
        this.offset = offset;
    }

    /**
     * 1頂点あたりの要素数
     */
    private unitCount: number;

    get UnitCount(): number {
        return this.unitCount;
    }

    private bufWrappers: Map<string, BufferWrapper> = new Map<string, BufferWrapper>();

    get BufferWrappers(): Map<string, BufferWrapper> {
        return this.bufWrappers;
    }

    getForRenderer(renderer: ContextManagerBase): BufferWrapper {
        return this.bufWrappers.get(renderer.ID);
    }
}


export=Buffer;
