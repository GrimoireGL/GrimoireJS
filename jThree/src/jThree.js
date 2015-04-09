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
    var Program = jThree.Effects.Program;
    var Timer = (function (_super) {
        __extends(Timer, _super);
        function Timer() {
            _super.call(this);
            this.currentFrame = 0;
            this.time = 0;
            this.timeFromLast = 0;
        }
        Object.defineProperty(Timer.prototype, "CurrentFrame", {
            get: function () {
                return this.currentFrame;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Timer.prototype, "Time", {
            get: function () {
                return this.time;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Timer.prototype, "TimeFromLast", {
            get: function () {
                return this.timeFromLast;
            },
            enumerable: true,
            configurable: true
        });
        return Timer;
    })(jThreeObject);
    jThree.Timer = Timer;
    var ContextTimer = (function (_super) {
        __extends(ContextTimer, _super);
        function ContextTimer() {
            _super.apply(this, arguments);
        }
        ContextTimer.prototype.updateTimer = function () {
            this.currentFrame++;
            var date = Date.now();
            this.TimeFromLast = date - this.Time;
            this.time = date;
        };
        return ContextTimer;
    })(Timer);
    /**
     * コンテキストを跨いでリソースを管理するクラスをまとめているクラス
     */
    var ResourceManager = (function (_super) {
        __extends(ResourceManager, _super);
        function ResourceManager(jThreeContext) {
            _super.call(this);
            this.buffers = new Map();
            this.shaders = new Map();
            this.programs = new Map();
            this.context = jThreeContext;
        }
        ResourceManager.prototype.createBuffer = function (id, target, usage, unitCount, elementType) {
            if (this.buffers.has(id)) {
                throw new Error("Buffer id cant be dupelicated");
            }
            var buf = Buffer.CreateBuffer(this.context.CanvasRenderers, target, usage, unitCount, elementType);
            this.buffers.set(id, buf);
            return buf;
        };
        ResourceManager.prototype.createShader = function (id, source, shaderType) {
            var shader = Shader.CreateShader(this.context, source, shaderType);
            this.shaders.set(id, shader);
            return shader;
        };
        ResourceManager.prototype.createProgram = function (id, shaders) {
            var program = Program.CreateProgram(this.context, shaders);
            this.programs.set(id, program);
            return program;
        };
        return ResourceManager;
    })(jThreeObject);
    jThree.ResourceManager = ResourceManager;
    /**
     * jThree context managing all over the pages canvas
     */
    var JThreeContext = (function (_super) {
        __extends(JThreeContext, _super);
        function JThreeContext() {
            _super.call(this);
            this.canvasRenderers = [];
            this.onRendererChangedFuncs = [];
            this.resourceManager = new ResourceManager(this);
            this.timer = new ContextTimer();
        }
        Object.defineProperty(JThreeContext, "Instance", {
            /**
             * Singleton
             */
            get: function () {
                JThreeContext.instance = JThreeContext.instance || new JThreeContext();
                return JThreeContext.instance;
            },
            enumerable: true,
            configurable: true
        });
        JThreeContext.prototype.init = function () {
        };
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
        Object.defineProperty(JThreeContext.prototype, "Timer", {
            get: function () {
                return this.timer;
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
        /**
         * Add renderers to be managed by jThree
         */
        JThreeContext.prototype.addRenderer = function (renderer) {
            if (this.canvasRenderers.indexOf(renderer) === -1) {
                this.canvasRenderers.push(renderer);
                this.notifyRendererChanged(new jThree.Events.RendererListChangedEventArgs(jThree.Events.RendererStateChangedType.Add, renderer));
            }
        };
        /**
         * Remove renderer
         */
        JThreeContext.prototype.removeRenderer = function (renderer) {
            if (this.canvasRenderers.indexOf(renderer) !== -1) {
                for (var i = 0; i < this.canvasRenderers.length; i++) {
                    if (this.canvasRenderers[i] === renderer) {
                        this.canvasRenderers.splice(i, 1);
                        break;
                    }
                }
                this.notifyRendererChanged(new jThree.Events.RendererListChangedEventArgs(jThree.Events.RendererStateChangedType.Delete, renderer));
            }
        };
        /**
         * add function as renderer changed event handler.
         */
        JThreeContext.prototype.onRendererChanged = function (func) {
            if (this.onRendererChangedFuncs.indexOf(func) === -1) {
                this.onRendererChangedFuncs.push(func);
            }
        };
        /**
         * notify all event handlers
         */
        JThreeContext.prototype.notifyRendererChanged = function (arg) {
            this.onRendererChangedFuncs.forEach(function (v, i, a) { return v(arg); });
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
        CanvasRenderer.prototype.render = function () {
            if (!this.enabled)
                return;
            this.draw();
            this.context.Finish();
        };
        CanvasRenderer.prototype.draw = function () {
        };
        return CanvasRenderer;
    })(RendererBase);
    jThree.CanvasRenderer = CanvasRenderer;
    var Scene = (function (_super) {
        __extends(Scene, _super);
        function Scene() {
            _super.apply(this, arguments);
        }
        return Scene;
    })(jThreeObject);
    jThree.Scene = Scene;
    var SceneObject = (function (_super) {
        __extends(SceneObject, _super);
        function SceneObject() {
            _super.apply(this, arguments);
        }
        SceneObject.prototype.update = function () {
        };
        SceneObject.prototype.render = function () {
        };
        return SceneObject;
    })(jThreeObject);
    jThree.SceneObject = SceneObject;
})(jThree || (jThree = {}));
var buf;
var renderer;
var renderer2;
var attribNumber;
var attribNumber2;
var time = 0;
var p1Wrapper;
var p2Wrapper;
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
    var prog = jThreeContext.ResourceManager.createProgram("test-progran", [vsShader, fsShader]);
    console.log(vsShader);
    p1Wrapper = prog.getForRenderer(renderer);
    p1Wrapper.useProgram();
    attribNumber = renderer.Context.GetAttribLocation(p1Wrapper.TargetProgram, "position");
    p2Wrapper = prog.getForRenderer(renderer2);
    p2Wrapper.useProgram();
    buf = jThreeContext.ResourceManager.createBuffer("test-buffer", jThree.BufferTargetType.ArrayBuffer, jThree.BufferUsageType.DynamicDraw, 3, jThree.ElementType.Float);
    attribNumber2 = renderer2.Context.GetAttribLocation(p2Wrapper.TargetProgram, "position");
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
//# sourceMappingURL=jThree.js.map