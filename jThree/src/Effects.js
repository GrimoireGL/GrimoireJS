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
        /**
         * コンテキストを跨いでシェーダーを管理しているクラス
         */
        var Shader = (function (_super) {
            __extends(Shader, _super);
            function Shader() {
                _super.apply(this, arguments);
                this.shaderWrappers = new Map();
            }
            Shader.CreateShader = function (renderers, source, shaderType) {
                var shader = new Shader();
                shader.shaderSource = source;
                shader.shaderType = shaderType;
                renderers.forEach(function (v, i, a) {
                    shader.shaderWrappers.set(v.ID, new ShaderWrapper(shader, v));
                });
                return shader;
            };
            Object.defineProperty(Shader.prototype, "ShaderType", {
                get: function () {
                    return this.shaderType;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Shader.prototype, "ShaderSource", {
                get: function () {
                    return this.shaderSource;
                },
                enumerable: true,
                configurable: true
            });
            Shader.prototype.loadAll = function () {
                this.shaderWrappers.forEach(function (v, i, a) {
                    v.init();
                });
            };
            Object.defineProperty(Shader.prototype, "ShaderWrappers", {
                get: function () {
                    return this.shaderWrappers;
                },
                enumerable: true,
                configurable: true
            });
            Shader.prototype.getForRenderer = function (renderer) {
                return this.shaderWrappers.get(renderer.ID);
            };
            return Shader;
        })(jThree.Base.jThreeObject);
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
            function Program() {
                _super.call(this);
                this.programWrappers = new Map();
            }
            Program.prototype.getForRenderer = function (renderer) {
                return this.programWrappers.get(renderer.ID);
            };
            Program.prototype.attachShader = function (shader) {
                this.programWrappers.forEach(function (v, i, a) {
                    v.attachShader(shader.ShaderWrappers.get(v.ID));
                });
            };
            return Program;
        })(jThree.Base.jThreeObject);
        Effects.Program = Program;
        var ProgramWrapper = (function (_super) {
            __extends(ProgramWrapper, _super);
            function ProgramWrapper(parent, renderer) {
                _super.call(this);
                this.id = "";
                this.initialized = false;
                this.targetProgram = null;
                this.glContext = null;
                this.parentProgram = null;
                this.id = renderer.ID;
                this.glContext = renderer.Context;
                this.parentProgram = parent;
            }
            ProgramWrapper.prototype.init = function () {
                if (!this.initialized) {
                    this.targetProgram = this.glContext.CreateProgram();
                }
            };
            ProgramWrapper.prototype.dispose = function () {
                if (this.initialized) {
                    this.glContext.DeleteProgram(this.targetProgram);
                    this.initialized = false;
                    this.targetProgram = null;
                }
            };
            ProgramWrapper.prototype.attachShader = function () {
                if (arguments.length !== 1)
                    throw new Error("invalid call");
                var casted = arguments[0];
                var targetShader = null;
                if (casted.getTypeName() === "Shader") {
                    var shader = casted;
                    targetShader = shader.ShaderWrappers.get(this.ID).TargetShader;
                }
                else if (casted.getTypeName() === "ShaderWrapper") {
                    var shaderWrapped = casted;
                    targetShader = shaderWrapped.TargetShader;
                }
                this.glContext.AttachShader(this.targetProgram, targetShader);
            };
            Object.defineProperty(ProgramWrapper.prototype, "ID", {
                //attachShader(shaderWrapper:ShaderWrapper): void {
                //    if (!this.initialized) this.init();
                //    this.glContext.AttachShader(this.targetProgram, shaderWrapper.TargetShader);
                //}
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