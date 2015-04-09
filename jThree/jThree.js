///<reference path="../_references.ts"/>
var jThree;
(function (jThree) {
    var Collections;
    (function (Collections) {
        /**
         * The class for wrap basic javascript arrays as collection type implementing IEnumerator.
         */
        var ArrayEnumratorFactory = (function () {
            function ArrayEnumratorFactory(targetArray) {
                this.targetArray = targetArray;
            }
            ArrayEnumratorFactory.prototype.getEnumrator = function () {
                return new ArrayEnumerable(this.targetArray);
            };
            return ArrayEnumratorFactory;
        })();
        Collections.ArrayEnumratorFactory = ArrayEnumratorFactory;
        var ArrayEnumerable = (function () {
            function ArrayEnumerable(targetArrary) {
                this.currentIndex = -1;
                this.targetArrary = targetArrary;
            }
            ArrayEnumerable.prototype.getCurrent = function () {
                if (this.targetArrary.length > this.currentIndex && this.currentIndex >= 0) {
                    return this.targetArrary[this.currentIndex];
                }
            };
            ArrayEnumerable.prototype.next = function () {
                this.currentIndex++;
                if (this.currentIndex >= this.targetArrary.length)
                    return false;
                return true;
            };
            return ArrayEnumerable;
        })();
        /**
         * Containing some of methods use for IEnumerable generic interfaces.
         */
        var Collection = (function () {
            function Collection() {
            }
            /**
             * provides simple collection iteration like C# foreach syntax.
             */
            Collection.foreach = function (collection, act) {
                var enumerator = collection.getEnumrator();
                var index = 0;
                while (enumerator.next()) {
                    act(enumerator.getCurrent(), index);
                    index++;
                }
            };
            /**
             * provide the iteration that iterate 2 collections same time.
             * if the length of passed collection is different with the other collection, this method will stop when run out all elements in short collection.
             */
            Collection.foreachPair = function (col1, col2, act) {
                var en1 = col1.getEnumrator();
                var en2 = col2.getEnumrator();
                var index = 0;
                while (en1.next() && en2.next()) {
                    act(en1.getCurrent(), en2.getCurrent(), index);
                    index++;
                }
            };
            Collection.CopyArray = function (source) {
                var dest = new Array(source.length);
                for (var i = 0; i < source.length; i++) {
                    dest[i] = source[i];
                }
                return dest;
            };
            /**
             * 関数による評価値が等しいものを除外します
             */
            Collection.DistinctArray = function (source, ident) {
                var hashSet = new Set();
                var resultArray = [];
                source.forEach(function (v, n, a) {
                    if (!hashSet.has(ident(v))) {
                        resultArray.push(v);
                    }
                });
                return resultArray;
            };
            return Collection;
        })();
        Collections.Collection = Collection;
    })(Collections = jThree.Collections || (jThree.Collections = {}));
})(jThree || (jThree = {}));
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
    })(Base = jThree.Base || (jThree.Base = {}));
})(jThree || (jThree = {}));
var jThree;
(function (jThree) {
    var Mathematics;
    (function (Mathematics) {
        var jThreeObject = jThree.Base.jThreeObject;
        var DegreeMilliSecoundUnitConverter = (function (_super) {
            __extends(DegreeMilliSecoundUnitConverter, _super);
            function DegreeMilliSecoundUnitConverter() {
                _super.apply(this, arguments);
            }
            DegreeMilliSecoundUnitConverter.prototype.toRadian = function (val) {
                return jThreeMath.PI / 180 * val;
            };
            DegreeMilliSecoundUnitConverter.prototype.fromRadian = function (radian) {
                return 180 / jThreeMath.PI * radian;
            };
            DegreeMilliSecoundUnitConverter.prototype.toMilliSecound = function (val) {
                return val * 1000;
            };
            DegreeMilliSecoundUnitConverter.prototype.fromMilliSecound = function (milliSecound) {
                return milliSecound / 1000;
            };
            return DegreeMilliSecoundUnitConverter;
        })(jThreeObject);
        Mathematics.DegreeMilliSecoundUnitConverter = DegreeMilliSecoundUnitConverter;
        var jThreeMath = (function (_super) {
            __extends(jThreeMath, _super);
            function jThreeMath(unitConverter) {
                _super.call(this);
                this.converter = unitConverter || new DegreeMilliSecoundUnitConverter();
            }
            jThreeMath.prototype.radianResult = function (f) {
                return this.converter.fromRadian(f());
            };
            jThreeMath.prototype.radianRequest = function (v, f) {
                return f(this.converter.toRadian(v));
            };
            jThreeMath.prototype.getCurrentConverter = function () {
                return this.converter;
            };
            /**
             * 正弦
             */
            jThreeMath.prototype.sin = function (val) {
                return this.radianRequest(val, function (val) {
                    return Math.sin(val);
                });
            };
            /**
             * 余弦
             */
            jThreeMath.prototype.cos = function (val) {
                return this.radianRequest(val, function (val) {
                    return Math.cos(val);
                });
            };
            /**
             * 正接
             */
            jThreeMath.prototype.tan = function (val) {
                return this.radianRequest(val, function (val) {
                    return Math.tan(val);
                });
            };
            jThreeMath.prototype.asin = function (val) {
                return this.radianResult(function () {
                    return Math.asin(val);
                });
            };
            jThreeMath.prototype.acos = function (val) {
                return this.radianResult(function () {
                    return Math.acos(val);
                });
            };
            jThreeMath.prototype.atan = function (val) {
                return this.radianResult(function () {
                    return Math.atan(val);
                });
            };
            jThreeMath.range = function (val, lower, higher) {
                if (val >= lower && val < higher) {
                    return true;
                }
                else {
                    return false;
                }
            };
            jThreeMath.PI = Math.PI;
            jThreeMath.E = Math.E;
            return jThreeMath;
        })(jThreeObject);
        Mathematics.jThreeMath = jThreeMath;
    })(Mathematics = jThree.Mathematics || (jThree.Mathematics = {}));
})(jThree || (jThree = {}));
var jThree;
(function (jThree) {
    var Mathematics;
    (function (Mathematics) {
        var Vector;
        (function (Vector) {
            var jThreeMath = jThree.Mathematics.jThreeMath;
            var Collection = jThree.Collections.Collection;
            var LinearBase = (function () {
                function LinearBase() {
                }
                LinearBase.elementDot = function (a, b) {
                    var dot = 0;
                    Collection.foreachPair(a, b, function (a, b) {
                        dot += a * b;
                    });
                    return dot;
                };
                LinearBase.elementAdd = function (a, b, factory) {
                    var result = new Float32Array(a.ElementCount);
                    Collection.foreachPair(a, b, function (a, b, i) {
                        result[i] = a + b;
                    });
                    return factory.fromArray(result);
                };
                LinearBase.elementSubtract = function (a, b, factory) {
                    var result = new Float32Array(a.ElementCount);
                    Collection.foreachPair(a, b, function (a, b, i) {
                        result[i] = a - b;
                    });
                    return factory.fromArray(result);
                };
                LinearBase.elementScalarMultiply = function (a, s, factory) {
                    var result = new Float32Array(a.ElementCount);
                    Collection.foreach(a, function (a, i) {
                        result[i] = a * s;
                    });
                    return factory.fromArray(result);
                };
                LinearBase.elementEqual = function (a, b) {
                    var result = true;
                    Collection.foreachPair(a, b, function (a, b, i) {
                        if (a != b)
                            result = false;
                    });
                    return result;
                };
                LinearBase.elementNegate = function (a, factory) {
                    var result = new Float32Array(a.ElementCount);
                    Collection.foreach(a, function (a, i) {
                        result[i] = -a;
                    });
                    return factory.fromArray(result);
                };
                LinearBase.elementNaN = function (a) {
                    var result = false;
                    Collection.foreach(a, function (a, i) {
                        if (isNaN(a))
                            result = true;
                    });
                    return result;
                };
                Object.defineProperty(LinearBase.prototype, "ElementCount", {
                    get: function () {
                        return 0;
                    },
                    enumerable: true,
                    configurable: true
                });
                LinearBase.prototype.getEnumrator = function () {
                    throw new Error("Not implemented");
                };
                return LinearBase;
            })();
            Vector.LinearBase = LinearBase;
            var VectorBase = (function (_super) {
                __extends(VectorBase, _super);
                function VectorBase() {
                    _super.apply(this, arguments);
                    this.magnitudeSquaredCache = -1;
                    this.magnitudeCache = -1;
                }
                Object.defineProperty(VectorBase.prototype, "magnitudeSquared", {
                    get: function () {
                        if (this.magnitudeSquaredCache < 0) {
                            var sum = 0;
                            Collection.foreach(this, function (t) {
                                sum += t * t;
                            });
                            this.magnitudeSquaredCache = sum;
                        }
                        return this.magnitudeSquaredCache;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(VectorBase.prototype, "magnitude", {
                    get: function () {
                        if (this.magnitudeCache < 0) {
                            this.magnitudeCache = Math.sqrt(this.magnitudeSquared);
                        }
                        return this.magnitudeCache;
                    },
                    enumerable: true,
                    configurable: true
                });
                return VectorBase;
            })(LinearBase);
            Vector.VectorBase = VectorBase;
            var VectorEnumeratorBase = (function () {
                function VectorEnumeratorBase(vec) {
                    this.elementCount = 0;
                    this.currentIndex = -1;
                    this.vector = vec;
                    this.elementCount = vec.ElementCount;
                }
                VectorEnumeratorBase.prototype.getCurrent = function () {
                    throw new Error("Not implemented");
                };
                VectorEnumeratorBase.prototype.next = function () {
                    this.currentIndex++;
                    return jThreeMath.range(this.currentIndex, 0, this.elementCount);
                };
                return VectorEnumeratorBase;
            })();
            var Vector2Enumerator = (function (_super) {
                __extends(Vector2Enumerator, _super);
                function Vector2Enumerator(vec) {
                    _super.call(this, vec);
                }
                Vector2Enumerator.prototype.getCurrent = function () {
                    switch (this.currentIndex) {
                        case 0:
                            return this.vector.X;
                        case 1:
                            return this.vector.Y;
                        default:
                            throw new jThree.Exceptions.IrregularElementAccessException(this.currentIndex);
                    }
                };
                return Vector2Enumerator;
            })(VectorEnumeratorBase);
            var Vector3Enumerator = (function (_super) {
                __extends(Vector3Enumerator, _super);
                function Vector3Enumerator(vec) {
                    _super.call(this, vec);
                }
                Vector3Enumerator.prototype.getCurrent = function () {
                    switch (this.currentIndex) {
                        case 0:
                            return this.vector.X;
                        case 1:
                            return this.vector.Y;
                        case 2:
                            return this.vector.Z;
                        default:
                            throw new jThree.Exceptions.IrregularElementAccessException(this.currentIndex);
                    }
                };
                return Vector3Enumerator;
            })(VectorEnumeratorBase);
            var Vector4Enumerator = (function (_super) {
                __extends(Vector4Enumerator, _super);
                function Vector4Enumerator(vec) {
                    _super.call(this, vec);
                }
                Vector4Enumerator.prototype.getCurrent = function () {
                    switch (this.currentIndex) {
                        case 0:
                            return this.vector.X;
                        case 1:
                            return this.vector.Y;
                        case 2:
                            return this.vector.Z;
                        case 3:
                            return this.vector.W;
                        default:
                            throw new jThree.Exceptions.IrregularElementAccessException(this.currentIndex);
                    }
                };
                return Vector4Enumerator;
            })(VectorEnumeratorBase);
            var Vector2Factory = (function () {
                function Vector2Factory() {
                }
                Vector2Factory.getInstance = function () {
                    this.instance = this.instance || new Vector2Factory();
                    return this.instance;
                };
                Vector2Factory.prototype.fromArray = function (array) {
                    return new Vector2(array[0], array[1]);
                };
                return Vector2Factory;
            })();
            var Vector3Factory = (function () {
                function Vector3Factory() {
                }
                Vector3Factory.getInstance = function () {
                    this.instance = this.instance || new Vector3Factory();
                    return this.instance;
                };
                Vector3Factory.prototype.fromArray = function (array) {
                    return new Vector3(array[0], array[1], array[2]);
                };
                return Vector3Factory;
            })();
            var Vector4Factory = (function () {
                function Vector4Factory() {
                }
                Vector4Factory.getInstance = function () {
                    this.instance = this.instance || new Vector4Factory();
                    return this.instance;
                };
                Vector4Factory.prototype.fromArray = function (array) {
                    return new Vector4(array[0], array[1], array[2], array[3]);
                };
                return Vector4Factory;
            })();
            var Vector2 = (function (_super) {
                __extends(Vector2, _super);
                function Vector2(x, y) {
                    _super.call(this);
                    this.x = x;
                    this.y = y;
                }
                Object.defineProperty(Vector2, "XUnit", {
                    get: function () {
                        return new Vector2(1, 0);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Vector2, "YUnit", {
                    get: function () {
                        return new Vector2(0, 1);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Vector2.prototype, "X", {
                    get: function () {
                        return this.x;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Vector2.prototype, "Y", {
                    get: function () {
                        return this.y;
                    },
                    enumerable: true,
                    configurable: true
                });
                Vector2.dot = function (v1, v2) {
                    return VectorBase.elementDot(v1, v2);
                };
                Vector2.add = function (v1, v2) {
                    return VectorBase.elementAdd(v1, v2, v1.getFactory());
                };
                Vector2.subtract = function (v1, v2) {
                    return VectorBase.elementSubtract(v1, v2, v1.getFactory());
                };
                Vector2.multiply = function (s, v) {
                    return VectorBase.elementScalarMultiply(v, s, v.getFactory());
                };
                Vector2.negate = function (v1) {
                    return VectorBase.elementNegate(v1, v1.getFactory());
                };
                Vector2.equal = function (v1, v2) {
                    return VectorBase.elementEqual(v1, v2);
                };
                Vector2.prototype.dotWith = function (v) {
                    return Vector2.dot(this, v);
                };
                Vector2.prototype.addWith = function (v) {
                    return Vector2.add(this, v);
                };
                Vector2.prototype.subtractWith = function (v) {
                    return Vector2.subtract(v, this);
                };
                Vector2.prototype.multiplyWith = function (s) {
                    return Vector2.multiply(s, this);
                };
                Vector2.prototype.negateThis = function () {
                    return Vector2.negate(this);
                };
                Vector2.prototype.equalWith = function (v) {
                    return Vector2.equal(this, v);
                };
                Vector2.prototype.toString = function () {
                    return "Vector2(x={0},y={1})".format(this.x, this.y);
                };
                Vector2.prototype.getEnumrator = function () {
                    return new Vector2Enumerator(this);
                };
                Object.defineProperty(Vector2.prototype, "ElementCount", {
                    get: function () {
                        return 2;
                    },
                    enumerable: true,
                    configurable: true
                });
                Vector2.prototype.getFactory = function () {
                    return Vector2Factory.getInstance();
                };
                return Vector2;
            })(VectorBase);
            Vector.Vector2 = Vector2;
            var Vector3 = (function (_super) {
                __extends(Vector3, _super);
                function Vector3(x, y, z) {
                    _super.call(this);
                    this.x = x;
                    this.y = y;
                    this.z = z;
                }
                Object.defineProperty(Vector3, "XUnit", {
                    get: function () {
                        return new Vector3(1, 0, 0);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Vector3, "YUnit", {
                    get: function () {
                        return new Vector3(0, 1, 0);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Vector3, "ZUnit", {
                    get: function () {
                        return new Vector3(0, 0, 1);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Vector3.prototype, "X", {
                    get: function () {
                        return this.x;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Vector3.prototype, "Y", {
                    get: function () {
                        return this.y;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Vector3.prototype, "Z", {
                    get: function () {
                        return this.z;
                    },
                    enumerable: true,
                    configurable: true
                });
                Vector3.dot = function (v1, v2) {
                    return VectorBase.elementDot(v1, v2);
                };
                Vector3.add = function (v1, v2) {
                    return VectorBase.elementAdd(v1, v2, v1.getFactory());
                };
                Vector3.subtract = function (v1, v2) {
                    return VectorBase.elementSubtract(v1, v2, v1.getFactory());
                };
                Vector3.multiply = function (s, v) {
                    return VectorBase.elementScalarMultiply(v, s, v.getFactory());
                };
                Vector3.negate = function (v1) {
                    return VectorBase.elementNegate(v1, v1.getFactory());
                };
                Vector3.equal = function (v1, v2) {
                    return VectorBase.elementEqual(v1, v2);
                };
                Vector3.prototype.dotWith = function (v) {
                    return Vector3.dot(this, v);
                };
                Vector3.prototype.addWith = function (v) {
                    return Vector3.add(this, v);
                };
                Vector3.prototype.subtractWith = function (v) {
                    return Vector3.subtract(v, this);
                };
                Vector3.prototype.multiplyWith = function (s) {
                    return Vector3.multiply(s, this);
                };
                Vector3.prototype.negateThis = function () {
                    return Vector3.negate(this);
                };
                Vector3.prototype.equalWith = function (v) {
                    return Vector3.equal(this, v);
                };
                Vector3.prototype.toString = function () {
                    return "Vector3(x={0},y={1},z={2})".format(this.x, this.y, this.z);
                };
                Vector3.prototype.getEnumrator = function () {
                    return new Vector3Enumerator(this);
                };
                Object.defineProperty(Vector3.prototype, "ElementCount", {
                    get: function () {
                        return 3;
                    },
                    enumerable: true,
                    configurable: true
                });
                Vector3.prototype.getFactory = function () {
                    return Vector3Factory.getInstance();
                };
                return Vector3;
            })(VectorBase);
            Vector.Vector3 = Vector3;
            var Vector4 = (function (_super) {
                __extends(Vector4, _super);
                function Vector4(x, y, z, w) {
                    _super.call(this);
                    this.x = x;
                    this.y = y;
                    this.z = z;
                    this.w = w;
                }
                Object.defineProperty(Vector4, "XUnit", {
                    get: function () {
                        return new Vector4(1, 0, 0, 0);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Vector4, "YUnit", {
                    get: function () {
                        return new Vector4(0, 1, 0, 0);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Vector4, "ZUnit", {
                    get: function () {
                        return new Vector4(0, 0, 1, 0);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Vector4, "WUnit", {
                    get: function () {
                        return new Vector4(0, 0, 0, 1);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Vector4.prototype, "X", {
                    get: function () {
                        return this.x;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Vector4.prototype, "Y", {
                    get: function () {
                        return this.y;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Vector4.prototype, "Z", {
                    get: function () {
                        return this.z;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Vector4.prototype, "W", {
                    get: function () {
                        return this.w;
                    },
                    enumerable: true,
                    configurable: true
                });
                Vector4.dot = function (v1, v2) {
                    return this.elementDot(v1, v2);
                };
                Vector4.add = function (v1, v2) {
                    return VectorBase.elementAdd(v1, v2, v1.getFactory());
                };
                Vector4.subtract = function (v1, v2) {
                    return VectorBase.elementSubtract(v1, v2, v1.getFactory());
                };
                Vector4.multiply = function (s, v) {
                    return VectorBase.elementScalarMultiply(v, s, v.getFactory());
                };
                Vector4.negate = function (v1) {
                    return VectorBase.elementNegate(v1, v1.getFactory());
                };
                Vector4.equal = function (v1, v2) {
                    return VectorBase.elementEqual(v1, v2);
                };
                Vector4.prototype.dotWith = function (v) {
                    return Vector4.dot(this, v);
                };
                Vector4.prototype.addWith = function (v) {
                    return Vector4.add(this, v);
                };
                Vector4.prototype.subtractWith = function (v) {
                    return Vector4.subtract(v, this);
                };
                Vector4.prototype.multiplyWith = function (s) {
                    return Vector4.multiply(s, this);
                };
                Vector4.prototype.negateThis = function () {
                    return Vector4.negate(this);
                };
                Vector4.prototype.equalWith = function (v) {
                    return Vector4.equal(this, v);
                };
                Vector4.prototype.getEnumrator = function () {
                    return new Vector4Enumerator(this);
                };
                Object.defineProperty(Vector4.prototype, "ElementCount", {
                    get: function () {
                        return 4;
                    },
                    enumerable: true,
                    configurable: true
                });
                Vector4.prototype.toString = function () {
                    return "Vector4(x={0},y={1},z={2},w={3}".format(this.x, this.y, this.z, this.w);
                };
                Vector4.prototype.getFactory = function () {
                    return Vector4Factory.getInstance();
                };
                return Vector4;
            })(VectorBase);
            Vector.Vector4 = Vector4;
        })(Vector = Mathematics.Vector || (Mathematics.Vector = {}));
    })(Mathematics = jThree.Mathematics || (jThree.Mathematics = {}));
})(jThree || (jThree = {}));
///<reference path="../_references.ts"/>
var jThree;
(function (jThree) {
    var Exceptions;
    (function (Exceptions) {
        var jThreeObject = jThree.Base.jThreeObject;
        /**
         * This class is root class perform as exception arguments in jThree.
         */
        var jThreeException = (function (_super) {
            __extends(jThreeException, _super);
            function jThreeException(name, message) {
                _super.call(this);
                this.name = name;
                this.message = message;
            }
            jThreeException.prototype.toString = function () {
                return "Exception:{0}\nName:{1}\nMessage:{2}".format(_super.prototype.toString.call(this), this.name, this.message);
            };
            return jThreeException;
        })(jThreeObject);
        Exceptions.jThreeException = jThreeException;
        var IrregularElementAccessException = (function (_super) {
            __extends(IrregularElementAccessException, _super);
            function IrregularElementAccessException(accessIndex) {
                _super.call(this, "Irregular vector element was accessed.", "You attempted to access {0} element. But,this vector have enough dimension.".format(accessIndex));
            }
            return IrregularElementAccessException;
        })(jThreeException);
        Exceptions.IrregularElementAccessException = IrregularElementAccessException;
        var InvalidArgumentException = (function (_super) {
            __extends(InvalidArgumentException, _super);
            function InvalidArgumentException(message) {
                _super.call(this, "Invalid argument was passed.", message);
            }
            return InvalidArgumentException;
        })(jThreeException);
        Exceptions.InvalidArgumentException = InvalidArgumentException;
        var SingularMatrixException = (function (_super) {
            __extends(SingularMatrixException, _super);
            function SingularMatrixException(m) {
                _super.call(this, "Passed matrix is singular matrix", "passed matrix:{0}".format(m.toString()));
            }
            return SingularMatrixException;
        })(jThreeException);
        Exceptions.SingularMatrixException = SingularMatrixException;
        var AbstractClassMethodCalledException = (function (_super) {
            __extends(AbstractClassMethodCalledException, _super);
            function AbstractClassMethodCalledException() {
                _super.call(this, "Invalid method was called.", "This method is abstract method, cant call by this instance");
            }
            return AbstractClassMethodCalledException;
        })(jThreeException);
        Exceptions.AbstractClassMethodCalledException = AbstractClassMethodCalledException;
        var WebGLErrorException = (function (_super) {
            __extends(WebGLErrorException, _super);
            function WebGLErrorException(text) {
                _super.call(this, "WebGL reported error.", text);
            }
            return WebGLErrorException;
        })(jThreeException);
        Exceptions.WebGLErrorException = WebGLErrorException;
    })(Exceptions = jThree.Exceptions || (jThree.Exceptions = {}));
})(jThree || (jThree = {}));
///<reference path="../_references.ts"/>
var jThree;
(function (jThree) {
    var Matrix;
    (function (_Matrix) {
        var JThreeObject = jThree.Base.jThreeObject;
        var Collection = jThree.Collections.Collection;
        var MatrixFactory = (function () {
            function MatrixFactory() {
            }
            MatrixFactory.prototype.fromArray = function (array) {
                return new Matrix(array);
            };
            MatrixFactory.prototype.fromFunc = function (f) {
                return new Matrix(new Float32Array([f(0, 0), f(0, 1), f(0, 2), f(0, 3), f(1, 0), f(1, 1), f(1, 2), f(1, 3), f(2, 0), f(2, 1), f(2, 2), f(2, 3), f(3, 0), f(3, 1), f(3, 2), f(3, 3)]));
            };
            return MatrixFactory;
        })();
        _Matrix.MatrixFactory = MatrixFactory;
        var MatrixEnumerator = (function (_super) {
            __extends(MatrixEnumerator, _super);
            function MatrixEnumerator(targetMat) {
                _super.call(this);
                this.currentIndex = -1;
                this.targetMat = targetMat;
            }
            MatrixEnumerator.prototype.getCurrent = function () {
                return this.targetMat.getBySingleIndex(this.currentIndex);
            };
            MatrixEnumerator.prototype.next = function () {
                this.currentIndex++;
                if (this.currentIndex >= 0 && this.currentIndex < 16)
                    return true;
                return false;
            };
            return MatrixEnumerator;
        })(JThreeObject);
        var MatrixBase = (function (_super) {
            __extends(MatrixBase, _super);
            function MatrixBase() {
                _super.apply(this, arguments);
            }
            MatrixBase.prototype.getEnumrator = function () {
                throw new Error("Not implemented");
            };
            MatrixBase.elementTranspose = function (a, factory) {
                return factory.fromFunc(function (i, j) {
                    return a.getAt(j, i);
                });
            };
            Object.defineProperty(MatrixBase.prototype, "RowCount", {
                get: function () {
                    return 0;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MatrixBase.prototype, "ColmunCount", {
                get: function () {
                    return 0;
                },
                enumerable: true,
                configurable: true
            });
            MatrixBase.prototype.getAt = function (row, colmun) {
                throw new Error("Not implemented");
            };
            MatrixBase.prototype.getBySingleIndex = function (index) {
                throw new Error("Not implemented");
            };
            return MatrixBase;
        })(jThree.Mathematics.Vector.LinearBase);
        _Matrix.MatrixBase = MatrixBase;
        var Matrix = (function (_super) {
            __extends(Matrix, _super);
            function Matrix(arr) {
                _super.call(this);
                this.elements = Matrix.zeroElements();
                if (!this.isValidArray(arr))
                    throw new jThree.Exceptions.InvalidArgumentException("Invalid matrix source was passed.");
                this.elements = arr;
            }
            Matrix.zero = function () {
                return new Matrix(this.zeroElements());
            };
            Matrix.identity = function () {
                return new Matrix(this.identityElements());
            };
            Matrix.zeroElements = function () {
                return new Float32Array([
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0
                ]);
            };
            Matrix.identityElements = function () {
                return new Float32Array([
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                ]);
            };
            Matrix.prototype.isValidArray = function (arr) {
                if (arr.length !== 16)
                    return false;
                return true;
            };
            Matrix.prototype.getAt = function (row, colmun) {
                return this.elements[colmun + row * 4];
            };
            Matrix.prototype.setAt = function (colmun, row, val) {
                this.elements.set[colmun + row * 4] = val;
            };
            Matrix.prototype.getBySingleIndex = function (index) {
                return this.elements[index];
            };
            Matrix.prototype.getColmun = function (col) {
                return new jThree.Mathematics.Vector.Vector4(this.elements[col], this.elements[col + 4], this.elements[col + 8], this.elements[col + 12]);
            };
            Matrix.prototype.getRow = function (row) {
                return new jThree.Mathematics.Vector.Vector4(this.elements[row * 4], this.elements[row * 4 + 1], this.elements[row * 4 + 2], this.elements[row * 4 + 3]);
            };
            Matrix.prototype.isNaN = function () {
                var result = false;
                jThree.Collections.Collection.foreach(this, function (a) {
                    if (isNaN(a))
                        result = true;
                });
                return result;
            };
            Matrix.equal = function (m1, m2) {
                return this.elementEqual(m1, m2);
            };
            Matrix.add = function (m1, m2) {
                return this.elementAdd(m1, m2, m1.getFactory());
            };
            Matrix.subtract = function (m1, m2) {
                return this.elementSubtract(m1, m2, m1.getFactory());
            };
            Matrix.scalarMultiply = function (s, m) {
                return this.elementScalarMultiply(m, s, m.getFactory());
            };
            Matrix.multiply = function (m1, m2) {
                return m1.getFactory().fromFunc(function (i, j) {
                    var sum = 0;
                    Collection.foreachPair(m1.getRow(i), m2.getColmun(j), function (i, j, k) {
                        sum += i * j;
                    });
                    return sum;
                });
            };
            Matrix.negate = function (m) {
                return this.elementNegate(m, m.getFactory());
            };
            Matrix.transpose = function (m) {
                return this.elementTranspose(m, m.getFactory());
            };
            Matrix.transformPoint = function (m, v) {
                var result = new Float32Array(3);
                for (var i = 0; i < 3; i++) {
                    result[i] = 0;
                    Collection.foreachPair(m.getRow(i), v, function (r, v, index) {
                        result[i] += r * v;
                    });
                }
                for (var i = 0; i < 3; i++) {
                    result[i] += m.getAt(i, 3);
                }
                return v.getFactory().fromArray(result);
            };
            Matrix.transformNormal = function (m, v) {
                var result = new Float32Array(3);
                for (var i = 0; i < 3; i++) {
                    result[i] = 0;
                    Collection.foreachPair(m.getRow(i), v, function (r, v, index) {
                        result[i] += r * v;
                    });
                }
                return v.getFactory().fromArray(result);
            };
            Matrix.transform = function (m, v) {
                var result = new Float32Array(4);
                for (var i = 0; i < 4; i++) {
                    result[i] = 0;
                    Collection.foreachPair(m.getRow(i), v, function (r, v, index) {
                        result[i] += r * v;
                    });
                }
                return v.getFactory().fromArray(result);
            };
            /**
             * Retrieve determinant of passed matrix
             */
            Matrix.determinant = function (m) {
                var m00 = m.getAt(0, 0), m01 = m.getAt(0, 1), m02 = m.getAt(0, 2), m03 = m.getAt(0, 3);
                var m10 = m.getAt(1, 0), m11 = m.getAt(1, 1), m12 = m.getAt(1, 2), m13 = m.getAt(1, 3);
                var m20 = m.getAt(2, 0), m21 = m.getAt(2, 1), m22 = m.getAt(2, 2), m23 = m.getAt(2, 3);
                var m30 = m.getAt(3, 0), m31 = m.getAt(3, 1), m32 = m.getAt(3, 2), m33 = m.getAt(3, 3);
                return m03 * m12 * m21 * m30 - m02 * m13 * m21 * m30 - m03 * m11 * m22 * m30 + m01 * m13 * m22 * m30 + m02 * m11 * m23 * m30 - m01 * m12 * m23 * m30 - m03 * m12 * m20 * m31 + m02 * m13 * m20 * m31 + m03 * m10 * m22 * m31 - m00 * m13 * m22 * m31 - m02 * m10 * m23 * m31 + m00 * m12 * m23 * m31 + m03 * m11 * m20 * m32 - m01 * m13 * m20 * m32 - m03 * m10 * m21 * m32 + m00 * m13 * m21 * m32 + m01 * m10 * m23 * m32 - m00 * m11 * m23 * m32 - m02 * m11 * m20 * m33 + m01 * m12 * m20 * m33 + m02 * m10 * m21 * m33 - m00 * m12 * m21 * m33 - m01 * m10 * m22 * m33 + m00 * m11 * m22 * m33;
            };
            /**
             * Compute inverted passed matrix.
             */
            Matrix.inverse = function (m) {
                var det = Matrix.determinant(m);
                if (det == 0)
                    throw new jThree.Exceptions.SingularMatrixException(m);
                var m00 = m.getAt(0, 0), m01 = m.getAt(0, 1), m02 = m.getAt(0, 2), m03 = m.getAt(0, 3);
                var m10 = m.getAt(1, 0), m11 = m.getAt(1, 1), m12 = m.getAt(1, 2), m13 = m.getAt(1, 3);
                var m20 = m.getAt(2, 0), m21 = m.getAt(2, 1), m22 = m.getAt(2, 2), m23 = m.getAt(2, 3);
                var m30 = m.getAt(3, 0), m31 = m.getAt(3, 1), m32 = m.getAt(3, 2), m33 = m.getAt(3, 3);
                m00 = m12 * m23 * m31 - m13 * m22 * m31 + m13 * m21 * m32 - m11 * m23 * m32 - m12 * m21 * m33 + m11 * m22 * m33;
                m01 = m03 * m22 * m31 - m02 * m23 * m31 - m03 * m21 * m32 + m01 * m23 * m32 + m02 * m21 * m33 - m01 * m22 * m33;
                m02 = m02 * m13 * m31 - m03 * m12 * m31 + m03 * m11 * m32 - m01 * m13 * m32 - m02 * m11 * m33 + m01 * m12 * m33;
                m03 = m03 * m12 * m21 - m02 * m13 * m21 - m03 * m11 * m22 + m01 * m13 * m22 + m02 * m11 * m23 - m01 * m12 * m23;
                m10 = m13 * m22 * m30 - m12 * m23 * m30 - m13 * m20 * m32 + m10 * m23 * m32 + m12 * m20 * m33 - m10 * m22 * m33;
                m11 = m02 * m23 * m30 - m03 * m22 * m30 + m03 * m20 * m32 - m00 * m23 * m32 - m02 * m20 * m33 + m00 * m22 * m33;
                m12 = m03 * m12 * m30 - m02 * m13 * m30 - m03 * m10 * m32 + m00 * m13 * m32 + m02 * m10 * m33 - m00 * m12 * m33;
                m13 = m02 * m13 * m20 - m03 * m12 * m20 + m03 * m10 * m22 - m00 * m13 * m22 - m02 * m10 * m23 + m00 * m12 * m23;
                m20 = m11 * m23 * m30 - m13 * m21 * m30 + m13 * m20 * m31 - m10 * m23 * m31 - m11 * m20 * m33 + m10 * m21 * m33;
                m21 = m03 * m21 * m30 - m01 * m23 * m30 - m03 * m20 * m31 + m00 * m23 * m31 + m01 * m20 * m33 - m00 * m21 * m33;
                m22 = m01 * m13 * m30 - m03 * m11 * m30 + m03 * m10 * m31 - m00 * m13 * m31 - m01 * m10 * m33 + m00 * m11 * m33;
                m23 = m03 * m11 * m20 - m01 * m13 * m20 - m03 * m10 * m21 + m00 * m13 * m21 + m01 * m10 * m23 - m00 * m11 * m23;
                m30 = m12 * m21 * m30 - m11 * m22 * m30 - m12 * m20 * m31 + m10 * m22 * m31 + m11 * m20 * m32 - m10 * m21 * m32;
                m31 = m01 * m22 * m30 - m02 * m21 * m30 + m02 * m20 * m31 - m00 * m22 * m31 - m01 * m20 * m32 + m00 * m21 * m32;
                m32 = m02 * m11 * m30 - m01 * m12 * m30 - m02 * m10 * m31 + m00 * m12 * m31 + m01 * m10 * m32 - m00 * m11 * m32;
                m33 = m01 * m12 * m20 - m02 * m11 * m20 + m02 * m10 * m21 - m00 * m12 * m21 - m01 * m10 * m22 + m00 * m11 * m22;
                m00 /= det;
                m01 /= det;
                m02 /= det;
                m03 /= det;
                m10 /= det;
                m11 /= det;
                m12 /= det;
                m13 /= det;
                m20 /= det;
                m21 /= det;
                m22 /= det;
                m23 /= det;
                m30 /= det;
                m31 /= det;
                m32 /= det;
                m33 /= det;
                return new Matrix(new Float32Array([m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33]));
            };
            /**
             * Generate linear translation transform matrix.
             */
            Matrix.translate = function (v) {
                var m = new Matrix(new Float32Array([
                    1,
                    0,
                    0,
                    v.X,
                    0,
                    1,
                    0,
                    v.Y,
                    0,
                    0,
                    1,
                    v.Z,
                    0,
                    0,
                    0,
                    1
                ]));
                return m;
            };
            /**
             * Generate linear scaling transform matrix.
             */
            Matrix.scale = function (v) {
                return new Matrix(new Float32Array([
                    v.X,
                    0,
                    0,
                    0,
                    0,
                    v.Y,
                    0,
                    0,
                    0,
                    0,
                    v.Z,
                    0,
                    0,
                    0,
                    0,
                    1
                ]));
            };
            Matrix.prototype.toString = function () {
                return "|{0} {1} {2} {3}|\n|{4} {5} {6} {7}|\n|{8} {9} {10} {11}|\n|{12} {13} {14} {15}|".format(this.getBySingleIndex(0), this.getBySingleIndex(1), this.getBySingleIndex(2), this.getBySingleIndex(3), this.getBySingleIndex(4), this.getBySingleIndex(5), this.getBySingleIndex(6), this.getBySingleIndex(7), this.getBySingleIndex(8), this.getBySingleIndex(9), this.getBySingleIndex(10), this.getBySingleIndex(11), this.getBySingleIndex(12), this.getBySingleIndex(13), this.getBySingleIndex(14), this.getBySingleIndex(15));
            };
            Matrix.prototype.getEnumrator = function () {
                return new MatrixEnumerator(this);
            };
            Object.defineProperty(Matrix.prototype, "ElementCount", {
                get: function () {
                    return 16;
                },
                enumerable: true,
                configurable: true
            });
            Matrix.prototype.getFactory = function () {
                Matrix.factoryCache = Matrix.factoryCache || new MatrixFactory();
                return Matrix.factoryCache;
            };
            Object.defineProperty(Matrix.prototype, "RowCount", {
                get: function () {
                    return 4;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Matrix.prototype, "ColmunCount", {
                get: function () {
                    return 4;
                },
                enumerable: true,
                configurable: true
            });
            return Matrix;
        })(MatrixBase);
        _Matrix.Matrix = Matrix;
    })(Matrix = jThree.Matrix || (jThree.Matrix = {}));
})(jThree || (jThree = {}));
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
                this.length = 0;
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
            Object.defineProperty(BufferWrapper.prototype, "Length", {
                get: function () {
                    return this.length;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(BufferWrapper.prototype, "UnitCount", {
                get: function () {
                    return this.parentBuffer.UnitCount;
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
                this.length = length;
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
                this.normalized = false;
                this.stride = 0;
                this.offset = 0;
                this.bufWrappers = new Map();
                this.parentBuffer = this;
            }
            Buffer.CreateBuffer = function (glContexts, target, usage, unitCount, elementType) {
                var buf = new Buffer();
                buf.target = target;
                buf.usage = usage;
                buf.unitCount = unitCount;
                buf.elementType = elementType;
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
            Object.defineProperty(Buffer.prototype, "ElementType", {
                get: function () {
                    return this.elementType;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Buffer.prototype, "Normalized", {
                get: function () {
                    return this.normalized;
                },
                set: function (normalized) {
                    this.normalized = normalized;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Buffer.prototype, "Stride", {
                get: function () {
                    return this.stride;
                },
                set: function (stride) {
                    this.stride = stride;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Buffer.prototype, "Offse", {
                get: function () {
                    return this.offset;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Buffer.prototype, "Offset", {
                set: function (offset) {
                    this.offset = offset;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Buffer.prototype, "UnitCount", {
                get: function () {
                    return this.unitCount;
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
                this.programWrappers = new Map();
                this.attachedShaders = [];
            }
            Object.defineProperty(Program.prototype, "AttachedShaders", {
                get: function () {
                    return this.attachedShaders;
                },
                enumerable: true,
                configurable: true
            });
            Program.prototype.getForRenderer = function (renderer) {
                return this.programWrappers.get(renderer.ID);
            };
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
                this.attribLocations = new Map();
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
            ProgramWrapper.prototype.setAttributeVerticies = function (valName, buffer) {
                buffer.bindBuffer();
                if (!this.attribLocations.has(valName)) {
                    this.attribLocations.set(valName, this.glContext.GetAttribLocation(this.TargetProgram, valName));
                }
                var attribIndex = this.attribLocations.get(valName);
                this.glContext.EnableVertexAttribArray(attribNumber);
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
///<reference path="../_references.ts"/>
var jThree;
(function (jThree) {
    var Events;
    (function (Events) {
        var jThreeObject = jThree.Base.jThreeObject;
        /**
         * レンダラーの状況の変更内容を示す列挙体
         */
        (function (RendererStateChangedType) {
            RendererStateChangedType[RendererStateChangedType["Add"] = 0] = "Add";
            RendererStateChangedType[RendererStateChangedType["Delete"] = 1] = "Delete";
        })(Events.RendererStateChangedType || (Events.RendererStateChangedType = {}));
        var RendererStateChangedType = Events.RendererStateChangedType;
        /**
         * レンダラーの変更を通知するイベント
         */
        var RendererListChangedEventArgs = (function (_super) {
            __extends(RendererListChangedEventArgs, _super);
            function RendererListChangedEventArgs(changeType, affectedRenderer) {
                _super.call(this);
                this.changeType = changeType;
                this.affectedRenderer = affectedRenderer;
            }
            Object.defineProperty(RendererListChangedEventArgs.prototype, "ChangeType", {
                /**
                 * レンダラへの変更の種類
                 */
                get: function () {
                    return this.changeType;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(RendererListChangedEventArgs.prototype, "AffectedRenderer", {
                /**
                 * 影響を受けたレンダラ
                 */
                get: function () {
                    return this.affectedRenderer;
                },
                enumerable: true,
                configurable: true
            });
            return RendererListChangedEventArgs;
        })(jThreeObject);
        Events.RendererListChangedEventArgs = RendererListChangedEventArgs;
    })(Events = jThree.Events || (jThree.Events = {}));
})(jThree || (jThree = {}));
///<reference path="src/Delegates.ts"/> 
///<reference path="src/Collections.ts"/>
///<reference path="src/Base.ts"/>
///<reference path="src/Math.ts"/>
///<reference path="src/Vector.ts"/>
///<reference path="src/Exceptions.ts"/>
///<reference path="src/Matrix.ts"/>
///<reference path="Scripts/typings/jquery/jquery.d.ts"/>
///<reference path="src/Contexts.ts"/>
///<reference path="src/Buffer.ts"/>
///<reference path="src/Effects.ts"/>
///<reference path="src/Event.RendererState.ts"/> 
///<reference path="../_references.ts"/>
var jThree;
(function (jThree) {
    var jThreeObject = jThree.Base.jThreeObject;
    var Buffer = jThree.Buffers.Buffer;
    var Shader = jThree.Effects.Shader;
    var Program = jThree.Effects.Program;
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
        /**
         * Add renderers to be managed by jThree
         */
        JThreeContext.prototype.addRenderer = function (renderer) {
            if (this.canvasRenderers.indexOf(renderer) === -1) {
                this.canvasRenderers.push(renderer);
                this.notifyRendererChanged(new jThree.Events.RendererListChangedEventArgs(0 /* Add */, renderer));
            }
        };
        /**
         * Remove renderer
         */
        JThreeContext.prototype.removeRenderer = function (renderer) {
            if (this.canvasRenderers.indexOf(renderer) !== -1) {
                for (var i = 0; i < this.canvasRenderers.length; i++) {
                    if (this.canvasRenderers[i] === renderer) {
                        this.canvasRenderers = this.canvasRenderers.splice(i, 1);
                        break;
                    }
                }
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
    var World = (function (_super) {
        __extends(World, _super);
        function World() {
            _super.apply(this, arguments);
        }
        return World;
    })(jThreeObject);
    jThree.World = World;
    var WorldObject = (function (_super) {
        __extends(WorldObject, _super);
        function WorldObject() {
            _super.apply(this, arguments);
        }
        return WorldObject;
    })(jThreeObject);
    jThree.WorldObject = WorldObject;
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
