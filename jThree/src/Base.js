var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
if (!String.prototype.format) {
    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, num) {
            if (typeof args[num] != 'undefined') {
                return args[num];
            }
            else {
                return match;
            }
        });
    };
}
var jThree;
(function (jThree) {
    var Base;
    (function (Base) {
        var JsHack = (function () {
            function JsHack() {
            }
            JsHack.getObjectName = function (obj) {
                var funcNameRegex = /function (.{1,})\(/;
                var result = (funcNameRegex).exec((obj).constructor.toString());
                return (result && result.length > 1) ? result[1] : "";
            };
            return JsHack;
        })();
        /**
         *This class indicate the class extends this class is added by jThree.
         */
        var jThreeObject = (function () {
            function jThreeObject() {
            }
            jThreeObject.prototype.toString = function () {
                return JsHack.getObjectName(this);
            };
            jThreeObject.prototype.getTypeName = function () {
                return JsHack.getObjectName(this);
            };
            return jThreeObject;
        })();
        Base.jThreeObject = jThreeObject;
        var jThreeID = (function () {
            function jThreeID() {
            }
            jThreeID.getUniqueRandom = function (length) {
                var random = "";
                for (var i = 0; i < length; i++) {
                    random += jThreeID.randomChars.charAt(Math.random() * jThreeID.randomChars.length);
                }
                return random;
            };
            jThreeID.randomChars = "abcdefghijklmnopqrstuvwxyzABCDEFHIJKLMNOPQRSTUVWXYZ1234567890-";
            return jThreeID;
        })();
        Base.jThreeID = jThreeID;
        var ContextSafeResourceContainer = (function (_super) {
            __extends(ContextSafeResourceContainer, _super);
            function ContextSafeResourceContainer(context) {
                var _this = this;
                _super.call(this);
                this.context = null;
                this.cachedObject = new Map();
                this.context = context;
                //Initialize resources for the renderers already subscribed.
                this.context.CanvasRenderers.forEach(function (v) {
                    _this.cachedObject.set(v.ID, _this.getInstanceForRenderer(v));
                });
                this.context.onRendererChanged(this.rendererChanged);
            }
            ContextSafeResourceContainer.prototype.getForRenderer = function (renderer) {
                return this.getForRendererID(renderer.ID);
            };
            ContextSafeResourceContainer.prototype.getForRendererID = function (id) {
                return this.cachedObject.get(id);
            };
            ContextSafeResourceContainer.prototype.each = function (act) {
                this.cachedObject.forEach((function (v, i, a) {
                    act(v);
                }));
            };
            ContextSafeResourceContainer.prototype.rendererChanged = function (arg) {
                switch (arg.ChangeType) {
                    case 0 /* Add */:
                        this.cachedObject.set(arg.AffectedRenderer.ID, this.getInstanceForRenderer(arg.AffectedRenderer));
                        break;
                    case 1 /* Delete */:
                        var delTarget = this.cachedObject.get(arg.AffectedRenderer.ID);
                        this.cachedObject.delete(arg.AffectedRenderer.ID);
                        this.disposeResource(delTarget);
                        break;
                }
            };
            ContextSafeResourceContainer.prototype.getInstanceForRenderer = function (renderer) {
                throw new jThree.Exceptions.AbstractClassMethodCalledException();
            };
            ContextSafeResourceContainer.prototype.disposeResource = function (resource) {
                throw new jThree.Exceptions.AbstractClassMethodCalledException();
            };
            return ContextSafeResourceContainer;
        })(jThreeObject);
        Base.ContextSafeResourceContainer = ContextSafeResourceContainer;
        var jThreeObjectWithID = (function (_super) {
            __extends(jThreeObjectWithID, _super);
            function jThreeObjectWithID() {
                _super.apply(this, arguments);
            }
            Object.defineProperty(jThreeObjectWithID.prototype, "ID", {
                /**
                 * このオブジェクトを識別するID
                 */
                get: function () {
                    return this.id;
                },
                enumerable: true,
                configurable: true
            });
            return jThreeObjectWithID;
        })(jThreeObject);
        Base.jThreeObjectWithID = jThreeObjectWithID;
    })(Base = jThree.Base || (jThree.Base = {}));
})(jThree || (jThree = {}));
//# sourceMappingURL=Base.js.map