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
        var Shader = (function (_super) {
            __extends(Shader, _super);
            function Shader() {
                _super.apply(this, arguments);
                this.shaderWrappers = new Map();
            }
            Shader.CreateShader = function (renderers, source) {
                var shader = new Shader();
                renderers.forEach(function (v, i, a) {
                    shader.shaderWrappers.set(v.ID, new ShaderWrapper(shader, v.Context));
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
            return Shader;
        })(jThree.Base.jThreeObject);
        Effects.Shader = Shader;
        var ShaderWrapper = (function (_super) {
            __extends(ShaderWrapper, _super);
            function ShaderWrapper(parent, glContext) {
                _super.call(this);
                this.initialized = false;
                this.targetShader = null;
                this.glContext = null;
                this.parentShader = parent;
                this.glContext = glContext;
            }
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
                    this.initialized = false;
                }
            };
            return ShaderWrapper;
        })(jThree.Base.jThreeObject);
        Effects.ShaderWrapper = ShaderWrapper;
    })(Effects = jThree.Effects || (jThree.Effects = {}));
})(jThree || (jThree = {}));
//# sourceMappingURL=Effects.js.map