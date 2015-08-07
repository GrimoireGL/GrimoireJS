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
    public static CreateBuffer(context:JThreeContext,target:BufferTargetType,usage:BufferUsageType,unitCount:number,elementType:ElementType) {
        var buf: Buffer = new Buffer();
        buf.target = target;
        buf.usage = usage;
        buf.unitCount = unitCount;
        buf.elementType = elementType;
        context.CanvasManagers.forEach((v, i, a) => {
            var wrap: BufferWrapper = new BufferWrapper(buf, v.GLContext);
            buf.managedProxies.push(wrap);
            buf.bufWrappers.set(v.ID, wrap);
        });
        JThreeContextProxy.getJThreeContext().onRendererChanged(buf.changedRenderer);
        return buf;
    }

    public changedRenderer(arg:CanvasListChangedEventArgs):void{
      if(arg.ChangeType==ListStateChangedType.Add)
      {
        var wrapper=new BufferWrapper(this,arg.AffectedRenderer.GLContext);
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

    public get Offse(): number {
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

    public getForRenderer(renderer: ContextManagerBase): BufferWrapper {
        if(!this.bufWrappers.has(renderer.ID))
        {
          var wrap=new BufferWrapper(this,renderer.GLContext);
          wrap.loadAll();
          if(this.elementCache)wrap.update(this.elementCache,this.length);
          this.addProxy(wrap);
          this.bufWrappers.set(renderer.ID, wrap);
        }
        return this.bufWrappers.get(renderer.ID);
    }
}


export=Buffer;
