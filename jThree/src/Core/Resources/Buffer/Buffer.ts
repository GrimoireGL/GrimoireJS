import JThreeObject=require('Base/JThreeObject');
import CanvasManager = require("../../CanvasManager");
import BufferTargetType = require("../../../Wrapper/BufferTargetType");
import BufferUsageType = require("../../../Wrapper/BufferUsageType");
import ContextManagerBase = require("../../ContextManagerBase");
import BufferProxy = require("./BufferProxy");
import ElementType = require("../../../Wrapper/ElementType");
import BufferWrapper = require("./BufferWrapper");
import JThreeContextProxy = require("../../JThreeContextProxy");
import CanvasListChangedEventArgs = require('../../CanvasListChangedEventArgs');
import ListStateChangedType = require("../../ListStateChangedType");
import AssociativeArray = require('../../../Base/Collections/AssociativeArray');
import JThreeContext = require('../../JThreeContext');
class Buffer extends BufferProxy
{
    static CreateBuffer(context:JThreeContext,target:BufferTargetType,usage:BufferUsageType,unitCount:number,elementType:ElementType) {
        var buf: Buffer = new Buffer();
        buf.target = target;
        buf.usage = usage;
        buf.unitCount = unitCount;
        buf.elementType = elementType;
        context.CanvasManagers.forEach((v, i, a) => {
            var wrap: BufferWrapper = new BufferWrapper(buf, v.Context);
            buf.managedProxies.push(wrap);
            buf.bufWrappers.set(v.ID, wrap);
        });
        JThreeContextProxy.getJThreeContext().onRendererChanged(buf.changedRenderer);
        return buf;
    }

    changedRenderer(arg:CanvasListChangedEventArgs):void{
      if(arg.ChangeType==ListStateChangedType.Add)
      {
        var wrapper=new BufferWrapper(this,arg.AffectedRenderer.Context);
        wrapper.loadAll();
      //  this.bufWrappers.set(arg.AffectedRenderer.ID,wrapper);
      }
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

    private bufWrappers: AssociativeArray<BufferWrapper> = new AssociativeArray<BufferWrapper>();

    get BufferWrappers(): AssociativeArray<BufferWrapper> {
        return this.bufWrappers;
    }
    private elementCache:Float32Array;
    private length:number=0;

    get Length():number{
      return this.length;
    }

    update(array: Float32Array, length: number): void
    {
      this.elementCache=array;
      this.length=length;
        this.each((a) => a.update(array, length));
    }

    getForRenderer(renderer: ContextManagerBase): BufferWrapper {
        if(!this.bufWrappers.has(renderer.ID))
        {
          var wrap=new BufferWrapper(this,renderer.Context);
          wrap.loadAll();
          if(this.elementCache)wrap.update(this.elementCache,this.length);
          this.addProxy(wrap);
          this.bufWrappers.set(renderer.ID, wrap);
        }
        return this.bufWrappers.get(renderer.ID);
    }
}


export=Buffer;
