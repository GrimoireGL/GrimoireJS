import ArrayEnumratorFactory = require("../../../Base/Collections/ArrayEnumratorFactory");
import Buffer = require("./Buffer");
import Collection = require("../../../Base/Collections/Collection");
import Delegate = require("../../../Base/Delegates");
import IEnumrator = require("../../../Base/Collections/IEnumrator");
class BufferProxy extends ArrayEnumratorFactory<BufferProxy> {
    constructor(parentBuffer: Buffer, targetProxies: BufferProxy[])
    {
        super(targetProxies);
        //Remove dupelicated proxy
        targetProxies = this.targetArray = Collection.DistinctArray(targetProxies,(t) => this.proxyHash);
        this.managedProxies = targetProxies;
        //TODO generate ideal hash
        targetProxies.forEach((v, n, a) =>
        {
            this.proxyHash += v.proxyHash;
        });
        this.parentBuffer = parentBuffer;
    }

    protected parentBuffer: Buffer;

    protected managedProxies: BufferProxy[];

    private proxyHash: number = 0;

    public get ManagedProxies(): BufferProxy[]
    {
        return Collection.CopyArray(this.managedProxies);
    }

    public update(array: Float32Array, length: number): void
    {
        this.each((a) => a.update(array, length));
    }

    public loadAll(): void
    {
        this.each((a) => a.loadAll());
    }

    public get isAllInitialized(): boolean
    {
        var isIniatilized = true;
        this.each((a) =>
        {
            if (!a.isAllInitialized) isIniatilized = false;
        });
        return isIniatilized;
    }

    protected each(act: Delegate.Action1<BufferProxy>)
    {
        Collection.foreach(this,(a, i) => { act(a); });
    }

    public addProxy(proxy: BufferProxy): BufferProxy
    {
        var proxies: BufferProxy[] = this.ManagedProxies;
        var hasTarget: boolean = false;
        proxies.forEach((v, n, a) =>
        {
            if (v.proxyHash == proxy.proxyHash) hasTarget = true;
        });
        if (!hasTarget) proxies.push(proxy);
        return new BufferProxy(this.parentBuffer, proxies);
    }

    public deleteProxy(proxy: BufferProxy): BufferProxy
    {
        var proxies: BufferProxy[] = this.ManagedProxies;
        var resultProxies: BufferProxy[] = [];
        proxies.forEach((v, i, a) =>
        {
            if (proxy.proxyHash != v.proxyHash)
            {
                resultProxies.push(v);
            }
        });
        return new BufferProxy(this.parentBuffer, resultProxies);
    }

    public getEnumrator(): IEnumrator<BufferProxy>
    {
        return super.getEnumrator();
    }
}


export=BufferProxy;
