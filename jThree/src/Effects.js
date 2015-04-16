var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var jThree;
(function (jThree) {
    var Effects;
    (function (Effects) {
        var ContextSafeContainer = jThree.Base.ContextSafeResourceContainer;
        /**
        * コンテキストを跨いでシェーダーを管理しているクラス
        */
        var Shader = (function (_super) {
            __extends(Shader, _super);
            /**
             * コンストラクタ
             * (Should not be called by new,You should use CreateShader static method instead.)
             */
            function Shader(context) {
                _super.call(this, context);
            }
            /**
             * シェーダークラスを作成する。
             */
            Shader.CreateShader = function (context, source, shaderType) {
                var shader = new Shader(context);
                shader.shaderSource = source;
                shader.shaderType = shaderType;
                return shader;
            };
            Object.defineProperty(Shader.prototype, "ShaderType", {
                /**
                 * Shader Type
                 * (VertexShader or FragmentShader)
                 */
                get: function () {
                    return this.shaderType;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Shader.prototype, "ShaderSource", {
                /**
                 * Shader Source in text
                 */
                get: function () {
                    return this.shaderSource;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * Load all shaderWrappers
             */
            Shader.prototype.loadAll = function () {
                this.each(function (v) {
                    v.init();
                });
            };
            Shader.prototype.getInstanceForRenderer = function (renderer) {
                return new ShaderWrapper(this, renderer);
            };
            Shader.prototype.disposeResource = function (resource) {
                resource.dispose();
            };
            return Shader;
        })(ContextSafeContainer);
        Effects.Shader = Shader;
        var ShaderWrapper = (function (_super) {
            __extends(ShaderWrapper, _super);
            function ShaderWrapper(parent, renderer) {
                _super.call(this);
                this.ID = "";
                this.initialized = false;
                this.targetShader = null;
                this.glContext = null;
                this.parentShader = parent;
                this.glContext = renderer.Context;
                this.ID = renderer.ID;
            }
            Object.defineProperty(ShaderWrapper.prototype, "TargetShader", {
                get: function () {
                    if (!this.initialized)
                        this.init();
                    return this.targetShader;
                },
                enumerable: true,
                configurable: true
            });
            ShaderWrapper.prototype.init = function () {
                if (!this.initialized) {
                    this.targetShader = this.glContext.CreateShader(this.parentShader.ShaderType);
                    this.glContext.ShaderSource(this.targetShader, this.parentShader.ShaderSource);
                    this.glContext.CompileShader(this.targetShader);
                }
            };
            ShaderWrapper.prototype.dispose = function () {
                if (this.initialized) {
                    this.glContext.DeleteShader(this.targetShader);
                    this.targetShader = null;
                    this.initialized = false;
                }
            };
            return ShaderWrapper;
        })(jThree.Base.jThreeObject);
        Effects.ShaderWrapper = ShaderWrapper;
        var Program = (function (_super) {
            __extends(Program, _super);
            function Program(context) {
                _super.call(this, context);
                this.attachedShaders = [];
            }
            Object.defineProperty(Program.prototype, "AttachedShaders", {
                get: function () {
                    return this.attachedShaders;
                },
                enumerable: true,
                configurable: true
            });
            Program.prototype.attachShader = function (shader) {
                this.attachedShaders.push(shader);
            };
            Program.CreateProgram = function (context, attachShaders) {
                var program = new Program(context);
                program.attachedShaders = attachShaders;
                return program;
            };
            Program.prototype.disposeResource = function (resource) {
                resource.dispose();
            };
            Program.prototype.getInstanceForRenderer = function (renderer) {
                return new ProgramWrapper(this, renderer);
            };
            return Program;
        })(ContextSafeContainer);
        Effects.Program = Program;
        var ProgramWrapper = (function (_super) {
            __extends(ProgramWrapper, _super);
            function ProgramWrapper(parent, renderer) {
                _super.call(this);
                this.id = "";
                this.initialized = false;
                this.isLinked = false;
                this.targetProgram = null;
                this.glContext = null;
                this.parentProgram = null;
                this.attributeLocations = new Map();
                this.uniformLocations = new Map();
                this.id = renderer.ID;
                this.glContext = renderer.Context;
                this.parentProgram = parent;
            }
            Object.defineProperty(ProgramWrapper.prototype, "TargetProgram", {
                get: function () {
                    return this.targetProgram;
                },
                enumerable: true,
                configurable: true
            });
            ProgramWrapper.prototype.init = function () {
                var _this = this;
                if (!this.initialized) {
                    this.targetProgram = this.glContext.CreateProgram();
                    this.parentProgram.AttachedShaders.forEach(function (v, i, a) {
                        _this.glContext.AttachShader(_this.targetProgram, v.getForRendererID(_this.id).TargetShader);
                    });
                    this.initialized = true;
                }
            };
            ProgramWrapper.prototype.dispose = function () {
                if (this.initialized) {
                    this.glContext.DeleteProgram(this.targetProgram);
                    this.initialized = false;
                    this.targetProgram = null;
                    this.isLinked = false;
                }
            };
            ProgramWrapper.prototype.linkProgram = function () {
                if (!this.isLinked) {
                    this.glContext.LinkProgram(this.targetProgram);
                    this.isLinked = true;
                }
            };
            ProgramWrapper.prototype.useProgram = function () {
                if (!this.initialized) {
                    this.init();
                }
                if (!this.isLinked) {
                    this.linkProgram();
                }
                this.glContext.UseProgram(this.targetProgram);
            };
            ProgramWrapper.prototype.setUniformMatrix = function (valName, matrix) {
                this.useProgram();
                if (!this.uniformLocations.has(valName)) {
                    this.uniformLocations.set(valName, this.glContext.GetUniformLocation(this.TargetProgram, valName));
                }
                var uniformIndex = this.uniformLocations.get(valName);
                this.glContext.UniformMatrix(uniformIndex, matrix);
            };
            ProgramWrapper.prototype.setAttributeVerticies = function (valName, buffer) {
                this.useProgram();
                buffer.bindBuffer();
                if (!this.attributeLocations.has(valName)) {
                    this.attributeLocations.set(valName, this.glContext.GetAttribLocation(this.TargetProgram, valName));
                }
                var attribIndex = this.attributeLocations.get(valName);
                this.glContext.EnableVertexAttribArray(attribIndex);
                this.glContext.VertexAttribPointer(attribIndex, buffer.UnitCount, buf.ElementType, buf.Normalized, buf.Stride, buf.Offset);
            };
            Object.defineProperty(ProgramWrapper.prototype, "ID", {
                get: function () {
                    return this.id;
                },
                enumerable: true,
                configurable: true
            });
            return ProgramWrapper;
        })(jThree.Base.jThreeObject);
        Effects.ProgramWrapper = ProgramWrapper;
    })(Effects = jThree.Effects || (jThree.Effects = {}));
})(jThree || (jThree = {}));
//# sourceMappingURL=Effects.js.map