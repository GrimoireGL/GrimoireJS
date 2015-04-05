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
    var ResourceManager = (function (_super) {
        __extends(ResourceManager, _super);
        function ResourceManager(jThreeContext) {
            _super.call(this);
            this.buffers = new Map();
            this.context = jThreeContext;
        }
        ResourceManager.prototype.createBuffer = function (id, target, usage) {
            if (this.buffers.has(id)) {
                throw new Error("Buffer id cant be dupelicated");
            }
            var buf = Buffer.CreateBuffer(this.context.CanvasRenderers, target, usage);
            return buf;
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
        Object.defineProperty(CanvasRenderer.prototype, "Context", {
            get: function () {
                return this.context;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CanvasRenderer.prototype, "ID", {
            get: function () {
                return this.id;
            },
            enumerable: true,
            configurable: true
        });
        return CanvasRenderer;
    })(jThreeObject);
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
var attribNumber;
var time = 0;
$(function () {
    var jThreeContext = jThree.JThreeContext.Instance;
    renderer = jThree.CanvasRenderer.fromCanvas(document.getElementById("test-canvas"));
    jThreeContext.addRenderer(renderer);
    var vs = document.getElementById("vs");
    var vsShader = renderer.Context.CreateShader(jThree.ShaderType.VertexShader);
    renderer.Context.ShaderSource(vsShader, vs.textContent);
    renderer.Context.CompileShader(vsShader);
    var fs = document.getElementById("fs");
    var fsShader = renderer.Context.CreateShader(jThree.ShaderType.FragmentShader);
    renderer.Context.ShaderSource(fsShader, fs.textContent);
    renderer.Context.CompileShader(fsShader);
    var prog = renderer.Context.CreateProgram();
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
    renderer.Context.Clear(jThree.ClearTargetType.ColorBits);
    var wrappedBuffer = buf.BufferWrappers.get(renderer.ID);
    wrappedBuffer.bindBuffer();
    renderer.Context.EnableVertexAttribArray(attribNumber);
    renderer.Context.VertexAttribPointer(attribNumber, 3, jThree.ElementType.Float, false, 0, 0);
    renderer.Context.DrawArrays(jThree.DrawType.Triangles, 0, 3);
    renderer.Context.Flush();
    renderer.Context.Finish();
    window.setTimeout(Render, 1000 / 30);
}
//# sourceMappingURL=jThree.js.map