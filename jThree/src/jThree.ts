///<reference path="../_references.ts"/>

module jThree {
    import jThreeObject = jThree.Base.jThreeObject;
    import VectorBase = jThree.Mathematics.Vector.VectorBase;
    import Enumerable = jThree.Collections.IEnumerable;
    import Action1 = jThree.Delegates.Action1;
    import Buffer=jThree.Buffers.Buffer;
    import BufferWrapper = jThree.Buffers.BufferWrapper;

    export interface IVectorFactory<T extends VectorBase> {
        fromEnumerable(en: Enumerable<number>): T;
        fromArray(arr: number[]): T;
    }

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
            var buf: Buffer = Buffer.CreateBuffer(this.context.CanvasRenderers,target,usage);
            return buf;
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

        get ResourceManager(): ResourceManager {
            return this.resourceManager;
        }

        addRenderer(renderer: CanvasRenderer):void {
            if (this.canvasRenderers.indexOf(renderer) == -1) {
                this.canvasRenderers.push(renderer);
            }
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

        private context: GLContextWrapperBase;

        private id:string;

        get Context(): GLContextWrapperBase {
            return this.context;
        }

        get ID(): string {
            return this.id;
        }

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
var attribNumber: number;
var time: number = 0;
$(() => {
    var jThreeContext: jThree.JThreeContext = jThree.JThreeContext.Instance;
    renderer = jThree.CanvasRenderer.fromCanvas(<HTMLCanvasElement>document.getElementById("test-canvas"));
    jThreeContext.addRenderer(renderer);
    var vs = document.getElementById("vs");
    var vsShader: WebGLShader = renderer.Context.CreateShader(jThree.ShaderType.VertexShader);
    renderer.Context.ShaderSource(vsShader, vs.textContent);
    renderer.Context.CompileShader(vsShader);
    var fs = document.getElementById("fs");
    var fsShader: WebGLShader = renderer.Context.CreateShader(jThree.ShaderType.FragmentShader);
    renderer.Context.ShaderSource(fsShader, fs.textContent);
    renderer.Context.CompileShader(fsShader);
    var prog: WebGLProgram = renderer.Context.CreateProgram();
    renderer.Context.AttachShader(prog, vsShader);
    renderer.Context.AttachShader(prog, fsShader);
    renderer.Context.LinkProgram(prog);
    renderer.Context.UseProgram(prog);
    buf = jThreeContext.ResourceManager.createBuffer("test-buffer", jThree.BufferTargetType.ArrayBuffer, jThree.BufferUsageType.DynamicDraw);
    attribNumber = renderer.Context.GetAttribLocation(prog, "position");
    renderer.Context.ClearColor(0, 0, 0, 1);
    Render();
});

function Render() {
    time++;
    buf.update(new Float32Array([
        0.0, Math.sin(time/100), 0.0,
        1.0, 0.0, 0.0,
        -1.0, 0.0, 0.0
    ]), 9);
    renderer.Context.Clear(jThree.ClearTargetType.ColorBits);
    var wrappedBuffer: jThree.Buffers.BufferWrapper = buf.BufferWrappers.get(renderer.ID);
    wrappedBuffer.bindBuffer();
    renderer.Context.EnableVertexAttribArray(attribNumber);
    renderer.Context.VertexAttribPointer(attribNumber, 3, jThree.ElementType.Float, false, 0, 0);
    renderer.Context.DrawArrays(jThree.DrawType.Triangles, 0, 3);
    renderer.Context.Flush();
    renderer.Context.Finish();
    window.setTimeout(Render, 1000 / 30);
}