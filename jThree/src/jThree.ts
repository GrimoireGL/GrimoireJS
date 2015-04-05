///<reference path="../_references.ts"/>

module jThree {
    import jThreeObject = jThree.Base.jThreeObject;
    import VectorBase = jThree.Mathematics.Vector.VectorBase;
    import Enumerable = jThree.Collections.IEnumerable;
    import Action1 = jThree.Delegates.Action1;
    import Buffer=jThree.Buffers.Buffer;
    import BufferWrapper = jThree.Buffers.BufferWrapper;
    import Shader = jThree.Effects.Shader;

    export interface IVectorFactory<T extends VectorBase> {
        fromEnumerable(en: Enumerable<number>): T;
        fromArray(arr: number[]): T;
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

        createBuffer(id:string,target:BufferTargetType,usage:BufferUsageType): Buffer {
            if (this.buffers.has(id)) {
                throw new Error("Buffer id cant be dupelicated");
            }
            var buf: Buffer = Buffer.CreateBuffer(this.context.CanvasRenderers, target, usage);
            this.buffers.set(id, buf);
            return buf;
        }

        private shaders: Map<string, Shader> = new Map<string, Shader>();

        createShader(id: string,source:string,shaderType:ShaderType): Shader {
            var shader: Shader = Shader.CreateShader(this.context.CanvasRenderers, source, shaderType);
            this.shaders.set(id, shader);
            return shader;
        }
    }


    export class JThreeContext extends jThreeObject {
        private static instance: JThreeContext;

        public static get Instance(): JThreeContext {
            JThreeContext.instance = JThreeContext.instance || new JThreeContext();
            return JThreeContext.instance;
        }

        constructor() {
            super();
            this.resourceManager = new ResourceManager(this);
        }

        private canvasRenderers: CanvasRenderer[] = [];

        private resourceManager:ResourceManager;

        /**
         * Getter of canvas renderer.
         */
        get CanvasRenderers(): CanvasRenderer[] {
            return this.canvasRenderers;
        }

        /**
         * The class managing resources over multiple canvas(Buffer,Shader,Program,Texture)
         */
        get ResourceManager(): ResourceManager {
            return this.resourceManager;
        }

        addRenderer(renderer: CanvasRenderer):void {
            if (this.canvasRenderers.indexOf(renderer) == -1) {
                this.canvasRenderers.push(renderer);
            }
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
    }

    export class Material extends jThreeObject {

    }

    export class Mesh extends jThreeObject {

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
    var prog: WebGLProgram = renderer.Context.CreateProgram();
    console.log(vsShader);
    renderer.Context.AttachShader(prog, vsShader.getForRenderer(renderer).TargetShader);
    renderer.Context.AttachShader(prog, fsShader.getForRenderer(renderer).TargetShader);
    renderer.Context.LinkProgram(prog);
    renderer.Context.UseProgram(prog);
    attribNumber = renderer.Context.GetAttribLocation(prog, "position");
    prog = renderer2.Context.CreateProgram();
    renderer2.Context.AttachShader(prog, vsShader.getForRenderer(renderer2).TargetShader);
    renderer2.Context.AttachShader(prog, fsShader.getForRenderer(renderer2).TargetShader);
    renderer2.Context.LinkProgram(prog);
    renderer2.Context.UseProgram(prog);
    buf = jThreeContext.ResourceManager.createBuffer("test-buffer", jThree.BufferTargetType.ArrayBuffer, jThree.BufferUsageType.DynamicDraw);
    attribNumber2 = renderer2.Context.GetAttribLocation(prog, "position");
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
    wrappedBuffer.bindBuffer();
    renderer.Context.EnableVertexAttribArray(attribNumber);
    renderer.Context.VertexAttribPointer(attribNumber, 3, jThree.ElementType.Float, false, 0, 0);
    renderer.Context.DrawArrays(jThree.DrawType.Triangles, 0, 3);
    renderer.Context.Flush();
    renderer.Context.Finish();
    wrappedBuffer = buf.getForRenderer(renderer2);
    renderer2.Context.Clear(jThree.ClearTargetType.ColorBits);
    wrappedBuffer.bindBuffer();
    renderer2.Context.EnableVertexAttribArray(attribNumber2);
    renderer2.Context.VertexAttribPointer(attribNumber2, 3, jThree.ElementType.Float, false, 0, 0);
    renderer2.Context.DrawArrays(jThree.DrawType.Triangles, 0, 3);
    renderer2.Context.Flush();
    renderer2.Context.Finish();
    window.setTimeout(Render, 1000 / 30);
}