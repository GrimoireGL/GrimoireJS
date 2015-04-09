module jThree.Buffers {
    import Action1 = jThree.Delegates.Action1;

    export class BufferProxy extends Collections.ArrayEnumratorFactory<BufferProxy> {
        constructor(parentBuffer: Buffer, targetProxies: BufferProxy[])
        {
            super(targetProxies);
            //Remove dupelicated proxy
            targetProxies = this.targetArray = Collections.Collection.DistinctArray(targetProxies,(t) => this.proxyHash);
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

        get ManagedProxies(): BufferProxy[]
        {
            return Collections.Collection.CopyArray(this.managedProxies);
        }

        update(array: Float32Array, length: number): void
        {
            this.each((a) => a.update(array, length));
        }

        loadAll(): void
        {
            this.each((a) => a.loadAll());
        }

        get isAllInitialized(): boolean
        {
            var isIniatilized = true;
            this.each((a) =>
            {
                if (!a.isAllInitialized) isIniatilized = false;
            });
            return isIniatilized;
        }

        private each(act: Action1<BufferProxy>)
        {
            Collections.Collection.foreach(this,(a, i) => { act(a); });
        }


        addProxy(proxy: BufferProxy): BufferProxy
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

        deleteProxy(proxy: BufferProxy): BufferProxy
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



        getEnumrator(): jThree.Collections.IEnumrator<BufferProxy>
        {
            return super.getEnumrator();
        }
    }

    /**
     * Most based wrapper of buffer.
     */
    export class BufferWrapper extends BufferProxy
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
            } else
            {
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

    export class Buffer extends BufferProxy
    {
        static CreateBuffer(glContexts:CanvasRenderer[],target:BufferTargetType,usage:BufferUsageType,unitCount:number,elementType:ElementType) {
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

        getForRenderer(renderer: RendererBase): BufferWrapper {
            return this.bufWrappers.get(renderer.ID);
        }
    }
} 