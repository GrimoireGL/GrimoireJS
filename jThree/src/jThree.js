///<reference path="../_references.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var jThree;
(function (jThree) {
    var jThreeObject = jThree.Base.jThreeObject;
    var Buffer = jThree.Buffers.Buffer;
    var Shader = jThree.Effects.Shader;
    /**
     * コンテキストを跨いでリソースを管理するクラスをまとめているクラス
     */
    var ResourceManager = (function (_super) {
        __extends(ResourceManager, _super);
        function ResourceManager(jThreeContext) {
            _super.call(this);
            this.buffers = new Map();
            this.shaders = new Map();
            this.context = jThreeContext;
        }
        ResourceManager.prototype.createBuffer = function (id, target, usage) {
            if (this.buffers.has(id)) {
                throw new Error("Buffer id cant be dupelicated");
            }
            var buf = Buffer.CreateBuffer(this.context.CanvasRenderers, target, usage);
            this.buffers.set(id, buf);
            return buf;
        };
        ResourceManager.prototype.createShader = function (id, source, shaderType) {
            var shader = Shader.CreateShader(this.context.CanvasRenderers, source, shaderType);
            this.shaders.set(id, shader);
            return shader;
        };
        return ResourceManager;
    })(jThreeObject);
    jThree.ResourceManager = ResourceManager;
    var JThreeContext = (function (_super) {
        __extends(JThreeContext, _super);
        function JThreeContext() {
            _super.call(this);
            this.canvasRenderers = [];
            this.resourceManager = new ResourceManager(this);
        }
        Object.defineProperty(JThreeContext, "Instance", {
            get: function () {
                JThreeContext.instance = JThreeContext.instance || new JThreeContext();
                return JThreeContext.instance;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(JThreeContext.prototype, "CanvasRenderers", {
            /**
             * Getter of canvas renderer.
             */
            get: function () {
                return this.canvasRenderers;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(JThreeContext.prototype, "ResourceManager", {
            /**
             * The class managing resources over multiple canvas(Buffer,Shader,Program,Texture)
             */
            get: function () {
                return this.resourceManager;
            },
            enumerable: true,
            configurable: true
        });
        JThreeContext.prototype.addRenderer = function (renderer) {
            if (this.canvasRenderers.indexOf(renderer) == -1) {
                this.canvasRenderers.push(renderer);
            }
        };
        return JThreeContext;
    })(jThreeObject);
    jThree.JThreeContext = JThreeContext;
    var RendererBase = (function (_super) {
        __extends(RendererBase, _super);
        function RendererBase() {
            _super.apply(this, arguments);
        }
        Object.defineProperty(RendererBase.prototype, "Context", {
            get: function () {
                return this.context;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RendererBase.prototype, "ID", {
            get: function () {
                return this.id;
            },
            enumerable: true,
            configurable: true
        });
        return RendererBase;
    })(jThreeObject);
    jThree.RendererBase = RendererBase;
    var CanvasRenderer = (function (_super) {
        __extends(CanvasRenderer, _super);
        function CanvasRenderer(glContext) {
            _super.call(this);
            this.id = jThree.Base.jThreeID.getUniqueRandom(10);
            this.glContext = glContext;
            this.context = new jThree.WebGLWrapper(this.glContext);
        }
        CanvasRenderer.fromCanvas = function (canvas) {
            var gl;
            try {
                gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
                return new CanvasRenderer(gl);
            }
            catch (e) {
                if (!gl) {
                }
            }
        };
        return CanvasRenderer;
    })(RendererBase);
    jThree.CanvasRenderer = CanvasRenderer;
    var Material = (function (_super) {
        __extends(Material, _super);
        function Material() {
            _super.apply(this, arguments);
        }
        return Material;
    })(jThreeObject);
    jThree.Material = Material;
    var Mesh = (function (_super) {
        __extends(Mesh, _super);
        function Mesh() {
            _super.apply(this, arguments);
        }
        return Mesh;
    })(jThreeObject);
    jThree.Mesh = Mesh;
})(jThree || (jThree = {}));
var buf;
var renderer;
var renderer2;
var attribNumber;
var attribNumber2;
var time = 0;
$(function () {
    var jThreeContext = jThree.JThreeContext.Instance;
    renderer = jThree.CanvasRenderer.fromCanvas(document.getElementById("test-canvas"));
    renderer2 = jThree.CanvasRenderer.fromCanvas(document.getElementById("test-canvas2"));
    jThreeContext.addRenderer(renderer);
    jThreeContext.addRenderer(renderer2);
    var vs = document.getElementById("vs");
    var vsShader = jThreeContext.ResourceManager.createShader("test-vs", vs.textContent, jThree.ShaderType.VertexShader);
    var fs = document.getElementById("fs");
    var fsShader = jThreeContext.ResourceManager.createShader("test-fs", fs.textContent, jThree.ShaderType.FragmentShader);
    vsShader.loadAll();
    fsShader.loadAll();
    console.log(vsShader.getTypeName());
    var prog = renderer.Context.CreateProgram();
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
        0.0,
        Math.sin(time / 100),
        0.0,
        1.0,
        0.0,
        0.0,
        -1.0,
        0.0,
        0.0
    ]), 9);
    var wrappedBuffer = buf.getForRenderer(renderer);
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
//# sourceMappingURL=jThree.js.map