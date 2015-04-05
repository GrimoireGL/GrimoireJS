var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var jThree;
(function (jThree) {
    var Buffers;
    (function (Buffers) {
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
        Buffers.BufferProxy = BufferProxy;
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
                this.glContext.BufferData(this.parentBuffer.Target, array.buffer, this.parentBuffer.Usage);
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
        Buffers.BufferWrapper = BufferWrapper;
        var Buffer = (function (_super) {
            __extends(Buffer, _super);
            function Buffer() {
                _super.call(this, null, []);
                this.bufWrappers = new Map();
                this.parentBuffer = this;
            }
            Buffer.CreateBuffer = function (glContexts, target, usage) {
                var buf = new Buffer();
                buf.target = target;
                buf.usage = usage;
                glContexts.forEach(function (v, i, a) {
                    var wrap = new BufferWrapper(buf, v.Context);
                    buf.managedProxies.push(wrap);
                    buf.bufWrappers.set(v.ID, wrap);
                });
                return buf;
            };
            Object.defineProperty(Buffer.prototype, "Target", {
                get: function () {
                    return this.target;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Buffer.prototype, "Usage", {
                get: function () {
                    return this.usage;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Buffer.prototype, "BufferWrappers", {
                get: function () {
                    return this.bufWrappers;
                },
                enumerable: true,
                configurable: true
            });
            Buffer.prototype.getForRenderer = function (renderer) {
                return this.bufWrappers.get(renderer.ID);
            };
            return Buffer;
        })(BufferProxy);
        Buffers.Buffer = Buffer;
    })(Buffers = jThree.Buffers || (jThree.Buffers = {}));
})(jThree || (jThree = {}));
//# sourceMappingURL=Buffer.js.map