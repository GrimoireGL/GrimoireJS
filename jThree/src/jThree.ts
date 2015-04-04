///<reference path="../_references.ts"/>

module jThree {
    import jThreeObject = jThree.Base.jThreeObject;
    import VectorBase = jThree.Mathematics.Vector.VectorBase;
    import Enumerable = jThree.Collections.IEnumerable;
    import Action1 = jThree.Delegates.Action1;

    export interface IVectorFactory<T extends VectorBase> {
        fromEnumerable(en: Enumerable<number>): T;
        fromArray(arr: number[]): T;
    }


    export class JThreeContext extends jThreeObject {
        private static instance: JThreeContext;

        public static get Instance(): JThreeContext {
            JThreeContext.instance = JThreeContext.instance || new JThreeContext();
            return JThreeContext.instance;
        }

        constructor() {
            super();
        }

        private canvasRenderers: CanvasRenderer[]=[];

        /**
         * Getter of canvas renderer.
         */
        get CanvasRenderers(): CanvasRenderer[] {
            return this.canvasRenderers;
        }
    }

    export class CanvasRenderer extends jThreeObject {
        public static fromCanvas(canvas: HTMLCanvasElement): CanvasRenderer {
            var gl: WebGLRenderingContext;
            try {
                gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
                return new CanvasRenderer(gl);
            } catch (e) {
                if (!gl) {
                    //Processing for this error
                }
            }
        }

        private glContext: WebGLRenderingContext;

        constructor(glContext?: WebGLRenderingContext) {
            super();
            this.glContext = glContext;
        }
    }

    export class Material extends jThreeObject {

    }

    export class Mesh extends jThreeObject {

    }

    //export class Buffer extends jThreeObject {
    //    get BufferIndex(): number {
    //        throw new jThree.Exceptions.jThreeException("Not implemented", "Not implemented");
    //    }

    //    constructor(bufType:BufferType) {
    //        super();
    //    }
    //}

    export class GLContextWrapperBase extends jThreeObject {
        CheckErrorAsFatal(): void {
            throw new Exceptions.AbstractClassMethodCalledException();
        }

        CreateBuffer(): WebGLBuffer {
            throw new Exceptions.AbstractClassMethodCalledException();
        }

        BindBuffer(target:BufferTargetType, buffer: WebGLBuffer): void {
            throw new Exceptions.AbstractClassMethodCalledException();
        }

        BufferData(target: BufferTargetType, array: ArrayBuffer, usage: number): void {
            throw new Exceptions.AbstractClassMethodCalledException();
        }

        UnbindBuffer(target: BufferTargetType): void {
            throw new Exceptions.AbstractClassMethodCalledException();
        }

    }

    export class WebGLWrapper extends GLContextWrapperBase {
        private gl: WebGLRenderingContext;


        constructor(gl: WebGLRenderingContext) {
            super();
            this.gl = gl;
        }

        CheckErrorAsFatal(): void {
            var ec = this.gl.getError();
            if (ec!==WebGLRenderingContext.NO_ERROR) {
                alert("WebGL error was occured:{0}".format(ec));
            }
        }

        CreateBuffer(): WebGLBuffer {
            this.CheckErrorAsFatal();
            return this.gl.createBuffer();
        }

        BindBuffer(target:BufferTargetType,buffer:WebGLBuffer): void {
            this.CheckErrorAsFatal();
            this.gl.bindBuffer(target, buffer);
        }

        UnbindBuffer(target: BufferTargetType): void {
            this.CheckErrorAsFatal();
            this.gl.bindBuffer(target, null);
        }

        BufferData(target:BufferTargetType,array:ArrayBuffer,usage:number): void {
            this.CheckErrorAsFatal();
            this.gl.bufferData(target,array,usage);
        }
    }

    export class BufferProxy extends Collections.ArrayEnumratorFactory<BufferProxy> {
        constructor(parentBuffer:Buffer,targetProxies: BufferProxy[]) {
            super(targetProxies);
            //Remove dupelicated proxy
            targetProxies = this.targetArray = Collections.Collection.DistinctArray(targetProxies, (t) => this.proxyHash);
            this.managedProxies = targetProxies;
            //TODO generate ideal hash
            targetProxies.forEach((v, n, a) => {
                this.proxyHash += v.proxyHash;
            });
            this.parentBuffer = parentBuffer;
        }

        protected parentBuffer:Buffer;

        private managedProxies: BufferProxy[];

        private proxyHash: number=0;

        get ManagedProxies():BufferProxy[] {
            return Collections.Collection.CopyArray(this.managedProxies);
        }

        update(array: Float32Array, length: number): void {
            this.each((a) => a.update(array,length));
        }

        loadAll(): void {
            this.each((a)=>a.loadAll());
        }

        get isAllInitialized(): boolean {
            var isIniatilized = true;
            this.each((a) => {
                if (!a.isAllInitialized)isIniatilized = false;
            });
            return isIniatilized;
        }

        private each(act: Action1<BufferProxy>) {
            Collections.Collection.foreach(this,(a, i) => { act(a); });
        }


        addProxy(proxy:BufferProxy): BufferProxy {
            var proxies: BufferProxy[] = this.ManagedProxies;
            var hasTarget: boolean = false;
            proxies.forEach((v, n, a) => {
                if (v.proxyHash == proxy.proxyHash)hasTarget = true;
            });
            if (!hasTarget) proxies.push(proxy);
            return new BufferProxy(this.parentBuffer,proxies);
        }

        deleteProxy(proxy: BufferProxy): BufferProxy {
            var proxies: BufferProxy[] = this.ManagedProxies;
            var resultProxies: BufferProxy[] = [];
            proxies.forEach((v, i, a) => {
                if (proxy.proxyHash != v.proxyHash) {
                    resultProxies.push(v);
                }
            });
            return new BufferProxy(this.parentBuffer,resultProxies);
        }

        

        getEnumrator(): jThree.Collections.IEnumrator<BufferProxy> {
            return super.getEnumrator();
        }
    }

    /**
     * Most based wrapper of buffer.
     */
    export class BufferWrapper extends BufferProxy{
        private glContext: GLContextWrapperBase;

        private targetBuffer:WebGLBuffer=null;

        constructor(parentBuffer:Buffer,glContext:GLContextWrapperBase) {
            super(parentBuffer,[]);
            this.glContext = glContext;
            this.targetArray = [this];
        }

        private isInitialized: boolean = false;

        /**
         * Get the flag wheather this buffer is initialized or not.
         */
        get IsInitialized() {
            return this.isInitialized;
        }

        get isAllInitialized(): boolean { return this.IsInitialized; }

        update(array: Float32Array, length: number): void {
            if (!this.isInitialized) {
                this.loadAll();
            }
            this.bindBuffer();
            this.glContext.BufferData(this.parentBuffer.Target, array.buffer, WebGLRenderingContext.STATIC_DRAW);
            this.unbindBuffer();
        }

        loadAll(): void
        {
            if (this.targetBuffer == null) {
                this.targetBuffer = this.glContext.CreateBuffer();
                this.isInitialized = true;
            }
        }

        bindBuffer(): void {
            if (this.isInitialized) {
                this.glContext.BindBuffer(this.parentBuffer.Target, this.targetBuffer);
            } else {
                //TODO 初期化されていなかった場合の対処
            }
        }

        unbindBuffer(): void {
            if (this.isInitialized) {
                this.glContext.UnbindBuffer(this.parentBuffer.Target);
            }
        }

        get ManagedProxies() { return [this]; }
    }

    export class Buffer extends BufferProxy {
        constructor(targetProxies: BufferProxy[]) {
            super(null, targetProxies);
            this.parentBuffer = this;
        }

        private target:BufferTargetType;

        get Target(): BufferTargetType{
            return this.target;
        }
    }

    export enum BufferTargetType {
        ArrayBuffer=WebGLRenderingContext.ARRAY_BUFFER,
        ElementArrayBuffer=WebGLRenderingContext.ELEMENT_ARRAY_BUFFER
    }

}

$(() => {
    var renderer: jThree.CanvasRenderer = jThree.CanvasRenderer.fromCanvas(<HTMLCanvasElement>document.getElementById("test-canvas"));
});