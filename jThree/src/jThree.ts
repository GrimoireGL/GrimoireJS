///<reference path="../_references.ts"/>

module jThree {
    import jThreeObject = jThree.Base.jThreeObject;
    import VectorBase = jThree.Mathematics.Vector.VectorBase;
    import Enumerable = jThree.Collections.IEnumerable;
    import Action1 = jThree.Delegates.Action1;
    import Buffer=jThree.Buffers.Buffer;
    import BufferWrapper = jThree.Buffers.BufferWrapper;
    import Shader = jThree.Effects.Shader;
    import Program = jThree.Effects.Program;

    export interface IVectorFactory<T extends VectorBase> {
        fromEnumerable(en: Enumerable<number>): T;
        fromArray(arr: number[]): T;
    }

    export class Timer extends jThreeObject {
        constructor() {
            super();
        }

        protected currentFrame: number=0;
        protected time: number = 0;
        protected timeFromLast: number = 0;

        get CurrentFrame(): number {
            return this.currentFrame;
        }

        get Time(): number {
            return this.time;
        }

        get TimeFromLast(): number {
            return this.timeFromLast;
        }
    }

    class ContextTimer extends Timer {

        updateTimer(): void {
            this.currentFrame++;
            var date:number=Date.now();
            this.TimeFromLast = date - this.Time;
            this.time = date;
        }
    }
    /**
     * コンテキストを跨いでリソースを管理するクラスをまとめているクラス
     */
    export class ResourceManager extends jThreeObject
    {
        private context:JThreeContext;

        constructor(jThreeContext: JThreeContext) {
            super();
            this.context = jThreeContext;
        }

        private buffers: Map<string, Buffer> = new Map<string, Buffer>();

        createBuffer(id:string,target:BufferTargetType,usage:BufferUsageType,unitCount:number,elementType:ElementType):Buffer {
            if (this.buffers.has(id)) {
                throw new Error("Buffer id cant be dupelicated");
            }
            var buf: Buffer = Buffer.CreateBuffer(this.context.CanvasRenderers, target, usage,unitCount,elementType);
            this.buffers.set(id, buf);
            return buf;
        }

        private shaders: Map<string, Shader> = new Map<string, Shader>();

        createShader(id: string,source:string,shaderType:ShaderType): Shader {
            var shader: Shader = Shader.CreateShader(this.context, source, shaderType);
            this.shaders.set(id, shader);
            return shader;
        }

        private programs: Map<string, Program> = new Map<string, Program>();

        createProgram(id: string,shaders:Shader[]): Program {
            var program: Program = Program.CreateProgram(this.context, shaders);
            this.programs.set(id, program);
            return program;
        }
    }

    /**
     * jThree context managing all over the pages canvas
     */
    export class JThreeContext extends jThreeObject {
        private static instance: JThreeContext;
        private canvasRenderers: CanvasRenderer[] = [];
        private onRendererChangedFuncs:Action1<Events.RendererListChangedEventArgs>[]=[];
        private resourceManager: ResourceManager;
        private timer:ContextTimer;
        /**
         * Singleton
         */
        public static get Instance(): JThreeContext {
            JThreeContext.instance = JThreeContext.instance || new JThreeContext();
            return JThreeContext.instance;
        }

        constructor() {
            super();
            this.resourceManager = new ResourceManager(this);
            this.timer = new ContextTimer();
        }

        init() {
            
        }

        /**
         * Getter of canvas renderer.
         */
        get CanvasRenderers(): CanvasRenderer[] {
            return this.canvasRenderers;
        }

        get Timer(): Timer {
            return this.timer;
        }

        /**
         * The class managing resources over multiple canvas(Buffer,Shader,Program,Texture)
         */
        get ResourceManager(): ResourceManager {
            return this.resourceManager;
        }

        /**
         * Add renderers to be managed by jThree
         */
        addRenderer(renderer: CanvasRenderer):void {
            if (this.canvasRenderers.indexOf(renderer) === -1) {
                this.canvasRenderers.push(renderer);
                this.notifyRendererChanged(new Events.RendererListChangedEventArgs(Events.RendererStateChangedType.Add, renderer));
            }
        }

        /**
         * Remove renderer
         */
        removeRenderer(renderer: CanvasRenderer): void {
            if (this.canvasRenderers.indexOf(renderer) !== -1) {
                for (var i = 0; i < this.canvasRenderers.length; i++) {
                    if (this.canvasRenderers[i] === renderer)
                    {
                        this.canvasRenderers.splice(i, 1);
                        break;
                    }
                }
                this.notifyRendererChanged(new Events.RendererListChangedEventArgs(Events.RendererStateChangedType.Delete, renderer));
            }
        }

        /**
         * add function as renderer changed event handler.
         */
        onRendererChanged(func:Action1<Events.RendererListChangedEventArgs>): void {
            if (this.onRendererChangedFuncs.indexOf(func) === -1) {
                this.onRendererChangedFuncs.push(func);
            }
        }
        /**
         * notify all event handlers
         */
        protected notifyRendererChanged(arg:Events.RendererListChangedEventArgs): void {
            this.onRendererChangedFuncs.forEach((v, i, a) => v(arg));
        }
    }

    export class RendererBase extends jThreeObject {
        protected context: GLContextWrapperBase;

        get Context(): GLContextWrapperBase
        {
            return this.context;
        }

        protected id: string;

        get ID(): string
        {
            return this.id;
        }

        public enabled: boolean;


    }

    export class CanvasRenderer extends RendererBase {
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
            this.id = jThree.Base.jThreeID.getUniqueRandom(10);
            this.glContext = glContext;
            this.context = new WebGLWrapper(this.glContext);
        }

        render(): void {
            if (!this.enabled) return;
            this.draw();
            this.context.Finish();
        }

        draw(): void {
            
        }
    }

    export class Scene extends jThreeObject {
        
    }

    export class SceneObject extends jThreeObject
    {
        update() {
            
        }

        render() {
            
        }
    }

    //export class Buffers extends jThreeObject {
    //    get BufferIndex(): number {
    //        throw new jThree.Exceptions.jThreeException("Not implemented", "Not implemented");
    //    }

    //    constructor(bufType:BufferType) {
    //        super();
    //    }
    //}

}

var buf: jThree.Buffers.Buffer;
var renderer: jThree.CanvasRenderer;
var renderer2: jThree.CanvasRenderer;
var attribNumber: number;
var attribNumber2: number;
var time: number = 0;
var p1Wrapper: jThree.Effects.ProgramWrapper;
var p2Wrapper: jThree.Effects.ProgramWrapper; 
$(() => {
    var jThreeContext: jThree.JThreeContext = jThree.JThreeContext.Instance;
    renderer = jThree.CanvasRenderer.fromCanvas(<HTMLCanvasElement>document.getElementById("test-canvas"));
    renderer2 = jThree.CanvasRenderer.fromCanvas(<HTMLCanvasElement>document.getElementById("test-canvas2"));
    jThreeContext.addRenderer(renderer);
    jThreeContext.addRenderer(renderer2);
    var vs = document.getElementById("vs");
    var vsShader: jThree.Effects.Shader = jThreeContext.ResourceManager.createShader("test-vs", vs.textContent,jThree.ShaderType.VertexShader);
    var fs = document.getElementById("fs");
    var fsShader: jThree.Effects.Shader = jThreeContext.ResourceManager.createShader("test-fs", fs.textContent, jThree.ShaderType.FragmentShader);
    vsShader.loadAll();
    fsShader.loadAll();
    console.log(vsShader.getTypeName());
    var prog: jThree.Effects.Program = jThreeContext.ResourceManager.createProgram("test-progran", [vsShader, fsShader]);
    console.log(vsShader);
   p1Wrapper= prog.getForRenderer(renderer);
    p1Wrapper.useProgram();
    attribNumber = renderer.Context.GetAttribLocation(p1Wrapper.TargetProgram, "position");
    p2Wrapper= prog.getForRenderer(renderer2);
    p2Wrapper.useProgram();
    buf = jThreeContext.ResourceManager.createBuffer("test-buffer", jThree.BufferTargetType.ArrayBuffer, jThree.BufferUsageType.DynamicDraw,3,jThree.ElementType.Float);
    attribNumber2 = renderer2.Context.GetAttribLocation(p2Wrapper.TargetProgram, "position");
    renderer.Context.ClearColor(0, 0, 1, 1);
    renderer2.Context.ClearColor(1, 0, 0, 1);
    Render();
});

function Render() {
    time++;
    buf.update(new Float32Array([
        0.0, Math.sin(time/100), 0.0,
        1.0, 0.0, 0.0,
        -1.0, 0.0, 0.0
    ]), 9);
    var wrappedBuffer: jThree.Buffers.BufferWrapper = buf.getForRenderer(renderer);
    renderer.Context.Clear(jThree.ClearTargetType.ColorBits);
    p1Wrapper.setAttributeVerticies("position", wrappedBuffer);
    renderer.Context.DrawArrays(jThree.DrawType.Triangles, 0, 3);
    renderer.Context.Flush();
    renderer.Context.Finish();
    wrappedBuffer = buf.getForRenderer(renderer2);
    renderer2.Context.Clear(jThree.ClearTargetType.ColorBits);
    wrappedBuffer.bindBuffer();
    p2Wrapper.setAttributeVerticies("position", wrappedBuffer);
    renderer2.Context.DrawArrays(jThree.DrawType.Triangles, 0, 3);
    renderer2.Context.Flush();
    renderer2.Context.Finish();
    window.setTimeout(Render, 1000 / 30);
}