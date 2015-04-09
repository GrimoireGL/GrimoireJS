var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var jThree;
(function (jThree) {
    var JThreeObject = jThree.Base.jThreeObject;
    var GLContextWrapperBase = (function (_super) {
        __extends(GLContextWrapperBase, _super);
        function GLContextWrapperBase() {
            _super.apply(this, arguments);
        }
        GLContextWrapperBase.prototype.CheckErrorAsFatal = function () {
            throw new jThree.Exceptions.AbstractClassMethodCalledException();
        };
        GLContextWrapperBase.prototype.CreateBuffer = function () {
            throw new jThree.Exceptions.AbstractClassMethodCalledException();
        };
        GLContextWrapperBase.prototype.BindBuffer = function (target, buffer) {
            throw new jThree.Exceptions.AbstractClassMethodCalledException();
        };
        GLContextWrapperBase.prototype.BufferData = function (target, array, usage) {
            throw new jThree.Exceptions.AbstractClassMethodCalledException();
        };
        GLContextWrapperBase.prototype.UnbindBuffer = function (target) {
            throw new jThree.Exceptions.AbstractClassMethodCalledException();
        };
        GLContextWrapperBase.prototype.ClearColor = function (red, green, blue, alpha) {
            throw new jThree.Exceptions.AbstractClassMethodCalledException();
        };
        GLContextWrapperBase.prototype.Clear = function (mask) {
            throw new jThree.Exceptions.AbstractClassMethodCalledException();
        };
        GLContextWrapperBase.prototype.CreateShader = function (flag) {
            throw new jThree.Exceptions.AbstractClassMethodCalledException();
        };
        GLContextWrapperBase.prototype.DeleteShader = function (shader) {
            throw new jThree.Exceptions.AbstractClassMethodCalledException();
        };
        GLContextWrapperBase.prototype.ShaderSource = function (shader, src) {
            throw new jThree.Exceptions.AbstractClassMethodCalledException();
        };
        GLContextWrapperBase.prototype.CompileShader = function (shader) {
            throw new jThree.Exceptions.AbstractClassMethodCalledException();
        };
        GLContextWrapperBase.prototype.CreateProgram = function () {
            throw new jThree.Exceptions.AbstractClassMethodCalledException();
        };
        GLContextWrapperBase.prototype.AttachShader = function (program, shader) {
            throw new jThree.Exceptions.AbstractClassMethodCalledException();
        };
        GLContextWrapperBase.prototype.LinkProgram = function (program) {
            throw new jThree.Exceptions.AbstractClassMethodCalledException();
        };
        GLContextWrapperBase.prototype.UseProgram = function (program) {
            throw new jThree.Exceptions.AbstractClassMethodCalledException();
        };
        GLContextWrapperBase.prototype.GetAttribLocation = function (program, name) {
            throw new jThree.Exceptions.AbstractClassMethodCalledException();
        };
        GLContextWrapperBase.prototype.EnableVertexAttribArray = function (attribNumber) {
            throw new jThree.Exceptions.AbstractClassMethodCalledException();
        };
        GLContextWrapperBase.prototype.VertexAttribPointer = function (attribLocation, sizePerVertex, elemType, normalized, stride, offset) {
            throw new jThree.Exceptions.AbstractClassMethodCalledException();
        };
        GLContextWrapperBase.prototype.DrawArrays = function (drawType, offset, length) {
            throw new jThree.Exceptions.AbstractClassMethodCalledException();
        };
        GLContextWrapperBase.prototype.Flush = function () {
            throw new jThree.Exceptions.AbstractClassMethodCalledException();
        };
        GLContextWrapperBase.prototype.Finish = function () {
            throw new jThree.Exceptions.AbstractClassMethodCalledException();
        };
        GLContextWrapperBase.prototype.DeleteBuffer = function (target) {
            throw new jThree.Exceptions.AbstractClassMethodCalledException();
        };
        GLContextWrapperBase.prototype.DeleteProgram = function (target) {
            throw new jThree.Exceptions.AbstractClassMethodCalledException();
        };
        return GLContextWrapperBase;
    })(JThreeObject);
    jThree.GLContextWrapperBase = GLContextWrapperBase;
    var WebGLWrapper = (function (_super) {
        __extends(WebGLWrapper, _super);
        function WebGLWrapper(gl) {
            _super.call(this);
            this.gl = gl;
        }
        WebGLWrapper.prototype.CheckErrorAsFatal = function () {
            var ec = this.gl.getError();
            if (ec !== WebGLRenderingContext.NO_ERROR) {
                alert("WebGL error was occured:{0}".format(ec));
            }
        };
        WebGLWrapper.prototype.CreateBuffer = function () {
            this.CheckErrorAsFatal();
            return this.gl.createBuffer();
        };
        WebGLWrapper.prototype.BindBuffer = function (target, buffer) {
            this.CheckErrorAsFatal();
            this.gl.bindBuffer(target, buffer);
        };
        WebGLWrapper.prototype.UnbindBuffer = function (target) {
            this.CheckErrorAsFatal();
            this.gl.bindBuffer(target, null);
        };
        WebGLWrapper.prototype.DeleteBuffer = function (target) {
            this.CheckErrorAsFatal();
            this.gl.deleteBuffer(target);
        };
        WebGLWrapper.prototype.BufferData = function (target, array, usage) {
            this.CheckErrorAsFatal();
            this.gl.bufferData(target, array, usage);
        };
        WebGLWrapper.prototype.ClearColor = function (red, green, blue, alpha) {
            this.CheckErrorAsFatal();
            this.gl.clearColor(red, green, blue, alpha);
        };
        WebGLWrapper.prototype.Clear = function (mask) {
            this.CheckErrorAsFatal();
            this.gl.clear(mask);
        };
        WebGLWrapper.prototype.CreateShader = function (flag) {
            this.CheckErrorAsFatal();
            return this.gl.createShader(flag);
        };
        WebGLWrapper.prototype.DeleteShader = function (shader) {
            this.CheckErrorAsFatal();
            this.gl.deleteShader(shader);
        };
        WebGLWrapper.prototype.ShaderSource = function (shader, src) {
            this.CheckErrorAsFatal();
            this.gl.shaderSource(shader, src);
        };
        WebGLWrapper.prototype.CompileShader = function (shader) {
            this.CheckErrorAsFatal();
            this.gl.compileShader(shader);
            if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
                //TODO 適切なエラー処理
                alert(this.gl.getShaderInfoLog(shader));
            }
            else {
                console.log("compile success");
            }
        };
        WebGLWrapper.prototype.CreateProgram = function () {
            this.CheckErrorAsFatal();
            return this.gl.createProgram();
        };
        WebGLWrapper.prototype.AttachShader = function (program, shader) {
            this.CheckErrorAsFatal();
            this.gl.attachShader(program, shader);
        };
        WebGLWrapper.prototype.LinkProgram = function (program) {
            this.CheckErrorAsFatal();
            this.gl.linkProgram(program);
            if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
                alert(this.gl.getProgramInfoLog(program));
            }
            else {
                console.log("link success");
            }
        };
        WebGLWrapper.prototype.UseProgram = function (program) {
            this.CheckErrorAsFatal();
            this.gl.useProgram(program);
        };
        WebGLWrapper.prototype.GetAttribLocation = function (program, name) {
            this.CheckErrorAsFatal();
            return this.gl.getAttribLocation(program, name);
        };
        WebGLWrapper.prototype.EnableVertexAttribArray = function (attribNumber) {
            this.CheckErrorAsFatal();
            this.gl.enableVertexAttribArray(attribNumber);
        };
        WebGLWrapper.prototype.VertexAttribPointer = function (attribLocation, sizePerVertex, elemType, normalized, stride, offset) {
            this.CheckErrorAsFatal();
            this.gl.vertexAttribPointer(attribLocation, sizePerVertex, elemType, normalized, stride, offset);
        };
        WebGLWrapper.prototype.DrawArrays = function (drawType, offset, length) {
            this.CheckErrorAsFatal();
            this.gl.drawArrays(drawType, offset, length);
        };
        WebGLWrapper.prototype.Flush = function () {
            this.CheckErrorAsFatal();
            this.gl.flush();
        };
        WebGLWrapper.prototype.Finish = function () {
            this.CheckErrorAsFatal();
            this.gl.finish();
        };
        WebGLWrapper.prototype.DeleteProgram = function (target) {
            this.CheckErrorAsFatal();
            this.gl.deleteProgram(target);
        };
        return WebGLWrapper;
    })(GLContextWrapperBase);
    jThree.WebGLWrapper = WebGLWrapper;
    (function (BufferTargetType) {
        BufferTargetType[BufferTargetType["ArrayBuffer"] = WebGLRenderingContext.ARRAY_BUFFER] = "ArrayBuffer";
        BufferTargetType[BufferTargetType["ElementArrayBuffer"] = WebGLRenderingContext.ELEMENT_ARRAY_BUFFER] = "ElementArrayBuffer";
    })(jThree.BufferTargetType || (jThree.BufferTargetType = {}));
    var BufferTargetType = jThree.BufferTargetType;
    (function (ClearTargetType) {
        ClearTargetType[ClearTargetType["ColorBits"] = WebGLRenderingContext.COLOR_BUFFER_BIT] = "ColorBits";
        ClearTargetType[ClearTargetType["DepthBits"] = WebGLRenderingContext.DEPTH_BUFFER_BIT] = "DepthBits";
        ClearTargetType[ClearTargetType["StencilBits"] = WebGLRenderingContext.STENCIL_BUFFER_BIT] = "StencilBits";
    })(jThree.ClearTargetType || (jThree.ClearTargetType = {}));
    var ClearTargetType = jThree.ClearTargetType;
    (function (ShaderType) {
        ShaderType[ShaderType["VertexShader"] = WebGLRenderingContext.VERTEX_SHADER] = "VertexShader";
        ShaderType[ShaderType["FragmentShader"] = WebGLRenderingContext.FRAGMENT_SHADER] = "FragmentShader";
    })(jThree.ShaderType || (jThree.ShaderType = {}));
    var ShaderType = jThree.ShaderType;
    (function (BufferUsageType) {
        BufferUsageType[BufferUsageType["StaticDraw"] = WebGLRenderingContext.STATIC_DRAW] = "StaticDraw";
        BufferUsageType[BufferUsageType["StreamDraw"] = WebGLRenderingContext.STREAM_DRAW] = "StreamDraw";
        BufferUsageType[BufferUsageType["DynamicDraw"] = WebGLRenderingContext.DYNAMIC_DRAW] = "DynamicDraw";
    })(jThree.BufferUsageType || (jThree.BufferUsageType = {}));
    var BufferUsageType = jThree.BufferUsageType;
    (function (ElementType) {
        ElementType[ElementType["Float"] = WebGLRenderingContext.FLOAT] = "Float";
        ElementType[ElementType["UnsignedByte"] = WebGLRenderingContext.UNSIGNED_BYTE] = "UnsignedByte";
        ElementType[ElementType["Short"] = WebGLRenderingContext.SHORT] = "Short";
        ElementType[ElementType["UnsignedShort"] = WebGLRenderingContext.UNSIGNED_SHORT] = "UnsignedShort";
        ElementType[ElementType["UnsignedInt"] = WebGLRenderingContext.UNSIGNED_INT] = "UnsignedInt";
        ElementType[ElementType["Int"] = WebGLRenderingContext.INT] = "Int";
    })(jThree.ElementType || (jThree.ElementType = {}));
    var ElementType = jThree.ElementType;
    (function (DrawType) {
        DrawType[DrawType["Triangles"] = WebGLRenderingContext.TRIANGLES] = "Triangles";
    })(jThree.DrawType || (jThree.DrawType = {}));
    var DrawType = jThree.DrawType;
})(jThree || (jThree = {}));
//# sourceMappingURL=Contexts.js.map