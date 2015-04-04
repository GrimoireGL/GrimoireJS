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
    var JThreeContext = (function (_super) {
        __extends(JThreeContext, _super);
        function JThreeContext() {
            _super.call(this);
            this.canvasRenderers = [];
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
        return JThreeContext;
    })(jThreeObject);
    jThree.JThreeContext = JThreeContext;
    var CanvasRenderer = (function (_super) {
        __extends(CanvasRenderer, _super);
        function CanvasRenderer(glContext) {
            _super.call(this);
            this.glContext = glContext;
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
    //export class Buffer extends jThreeObject {
    //    get BufferIndex(): number {
    //        throw new jThree.Exceptions.jThreeException("Not implemented", "Not implemented");
    //    }
    //    constructor(bufType:BufferType) {
    //        super();
    //    }
    //}
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
        return GLContextWrapperBase;
    })(jThreeObject);
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
        WebGLWrapper.prototype.BufferData = function (target, array, usage) {
            this.CheckErrorAsFatal();
            this.gl.bufferData(target, array, usage);
        };
        return WebGLWrapper;
    })(GLContextWrapperBase);
    jThree.WebGLWrapper = WebGLWrapper;
    var BufferProxy = (function (_super) {
        __extends(BufferProxy, _super);
        function BufferProxy(parentBuffer, targetProxies) {
            var _this = this;
            _super.call(this, targetProxies);
            this.proxyHash = 0;
            //Remove dupelicated proxy
            targetProxies = this.targetArray = jThree.Collections.Collection.DistinctArray(targetProxies, function (t) { return _this.proxyHash; });
            this.managedProxies = targetProxies;
            //TODO generate ideal hash
            targetProxies.forEach(function (v, n, a) {
                _this.proxyHash += v.proxyHash;
            });
            this.parentBuffer = parentBuffer;
        }
        Object.defineProperty(BufferProxy.prototype, "ManagedProxies", {
            get: function () {
                return jThree.Collections.Collection.CopyArray(this.managedProxies);
            },
            enumerable: true,
            configurable: true
        });
        BufferProxy.prototype.update = function (array, length) {
            this.each(function (a) { return a.update(array, length); });
        };
        BufferProxy.prototype.loadAll = function () {
            this.each(function (a) { return a.loadAll(); });
        };
        Object.defineProperty(BufferProxy.prototype, "isAllInitialized", {
            get: function () {
                var isIniatilized = true;
                this.each(function (a) {
                    if (!a.isAllInitialized)
                        isIniatilized = false;
                });
                return isIniatilized;
            },
            enumerable: true,
            configurable: true
        });
        BufferProxy.prototype.each = function (act) {
            jThree.Collections.Collection.foreach(this, function (a, i) {
                act(a);
            });
        };
        BufferProxy.prototype.addProxy = function (proxy) {
            var proxies = this.ManagedProxies;
            var hasTarget = false;
            proxies.forEach(function (v, n, a) {
                if (v.proxyHash == proxy.proxyHash)
                    hasTarget = true;
            });
            if (!hasTarget)
                proxies.push(proxy);
            return new BufferProxy(this.parentBuffer, proxies);
        };
        BufferProxy.prototype.deleteProxy = function (proxy) {
            var proxies = this.ManagedProxies;
            var resultProxies = [];
            proxies.forEach(function (v, i, a) {
                if (proxy.proxyHash != v.proxyHash) {
                    resultProxies.push(v);
                }
            });
            return new BufferProxy(this.parentBuffer, resultProxies);
        };
        BufferProxy.prototype.getEnumrator = function () {
            return _super.prototype.getEnumrator.call(this);
        };
        return BufferProxy;
    })(jThree.Collections.ArrayEnumratorFactory);
    jThree.BufferProxy = BufferProxy;
    /**
     * Most based wrapper of buffer.
     */
    var BufferWrapper = (function (_super) {
        __extends(BufferWrapper, _super);
        function BufferWrapper(parentBuffer, glContext) {
            _super.call(this, parentBuffer, []);
            this.targetBuffer = null;
            this.isInitialized = false;
            this.glContext = glContext;
            this.targetArray = [this];
        }
        Object.defineProperty(BufferWrapper.prototype, "IsInitialized", {
            /**
             * Get the flag wheather this buffer is initialized or not.
             */
            get: function () {
                return this.isInitialized;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BufferWrapper.prototype, "isAllInitialized", {
            get: function () {
                return this.IsInitialized;
            },
            enumerable: true,
            configurable: true
        });
        BufferWrapper.prototype.update = function (array, length) {
            if (!this.isInitialized) {
                this.loadAll();
            }
            this.bindBuffer();
            this.glContext.BufferData(this.parentBuffer.Target, array.buffer, WebGLRenderingContext.STATIC_DRAW);
            this.unbindBuffer();
        };
        BufferWrapper.prototype.loadAll = function () {
            if (this.targetBuffer == null) {
                this.targetBuffer = this.glContext.CreateBuffer();
                this.isInitialized = true;
            }
        };
        BufferWrapper.prototype.bindBuffer = function () {
            if (this.isInitialized) {
                this.glContext.BindBuffer(this.parentBuffer.Target, this.targetBuffer);
            }
            else {
            }
        };
        BufferWrapper.prototype.unbindBuffer = function () {
            if (this.isInitialized) {
                this.glContext.UnbindBuffer(this.parentBuffer.Target);
            }
        };
        Object.defineProperty(BufferWrapper.prototype, "ManagedProxies", {
            get: function () {
                return [this];
            },
            enumerable: true,
            configurable: true
        });
        return BufferWrapper;
    })(BufferProxy);
    jThree.BufferWrapper = BufferWrapper;
    var Buffer = (function (_super) {
        __extends(Buffer, _super);
        function Buffer(targetProxies) {
            _super.call(this, null, targetProxies);
            this.parentBuffer = this;
        }
        Object.defineProperty(Buffer.prototype, "Target", {
            get: function () {
                return this.target;
            },
            enumerable: true,
            configurable: true
        });
        return Buffer;
    })(BufferProxy);
    jThree.Buffer = Buffer;
    (function (BufferTargetType) {
        BufferTargetType[BufferTargetType["ArrayBuffer"] = WebGLRenderingContext.ARRAY_BUFFER] = "ArrayBuffer";
        BufferTargetType[BufferTargetType["ElementArrayBuffer"] = WebGLRenderingContext.ELEMENT_ARRAY_BUFFER] = "ElementArrayBuffer";
    })(jThree.BufferTargetType || (jThree.BufferTargetType = {}));
    var BufferTargetType = jThree.BufferTargetType;
})(jThree || (jThree = {}));
$(function () {
    var renderer = jThree.CanvasRenderer.fromCanvas(document.getElementById("test-canvas"));
});
//# sourceMappingURL=jThree.js.map