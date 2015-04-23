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
            ContextSafeResourceContainer.prototype.getForRenderer = function (contextManager) {
                return this.getForRendererID(contextManager.ID);
            };
            ContextSafeResourceContainer.prototype.getForRendererID = function (id) {
                if (!this.cachedObject.has(id))
                    console.log("There is no matching object with the ID:" + id);
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
                _super.call(this);
                this.id = jThreeID.getUniqueRandom(10);
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
        var Rectangle = (function (_super) {
            __extends(Rectangle, _super);
            function Rectangle(left, top, width, height) {
                _super.call(this);
                this.left = left;
                this.top = top;
                this.width = width;
                this.height = height;
            }
            Object.defineProperty(Rectangle.prototype, "Left", {
                get: function () {
                    return this.left;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Rectangle.prototype, "Right", {
                get: function () {
                    return this.left + this.width;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Rectangle.prototype, "Top", {
                get: function () {
                    return this.top;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Rectangle.prototype, "Bottom", {
                get: function () {
                    return this.top + this.height;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Rectangle.prototype, "Width", {
                get: function () {
                    return this.width;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Rectangle.prototype, "Height", {
                get: function () {
                    return this.height;
                },
                enumerable: true,
                configurable: true
            });
            return Rectangle;
        })(jThreeObject);
        Mathematics.Rectangle = Rectangle;
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
                VectorBase.normalizeElements = function (a, factory) {
                    var magnitude = a.magnitude;
                    var result = new Float32Array(a.ElementCount);
                    Collection.foreach(a, function (a, i) {
                        result[i] = a / magnitude;
                    });
                    return factory.fromArray(result);
                };
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
                Vector2.normalize = function (v1) {
                    return VectorBase.normalizeElements(v1, v1.getFactory());
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
                Vector2.prototype.normalizeThis = function () {
                    return Vector2.normalize(this);
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
                Vector3.normalize = function (v1) {
                    return VectorBase.normalizeElements(v1, v1.getFactory());
                };
                Vector3.cross = function (v1, v2) {
                    return new Vector3(v1.y * v2.z - v1.z * v2.y, v1.z * v2.x - v1.x * v2.z, v1.x * v2.y - v1.y * v2.x);
                };
                Vector3.prototype.normalizeThis = function () {
                    return Vector3.normalize(this);
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
                Vector3.prototype.crossWith = function (v) {
                    return Vector3.cross(this, v);
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
                Vector4.normalize = function (v1) {
                    return VectorBase.normalizeElements(v1, v1.getFactory());
                };
                Vector4.prototype.normalizeThis = function () {
                    return Vector4.normalize(this);
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
///<reference path="../../_references.ts"/>
var jThree;
(function (jThree) {
    var Mathematics;
    (function (Mathematics) {
        var Matricies;
        (function (Matricies) {
            var JThreeObject = jThree.Base.jThreeObject;
            var Collection = jThree.Collections.Collection;
            var MatrixFactory = (function () {
                function MatrixFactory() {
                }
                MatrixFactory.prototype.fromArray = function (array) {
                    return new Matrix(array);
                };
                MatrixFactory.prototype.fromFunc = function (f) {
                    return new Matrix(new Float32Array([f(0, 0), f(1, 0), f(2, 0), f(3, 0), f(0, 1), f(1, 1), f(2, 1), f(3, 1), f(0, 2), f(1, 2), f(2, 2), f(3, 2), f(0, 3), f(1, 3), f(2, 3), f(3, 3)]));
                };
                return MatrixFactory;
            })();
            Matricies.MatrixFactory = MatrixFactory;
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
            Matricies.MatrixBase = MatrixBase;
            var Matrix = (function (_super) {
                __extends(Matrix, _super);
                function Matrix(arr) {
                    _super.call(this);
                    this.elements = new Float32Array(16);
                    if (!this.isValidArray(arr))
                        throw new jThree.Exceptions.InvalidArgumentException("Invalid matrix source was passed.");
                    this.elements = arr;
                }
                Matrix.zero = function () {
                    return Matrix.fromElements(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
                };
                Matrix.identity = function () {
                    return Matrix.fromElements(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
                };
                Matrix.fromElements = function (m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
                    return new Matrix(new Float32Array([m00, m10, m20, m30, m01, m11, m21, m31, m02, m12, m22, m32, m03, m13, m23, m33]));
                };
                Object.defineProperty(Matrix.prototype, "rawElements", {
                    get: function () {
                        return this.elements;
                    },
                    enumerable: true,
                    configurable: true
                });
                Matrix.prototype.isValidArray = function (arr) {
                    if (arr.length !== 16)
                        return false;
                    return true;
                };
                Matrix.prototype.getAt = function (row, colmun) {
                    return this.elements[colmun * 4 + row];
                };
                Matrix.prototype.setAt = function (colmun, row, val) {
                    this.elements.set[colmun * 4 + row] = val;
                };
                Matrix.prototype.getBySingleIndex = function (index) {
                    return this.elements[index];
                };
                Matrix.prototype.getColmun = function (col) {
                    return new jThree.Mathematics.Vector.Vector4(this.elements[col * 4], this.elements[col * 4 + 1], this.elements[col * 4 + 2], this.elements[col * 4 + 3]);
                };
                Matrix.prototype.getRow = function (row) {
                    return new jThree.Mathematics.Vector.Vector4(this.elements[row], this.elements[row + 4], this.elements[row + 8], this.elements[row + 12]);
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
                    return Matrix.elementEqual(m1, m2);
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
                    return Matrix.fromElements(m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33);
                };
                /**
                 * Generate linear translation transform matrix.
                 */
                Matrix.translate = function (v) {
                    var m = Matrix.fromElements(1, 0, 0, v.X, 0, 1, 0, v.Y, 0, 0, 1, v.Z, 0, 0, 0, 1);
                    return m;
                };
                /**
                 * Generate linear scaling transform matrix.
                 */
                Matrix.scale = function (v) {
                    return Matrix.fromElements(v.X, 0, 0, 0, 0, v.Y, 0, 0, 0, 0, v.Z, 0, 0, 0, 0, 1);
                };
                Matrix.frustum = function (left, right, bottom, top, near, far) {
                    var te = new Float32Array(16);
                    var x = 2 * near / (right - left);
                    var y = 2 * near / (top - bottom);
                    var a = (right + left) / (right - left);
                    var b = (top + bottom) / (top - bottom);
                    var c = -(far + near) / (far - near);
                    var d = -2 * far * near / (far - near);
                    te[0] = x;
                    te[4] = 0;
                    te[8] = a;
                    te[12] = 0;
                    te[1] = 0;
                    te[5] = y;
                    te[9] = b;
                    te[13] = 0;
                    te[2] = 0;
                    te[6] = 0;
                    te[10] = c;
                    te[14] = d;
                    te[3] = 0;
                    te[7] = 0;
                    te[11] = -1;
                    te[15] = 0;
                    return new Matrix(te);
                };
                Matrix.perspective = function (fovy, aspect, near, far) {
                    var ymax = near * Math.tan(fovy * 0.5);
                    var ymin = -ymax;
                    var xmin = ymin * aspect;
                    var xmax = ymax * aspect;
                    return this.frustum(xmin, xmax, ymin, ymax, near, far);
                };
                Matrix.lookAt = function (eye, target, up) {
                    var zAxis = eye.subtractWith(target).normalizeThis();
                    var xAxis = up.crossWith(zAxis).normalizeThis();
                    var yAxis = zAxis.crossWith(xAxis);
                    return new Matrix(new Float32Array([xAxis.X, yAxis.X, zAxis.X, 0, xAxis.Y, yAxis.Y, zAxis.Y, 0, xAxis.Z, yAxis.Z, zAxis.Z, 0, -xAxis.dotWith(eye), -yAxis.dotWith(eye), -zAxis.dotWith(eye), 1]));
                };
                Matrix.prototype.multiplyWith = function (m) {
                    return Matrix.multiply(this, m);
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
            Matricies.Matrix = Matrix;
        })(Matricies = Mathematics.Matricies || (Mathematics.Matricies = {}));
    })(Mathematics = jThree.Mathematics || (jThree.Mathematics = {}));
})(jThree || (jThree = {}));
/**
 * jThree most basic module
 */
var jThree;
(function (jThree) {
    var JThreeObject = jThree.Base.jThreeObject;
    /**
     * Base class for wrapping WebGLRenderingContext
     */
    var GLContextWrapperBase = (function (_super) {
        __extends(GLContextWrapperBase, _super);
        function GLContextWrapperBase() {
            _super.apply(this, arguments);
        }
        /**
         * Check gl error, and abort if error has been occured.
         */
        GLContextWrapperBase.prototype.CheckErrorAsFatal = function () {
            throw new jThree.Exceptions.AbstractClassMethodCalledException();
        };
        /**
         * Create WebGLBuffer
         * @returns {The new buffer reference that has been created.}
         */
        GLContextWrapperBase.prototype.CreateBuffer = function () {
            throw new jThree.Exceptions.AbstractClassMethodCalledException();
        };
        /**
         * Bind the WebGLBuffer
         * @param target target buffer you want to bind
         * @param buffer the buffer you want to bind
         */
        GLContextWrapperBase.prototype.BindBuffer = function (target, buffer) {
            throw new jThree.Exceptions.AbstractClassMethodCalledException();
        };
        /**
         * Store data to buffer
         * @param target target type you want to store data
         * @param array data source array
         * @param usage type how to use data source
         */
        GLContextWrapperBase.prototype.BufferData = function (target, array, usage) {
            throw new jThree.Exceptions.AbstractClassMethodCalledException();
        };
        /**
         * Unbind buffer
         * @param target the buffer type you want to unbind
         */
        GLContextWrapperBase.prototype.UnbindBuffer = function (target) {
            throw new jThree.Exceptions.AbstractClassMethodCalledException();
        };
        /**
         * Set the clear color it will be used when you call Clear()
         * @param red red color value [0,1]
         * @param green green color value [0,1]
         * @param blue blue color value [0,1]
         * @param alpha alpha color value [0,1]
         */
        GLContextWrapperBase.prototype.ClearColor = function (red, green, blue, alpha) {
            throw new jThree.Exceptions.AbstractClassMethodCalledException();
        };
        /**
         * Clear buffers
         * @param mask type of buffer you want to clear
         */
        GLContextWrapperBase.prototype.Clear = function (mask) {
            throw new jThree.Exceptions.AbstractClassMethodCalledException();
        };
        /**
         * Create new Shader
         * @param flag the shader type you want to create
         * @returns {new shader}
         */
        GLContextWrapperBase.prototype.CreateShader = function (flag) {
            throw new jThree.Exceptions.AbstractClassMethodCalledException();
        };
        /**
         * Delete passed shader
         * @param shader the shader you want to delete
         */
        GLContextWrapperBase.prototype.DeleteShader = function (shader) {
            throw new jThree.Exceptions.AbstractClassMethodCalledException();
        };
        /**
         * Store shader source
         * @param shader reference you want to be stored
         * @param src shader source code
         */
        GLContextWrapperBase.prototype.ShaderSource = function (shader, src) {
            throw new jThree.Exceptions.AbstractClassMethodCalledException();
        };
        /**
         * Compile shader source
         * @param shader shader reference you want to be compiled
         */
        GLContextWrapperBase.prototype.CompileShader = function (shader) {
            throw new jThree.Exceptions.AbstractClassMethodCalledException();
        };
        /**
         * Create new program
         * @returns {created program}
         */
        GLContextWrapperBase.prototype.CreateProgram = function () {
            throw new jThree.Exceptions.AbstractClassMethodCalledException();
        };
        /**
         * Attach shader to program
         * @param program the program you want to be attached
         * @param shader the shader you want to attach
         */
        GLContextWrapperBase.prototype.AttachShader = function (program, shader) {
            throw new jThree.Exceptions.AbstractClassMethodCalledException();
        };
        /**
         * Link program
         * @param program the program you want to link
         */
        GLContextWrapperBase.prototype.LinkProgram = function (program) {
            throw new jThree.Exceptions.AbstractClassMethodCalledException();
        };
        /**
         * Use program
         * @param program the program you want to use
         */
        GLContextWrapperBase.prototype.UseProgram = function (program) {
            throw new jThree.Exceptions.AbstractClassMethodCalledException();
        };
        /**
         * Get attribute variable location from program
         * @param program the program you want to locate attribute variable
         * @param name attribute variable name
         * @returns {attribute variable location}
         */
        GLContextWrapperBase.prototype.GetAttribLocation = function (program, name) {
            throw new jThree.Exceptions.AbstractClassMethodCalledException();
        };
        /**
         * Enable vartex attribute array
         * @param attribNumber the attribute variable location you want to enable vertex attribute array
         */
        GLContextWrapperBase.prototype.EnableVertexAttribArray = function (attribNumber) {
            throw new jThree.Exceptions.AbstractClassMethodCalledException();
        };
        /**
         * Pass buffer to attribute variable.
         * @param attribLocation attribute variable location
         * @param sizePerVertex element count per vertex
         * @param elemType the variable type you will pass
         * @param normalized is this normalized or not(ALWAYS should be false)
         * @param stride stride in buffer array
         * @param offset offset of buffer array
         */
        GLContextWrapperBase.prototype.VertexAttribPointer = function (attribLocation, sizePerVertex, elemType, normalized, stride, offset) {
            throw new jThree.Exceptions.AbstractClassMethodCalledException();
        };
        /**
         * Draw without index
         * @param drawType primitive topology type
         * @param offset vertex array offset
         * @param length count of the vertex you want to draw.
         */
        GLContextWrapperBase.prototype.DrawArrays = function (drawType, offset, length) {
            throw new jThree.Exceptions.AbstractClassMethodCalledException();
        };
        /**
         * Flush drawing
         */
        GLContextWrapperBase.prototype.Flush = function () {
            throw new jThree.Exceptions.AbstractClassMethodCalledException();
        };
        /**
         * Finish drawing
         */
        GLContextWrapperBase.prototype.Finish = function () {
            throw new jThree.Exceptions.AbstractClassMethodCalledException();
        };
        /**
         * Delete buffer
         * @param target the buffer you want to delete
         */
        GLContextWrapperBase.prototype.DeleteBuffer = function (target) {
            throw new jThree.Exceptions.AbstractClassMethodCalledException();
        };
        /**
         * Delete program
         * @param target the program you want to delete.
         */
        GLContextWrapperBase.prototype.DeleteProgram = function (target) {
            throw new jThree.Exceptions.AbstractClassMethodCalledException();
        };
        /**
         * Get uniform variable location
         * @param target the program you want to locate uniform variable
         * @param name the name of uniform variable
         */
        GLContextWrapperBase.prototype.GetUniformLocation = function (target, name) {
            throw new jThree.Exceptions.AbstractClassMethodCalledException();
        };
        /**
         * Pass matrix as uniform variable
         * @param webGlUniformLocation uniform variable location
         * @param matrix matrix you want to pass
         */
        GLContextWrapperBase.prototype.UniformMatrix = function (webGlUniformLocation, matrix) {
            throw new jThree.Exceptions.AbstractClassMethodCalledException();
        };
        /**
         * Set viewport configure
         * @param x X of left-bottom screen coordinate
         * @param y Y of left-bottom screen coordinate
         * @param width width of viewport
         * @param height height of viewport
         */
        GLContextWrapperBase.prototype.ViewPort = function (x, y, width, height) {
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
        WebGLWrapper.prototype.GetUniformLocation = function (target, name) {
            this.CheckErrorAsFatal();
            return this.gl.getUniformLocation(target, name);
        };
        WebGLWrapper.prototype.UniformMatrix = function (webGlUniformLocation, matrix) {
            this.CheckErrorAsFatal();
            this.gl.uniformMatrix4fv(webGlUniformLocation, false, matrix.rawElements);
        };
        WebGLWrapper.prototype.ViewPort = function (x, y, width, height) {
            this.CheckErrorAsFatal();
            this.gl.viewport(x, y, width, height);
        };
        return WebGLWrapper;
    })(GLContextWrapperBase);
    jThree.WebGLWrapper = WebGLWrapper;
    (function (BufferTargetType) {
        BufferTargetType[BufferTargetType["ArrayBuffer"] = 34962] = "ArrayBuffer";
        BufferTargetType[BufferTargetType["ElementArrayBuffer"] = 34963] = "ElementArrayBuffer"; //ELEMENT_ARRAY_BUFFER
    })(jThree.BufferTargetType || (jThree.BufferTargetType = {}));
    var BufferTargetType = jThree.BufferTargetType;
    (function (ClearTargetType) {
        ClearTargetType[ClearTargetType["ColorBits"] = 16384] = "ColorBits";
        ClearTargetType[ClearTargetType["DepthBits"] = 256] = "DepthBits";
        ClearTargetType[ClearTargetType["StencilBits"] = 1024] = "StencilBits"; //STENCIL_BUFFER_BIT
    })(jThree.ClearTargetType || (jThree.ClearTargetType = {}));
    var ClearTargetType = jThree.ClearTargetType;
    (function (ShaderType) {
        ShaderType[ShaderType["VertexShader"] = 35633] = "VertexShader";
        ShaderType[ShaderType["FragmentShader"] = 35632] = "FragmentShader"; //FRAGMENT_SHADER
    })(jThree.ShaderType || (jThree.ShaderType = {}));
    var ShaderType = jThree.ShaderType;
    (function (BufferUsageType) {
        BufferUsageType[BufferUsageType["StaticDraw"] = 35044] = "StaticDraw";
        BufferUsageType[BufferUsageType["StreamDraw"] = 35040] = "StreamDraw";
        BufferUsageType[BufferUsageType["DynamicDraw"] = 35048] = "DynamicDraw"; //WebGLRenderingContext.DYNAMIC_DRAW
    })(jThree.BufferUsageType || (jThree.BufferUsageType = {}));
    var BufferUsageType = jThree.BufferUsageType;
    (function (ElementType) {
        ElementType[ElementType["Float"] = 5126] = "Float";
        ElementType[ElementType["UnsignedByte"] = 5121] = "UnsignedByte";
        ElementType[ElementType["Short"] = 5122] = "Short";
        ElementType[ElementType["UnsignedShort"] = 5123] = "UnsignedShort";
        ElementType[ElementType["UnsignedInt"] = 5125] = "UnsignedInt";
        ElementType[ElementType["Int"] = 5124] = "Int"; //WebGLRenderingContext.INT
    })(jThree.ElementType || (jThree.ElementType = {}));
    var ElementType = jThree.ElementType;
    (function (DrawType) {
        DrawType[DrawType["Triangles"] = 4] = "Triangles";
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
                    this.loadAll();
                    this.glContext.BindBuffer(this.parentBuffer.Target, this.targetBuffer);
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
            function ProgramWrapper(parent, contextManager) {
                _super.call(this);
                this.id = "";
                this.initialized = false;
                this.isLinked = false;
                this.targetProgram = null;
                this.glContext = null;
                this.parentProgram = null;
                this.attributeLocations = new Map();
                this.uniformLocations = new Map();
                this.id = contextManager.ID;
                this.glContext = contextManager.Context;
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
                    console.log("useProgram was called, but program was not initialized.");
                    this.init();
                }
                if (!this.isLinked) {
                    console.log("useProgram was called, but program was not linked.");
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
var jThree;
(function (jThree) {
    var Color;
    (function (Color) {
        var Color4 = (function (_super) {
            __extends(Color4, _super);
            function Color4(r, g, b, a) {
                _super.call(this);
                this.ColorKeywords = {
                    'aliceblue': 0xF0F8FF,
                    'antiquewhite': 0xFAEBD7,
                    'aqua': 0x00FFFF,
                    'aquamarine': 0x7FFFD4,
                    'azure': 0xF0FFFF,
                    'beige': 0xF5F5DC,
                    'bisque': 0xFFE4C4,
                    'black': 0x000000,
                    'blanchedalmond': 0xFFEBCD,
                    'blue': 0x0000FF,
                    'blueviolet': 0x8A2BE2,
                    'brown': 0xA52A2A,
                    'burlywood': 0xDEB887,
                    'cadetblue': 0x5F9EA0,
                    'chartreuse': 0x7FFF00,
                    'chocolate': 0xD2691E,
                    'coral': 0xFF7F50,
                    'cornflowerblue': 0x6495ED,
                    'cornsilk': 0xFFF8DC,
                    'crimson': 0xDC143C,
                    'cyan': 0x00FFFF,
                    'darkblue': 0x00008B,
                    'darkcyan': 0x008B8B,
                    'darkgoldenrod': 0xB8860B,
                    'darkgray': 0xA9A9A9,
                    'darkgreen': 0x006400,
                    'darkgrey': 0xA9A9A9,
                    'darkkhaki': 0xBDB76B,
                    'darkmagenta': 0x8B008B,
                    'darkolivegreen': 0x556B2F,
                    'darkorange': 0xFF8C00,
                    'darkorchid': 0x9932CC,
                    'darkred': 0x8B0000,
                    'darksalmon': 0xE9967A,
                    'darkseagreen': 0x8FBC8F,
                    'darkslateblue': 0x483D8B,
                    'darkslategray': 0x2F4F4F,
                    'darkslategrey': 0x2F4F4F,
                    'darkturquoise': 0x00CED1,
                    'darkviolet': 0x9400D3,
                    'deeppink': 0xFF1493,
                    'deepskyblue': 0x00BFFF,
                    'dimgray': 0x696969,
                    'dimgrey': 0x696969,
                    'dodgerblue': 0x1E90FF,
                    'firebrick': 0xB22222,
                    'floralwhite': 0xFFFAF0,
                    'forestgreen': 0x228B22,
                    'fuchsia': 0xFF00FF,
                    'gainsboro': 0xDCDCDC,
                    'ghostwhite': 0xF8F8FF,
                    'gold': 0xFFD700,
                    'goldenrod': 0xDAA520,
                    'gray': 0x808080,
                    'green': 0x008000,
                    'greenyellow': 0xADFF2F,
                    'grey': 0x808080,
                    'honeydew': 0xF0FFF0,
                    'hotpink': 0xFF69B4,
                    'indianred': 0xCD5C5C,
                    'indigo': 0x4B0082,
                    'ivory': 0xFFFFF0,
                    'khaki': 0xF0E68C,
                    'lavender': 0xE6E6FA,
                    'lavenderblush': 0xFFF0F5,
                    'lawngreen': 0x7CFC00,
                    'lemonchiffon': 0xFFFACD,
                    'lightblue': 0xADD8E6,
                    'lightcoral': 0xF08080,
                    'lightcyan': 0xE0FFFF,
                    'lightgoldenrodyellow': 0xFAFAD2,
                    'lightgray': 0xD3D3D3,
                    'lightgreen': 0x90EE90,
                    'lightgrey': 0xD3D3D3,
                    'lightpink': 0xFFB6C1,
                    'lightsalmon': 0xFFA07A,
                    'lightseagreen': 0x20B2AA,
                    'lightskyblue': 0x87CEFA,
                    'lightslategray': 0x778899,
                    'lightslategrey': 0x778899,
                    'lightsteelblue': 0xB0C4DE,
                    'lightyellow': 0xFFFFE0,
                    'lime': 0x00FF00,
                    'limegreen': 0x32CD32,
                    'linen': 0xFAF0E6,
                    'magenta': 0xFF00FF,
                    'maroon': 0x800000,
                    'mediumaquamarine': 0x66CDAA,
                    'mediumblue': 0x0000CD,
                    'mediumorchid': 0xBA55D3,
                    'mediumpurple': 0x9370DB,
                    'mediumseagreen': 0x3CB371,
                    'mediumslateblue': 0x7B68EE,
                    'mediumspringgreen': 0x00FA9A,
                    'mediumturquoise': 0x48D1CC,
                    'mediumvioletred': 0xC71585,
                    'midnightblue': 0x191970,
                    'mintcream': 0xF5FFFA,
                    'mistyrose': 0xFFE4E1,
                    'moccasin': 0xFFE4B5,
                    'navajowhite': 0xFFDEAD,
                    'navy': 0x000080,
                    'oldlace': 0xFDF5E6,
                    'olive': 0x808000,
                    'olivedrab': 0x6B8E23,
                    'orange': 0xFFA500,
                    'orangered': 0xFF4500,
                    'orchid': 0xDA70D6,
                    'palegoldenrod': 0xEEE8AA,
                    'palegreen': 0x98FB98,
                    'paleturquoise': 0xAFEEEE,
                    'palevioletred': 0xDB7093,
                    'papayawhip': 0xFFEFD5,
                    'peachpuff': 0xFFDAB9,
                    'peru': 0xCD853F,
                    'pink': 0xFFC0CB,
                    'plum': 0xDDA0DD,
                    'powderblue': 0xB0E0E6,
                    'purple': 0x800080,
                    'red': 0xFF0000,
                    'rosybrown': 0xBC8F8F,
                    'royalblue': 0x4169E1,
                    'saddlebrown': 0x8B4513,
                    'salmon': 0xFA8072,
                    'sandybrown': 0xF4A460,
                    'seagreen': 0x2E8B57,
                    'seashell': 0xFFF5EE,
                    'sienna': 0xA0522D,
                    'silver': 0xC0C0C0,
                    'skyblue': 0x87CEEB,
                    'slateblue': 0x6A5ACD,
                    'slategray': 0x708090,
                    'slategrey': 0x708090,
                    'snow': 0xFFFAFA,
                    'springgreen': 0x00FF7F,
                    'steelblue': 0x4682B4,
                    'tan': 0xD2B48C,
                    'teal': 0x008080,
                    'thistle': 0xD8BFD8,
                    'tomato': 0xFF6347,
                    'turquoise': 0x40E0D0,
                    'violet': 0xEE82EE,
                    'wheat': 0xF5DEB3,
                    'white': 0xFFFFFF,
                    'whitesmoke': 0xF5F5F5,
                    'yellow': 0xFFFF00,
                    'yellowgreen': 0x9ACD32
                };
                this.a = a;
                this.r = r;
                this.g = g;
                this.b = b;
            }
            Object.defineProperty(Color4.prototype, "ElementCount", {
                get: function () {
                    return 4;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Color4.prototype, "A", {
                get: function () {
                    return this.a;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Color4.prototype, "R", {
                get: function () {
                    return this.r;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Color4.prototype, "G", {
                get: function () {
                    return this.g;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Color4.prototype, "B", {
                get: function () {
                    return this.b;
                },
                enumerable: true,
                configurable: true
            });
            return Color4;
        })(jThree.Mathematics.Vector.VectorBase);
        Color.Color4 = Color4;
    })(Color = jThree.Color || (jThree.Color = {}));
})(jThree || (jThree = {}));
var jThree;
(function (jThree) {
    var JThreeObject = jThree.Base.jThreeObject;
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
    })(JThreeObject);
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
    jThree.ContextTimer = ContextTimer;
})(jThree || (jThree = {}));
///<reference path="src/Delegates.ts"/> 
///<reference path="src/Collections.ts"/>
///<reference path="src/Base.ts"/>
///<reference path="src/mathmatics/Math.ts"/>
///<reference path="src/mathmatics/Vector.ts"/>
///<reference path="src/Exceptions.ts"/>
///<reference path="src/mathmatics/Matrix.ts"/>
///<reference path="Scripts/typings/jquery/jquery.d.ts"/>
///<reference path="src/Contexts.ts"/>
///<reference path="src/Buffer.ts"/>
///<reference path="src/Effects.ts"/>
///<reference path="src/Event.RendererState.ts"/>
///<reference path="src/Color.ts"/>
///<reference path="src/Timer.ts"/> 
///<reference path="../_references.ts"/>
var jThree;
(function (jThree) {
    var jThreeObject = jThree.Base.jThreeObject;
    var Buffer = jThree.Buffers.Buffer;
    var Shader = jThree.Effects.Shader;
    var Program = jThree.Effects.Program;
    var Color4 = jThree.Color.Color4;
    var JThreeObjectWithId = jThree.Base.jThreeObjectWithID;
    var Rectangle = jThree.Mathematics.Rectangle;
    var Matrix = jThree.Mathematics.Matricies.Matrix;
    var RendererMatriciesManager = (function (_super) {
        __extends(RendererMatriciesManager, _super);
        function RendererMatriciesManager() {
            _super.apply(this, arguments);
        }
        return RendererMatriciesManager;
    })(jThreeObject);
    jThree.RendererMatriciesManager = RendererMatriciesManager;
    /**
     * コンテキストを跨いでリソースを管理するクラスをまとめているクラス
     */
    var ResourceManager = (function (_super) {
        __extends(ResourceManager, _super);
        function ResourceManager() {
            _super.call(this);
            this.buffers = new Map();
            this.shaders = new Map();
            this.programs = new Map();
        }
        Object.defineProperty(ResourceManager.prototype, "context", {
            get: function () {
                return JThreeContext.Instance;
            },
            enumerable: true,
            configurable: true
        });
        ResourceManager.prototype.createBuffer = function (id, target, usage, unitCount, elementType) {
            if (this.buffers.has(id)) {
                throw new Error("Buffer id cant be dupelicated");
            }
            var buf = Buffer.CreateBuffer(this.context.CanvasRenderers, target, usage, unitCount, elementType);
            this.buffers.set(id, buf);
            return buf;
        };
        ResourceManager.prototype.getBuffer = function (id) {
            return this.buffers.get(id);
        };
        ResourceManager.prototype.createShader = function (id, source, shaderType) {
            var shader = Shader.CreateShader(this.context, source, shaderType);
            this.shaders.set(id, shader);
            return shader;
        };
        ResourceManager.prototype.getShader = function (id) {
            return this.shaders.get(id);
        };
        ResourceManager.prototype.createProgram = function (id, shaders) {
            var program = Program.CreateProgram(this.context, shaders);
            this.programs.set(id, program);
            return program;
        };
        ResourceManager.prototype.getProgram = function (id) {
            return this.programs.get(id);
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
            this.resourceManager = new ResourceManager();
            this.timer = new jThree.ContextTimer();
            this.sceneManager = new SceneManager();
            this.gomlLoader = new GomlLoader();
        }
        Object.defineProperty(JThreeContext.prototype, "SceneManager", {
            get: function () {
                return this.sceneManager;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(JThreeContext.prototype, "GomlLoader", {
            get: function () {
                return this.gomlLoader;
            },
            enumerable: true,
            configurable: true
        });
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
        /**
         * Begin render loop
         * @returns {}
         */
        JThreeContext.prototype.init = function () {
            this.loop();
        };
        JThreeContext.prototype.loop = function () {
            JThreeContext.Instance.timer.updateTimer();
            JThreeContext.Instance.sceneManager.renderAll();
            window.setTimeout(JThreeContext.instance.loop, 1000 / 30);
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
                        this.canvasRenderers.splice(i, 1);
                        break;
                    }
                }
                this.notifyRendererChanged(new jThree.Events.RendererListChangedEventArgs(1 /* Delete */, renderer));
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
        function RendererBase(contextManager) {
            _super.call(this);
            this.contextManager = contextManager;
        }
        Object.defineProperty(RendererBase.prototype, "ID", {
            get: function () {
                return this.id;
            },
            enumerable: true,
            configurable: true
        });
        RendererBase.prototype.render = function (drawAct) {
            throw new jThree.Exceptions.AbstractClassMethodCalledException();
        };
        Object.defineProperty(RendererBase.prototype, "ContextManager", {
            get: function () {
                return this.contextManager;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RendererBase.prototype, "Context", {
            get: function () {
                return this.contextManager.Context;
            },
            enumerable: true,
            configurable: true
        });
        return RendererBase;
    })(jThreeObject);
    jThree.RendererBase = RendererBase;
    var ContextManagerBase = (function (_super) {
        __extends(ContextManagerBase, _super);
        function ContextManagerBase() {
            _super.call(this);
        }
        Object.defineProperty(ContextManagerBase.prototype, "Context", {
            get: function () {
                return this.context;
            },
            enumerable: true,
            configurable: true
        });
        return ContextManagerBase;
    })(JThreeObjectWithId);
    jThree.ContextManagerBase = ContextManagerBase;
    var ViewPortRenderer = (function (_super) {
        __extends(ViewPortRenderer, _super);
        function ViewPortRenderer(contextManager, viewportArea) {
            _super.call(this, contextManager);
            this.viewportArea = viewportArea;
            this.backgroundColor = new Color4(0, 0.5, 1, 1);
        }
        ViewPortRenderer.prototype.applyConfigure = function () {
            this.contextManager.Context.ClearColor(this.backgroundColor.R, this.backgroundColor.G, this.backgroundColor.B, this.backgroundColor.A);
            this.contextManager.Context.ViewPort(this.viewportArea.Left, this.viewportArea.Top, this.viewportArea.Width, this.viewportArea.Height);
        };
        ViewPortRenderer.prototype.render = function (drawAct) {
            this.applyConfigure();
            this.contextManager.Context.Clear(16384 /* ColorBits */);
            drawAct();
            this.contextManager.Context.Finish();
        };
        return ViewPortRenderer;
    })(RendererBase);
    jThree.ViewPortRenderer = ViewPortRenderer;
    var CanvasManager = (function (_super) {
        __extends(CanvasManager, _super);
        function CanvasManager(glContext) {
            _super.call(this);
            // this.enabled = true;
            this.glContext = glContext;
            this.context = new jThree.WebGLWrapper(this.glContext);
        }
        CanvasManager.fromCanvas = function (canvas) {
            var gl;
            try {
                gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
                var renderer = new CanvasManager(gl);
                JThreeContext.Instance.addRenderer(renderer);
                return renderer;
            }
            catch (e) {
                if (!gl) {
                }
            }
        };
        CanvasManager.prototype.getDefaultViewport = function () {
            return new ViewPortRenderer(this, new Rectangle(20, 20, 280, 280));
        };
        return CanvasManager;
    })(ContextManagerBase);
    jThree.CanvasManager = CanvasManager;
    var SceneManager = (function (_super) {
        __extends(SceneManager, _super);
        function SceneManager() {
            _super.call(this);
            this.scenes = new Map();
        }
        SceneManager.prototype.addScene = function (scene) {
            if (!this.scenes.has(scene.ID)) {
                this.scenes.set(scene.ID, scene);
            }
        };
        SceneManager.prototype.removeScene = function (scene) {
            if (this.scenes.has(scene.ID)) {
                this.scenes.delete(scene.ID);
            }
        };
        SceneManager.prototype.renderAll = function () {
            this.scenes.forEach(function (v) {
                v.update();
                v.render();
            });
        };
        return SceneManager;
    })(jThreeObject);
    jThree.SceneManager = SceneManager;
    var Scene = (function (_super) {
        __extends(Scene, _super);
        function Scene() {
            _super.call(this);
            this.renderers = [];
            this.renderObjects = [];
            this.id = jThree.Base.jThreeID.getUniqueRandom(10);
            this.enabled = true;
        }
        Object.defineProperty(Scene.prototype, "ID", {
            get: function () {
                return this.id;
            },
            enumerable: true,
            configurable: true
        });
        Scene.prototype.update = function () {
            if (!this.enabled)
                return; //enabled==falseならいらない。
            time++;
        };
        Scene.prototype.render = function () {
            var _this = this;
            this.renderers.forEach(function (r) {
                r.render(function () {
                    _this.renderObjects.forEach(function (v) { return v.TargetObject.render(r, v.Material); });
                });
            });
        };
        Scene.prototype.addRenderer = function (renderer) {
            this.renderers.push(renderer);
        };
        Scene.prototype.addObject = function (targetObject) {
            var _this = this;
            //TargetObjectに所属するマテリアルを分割して配列に登録します。
            targetObject.eachMaterial(function (m) {
                _this.renderObjects.push(new MaterialObjectPair(m, targetObject));
            });
            this.sortObjects();
        };
        Scene.prototype.sortObjects = function () {
            this.renderObjects.sort(function (v1, v2) {
                return v1.Material.Priorty - v2.Material.Priorty;
            });
        };
        return Scene;
    })(jThreeObject);
    jThree.Scene = Scene;
    var MaterialObjectPair = (function () {
        function MaterialObjectPair(material, targetObject) {
            this.material = material;
            this.targetObject = targetObject;
        }
        Object.defineProperty(MaterialObjectPair.prototype, "Material", {
            get: function () {
                return this.material;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MaterialObjectPair.prototype, "TargetObject", {
            get: function () {
                return this.targetObject;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MaterialObjectPair.prototype, "ID", {
            get: function () {
                return this.material.ID + "-" + this.targetObject.ID;
            },
            enumerable: true,
            configurable: true
        });
        return MaterialObjectPair;
    })();
    var Material = (function (_super) {
        __extends(Material, _super);
        function Material() {
            _super.call(this);
        }
        Object.defineProperty(Material.prototype, "Priorty", {
            get: function () {
                return this.priorty;
            },
            enumerable: true,
            configurable: true
        });
        Material.prototype.configureMaterial = function (renderer, geometry) {
            return;
        };
        return Material;
    })(JThreeObjectWithId);
    jThree.Material = Material;
    var BasicMaterial = (function (_super) {
        __extends(BasicMaterial, _super);
        function BasicMaterial() {
            _super.call(this);
            this.initial = false;
            var jThreeContext = JThreeContext.Instance;
            var vs = document.getElementById("vs");
            var fs = document.getElementById("fs");
            var vsShader = jThreeContext.ResourceManager.createShader("test-vs", vs.textContent, 35633 /* VertexShader */);
            var fsShader = jThreeContext.ResourceManager.createShader("test-fs", fs.textContent, 35632 /* FragmentShader */);
            vsShader.loadAll();
            fsShader.loadAll();
            this.program = jThreeContext.ResourceManager.createProgram("test-progran", [vsShader, fsShader]);
        }
        BasicMaterial.prototype.configureMaterial = function (renderer, geometry) {
            var programWrapper = this.program.getForRenderer(renderer.ContextManager);
            programWrapper.useProgram();
            var vpMat; //=Matricies.Matricies.lookAt(new Vector3(0, 0, -1), new Vector3(0, 0, 0), new Vector3(0, 1, 0));
            vpMat = Matrix.identity(); //Matricies.Matricies.perspective(Math.PI / 2, 1, 0.1, 10);
            // vpMat = Matricies.Matricies.identity();
            if (!this.initial) {
                console.log(vpMat.toString());
                this.initial = true;
            }
            programWrapper.setAttributeVerticies("position", geometry.PositionBuffer.getForRenderer(renderer.ContextManager));
            programWrapper.setAttributeVerticies("normal", geometry.NormalBuffer.getForRenderer(renderer.ContextManager));
            programWrapper.setUniformMatrix("matMVP", vpMat);
            renderer.Context.DrawArrays(4 /* Triangles */, 0, 3);
        };
        return BasicMaterial;
    })(Material);
    jThree.BasicMaterial = BasicMaterial;
    var Geometry = (function (_super) {
        __extends(Geometry, _super);
        function Geometry() {
            _super.apply(this, arguments);
        }
        Object.defineProperty(Geometry.prototype, "PositionBuffer", {
            get: function () {
                return this.positionBuffer;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Geometry.prototype, "NormalBuffer", {
            get: function () {
                return this.normalBuffer;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Geometry.prototype, "UVBuffer", {
            get: function () {
                return this.uvBuffer;
            },
            enumerable: true,
            configurable: true
        });
        return Geometry;
    })(jThreeObject);
    jThree.Geometry = Geometry;
    var TriangleGeometry = (function (_super) {
        __extends(TriangleGeometry, _super);
        function TriangleGeometry() {
            _super.call(this);
            this.positionBuffer = JThreeContext.Instance.ResourceManager.createBuffer("triangle-geometry", 34962 /* ArrayBuffer */, 35044 /* StaticDraw */, 3, 5126 /* Float */);
            this.positionBuffer.update(new Float32Array([0.0, 1, 0.2, 1.0, 0.0, 0.2, -1.0, 0.0, 0.2]), 9);
            this.normalBuffer = JThreeContext.Instance.ResourceManager.createBuffer("triangle-normals", 34962 /* ArrayBuffer */, 35044 /* StaticDraw */, 3, 5126 /* Float */);
            this.normalBuffer.update(new Float32Array([0, 1, -1, 1, 0, -1, -1, 0, -1]), 9);
        }
        return TriangleGeometry;
    })(Geometry);
    jThree.TriangleGeometry = TriangleGeometry;
    var SceneObject = (function (_super) {
        __extends(SceneObject, _super);
        function SceneObject() {
            _super.apply(this, arguments);
            this.materialChanagedHandler = [];
            this.materials = new Map();
        }
        SceneObject.prototype.onMaterialChanged = function (func) {
            this.materialChanagedHandler.push(func);
        };
        /**
         * すべてのマテリアルに対して処理を実行します。
         */
        SceneObject.prototype.eachMaterial = function (func) {
            this.materials.forEach(function (v) { return func(v); });
        };
        SceneObject.prototype.addMaterial = function (mat) {
            this.materials.set(mat.ID, mat);
        };
        SceneObject.prototype.deleteMaterial = function (mat) {
            if (this.materials.has(mat.ID)) {
                this.materials.delete(mat.ID);
            }
        };
        SceneObject.prototype.update = function () {
        };
        SceneObject.prototype.render = function (rendererBase, currentMaterial) {
            currentMaterial.configureMaterial(rendererBase, this.geometry);
        };
        return SceneObject;
    })(JThreeObjectWithId);
    jThree.SceneObject = SceneObject;
    var Triangle = (function (_super) {
        __extends(Triangle, _super);
        function Triangle() {
            _super.call(this);
            this.addMaterial(new BasicMaterial());
            this.geometry = new TriangleGeometry();
        }
        return Triangle;
    })(SceneObject);
    jThree.Triangle = Triangle;
    var GomlLoader = (function (_super) {
        __extends(GomlLoader, _super);
        function GomlLoader() {
            _super.apply(this, arguments);
            this.gomlTags = new Map();
            this.headTagsById = new Map();
            this.bodyTagsById = new Map();
            this.headTags = [];
            this.bodyTags = [];
        }
        GomlLoader.prototype.initForPage = function () {
            var _this = this;
            this.constructTagDictionary();
            this.rootObj = $("<iframe style='display:none;'/>").appendTo("body").contents();
            var gomls = $("script[type='text/goml']");
            gomls.each(function (index, elem) {
                _this.loadScriptTag($(elem));
            });
        };
        GomlLoader.prototype.constructTagDictionary = function () {
            this.addGomlTag(new GomlRootTag());
            this.addGomlTag(new GomlHeadTag());
            this.addGomlTag(new GomlBodyTag());
            this.addGomlTag(new GomlRdrTag());
            this.addGomlTag(new GomlVpTag());
        };
        GomlLoader.prototype.addGomlTag = function (tag) {
            this.gomlTags.set(tag.TagName, tag);
        };
        GomlLoader.prototype.loadScriptTag = function (scriptTag) {
            var _this = this;
            var srcSource = scriptTag.attr("src");
            if (srcSource) {
                $.get(srcSource, [], function (d) {
                    _this.scriptLoaded(scriptTag[0], d);
                });
            }
            else {
                this.scriptLoaded(scriptTag[0], scriptTag.text());
            }
        };
        GomlLoader.prototype.scriptLoaded = function (elem, source) {
            var _this = this;
            source = source.replace(/(head|body)>/g, "j$1>"); //TODO Can be bug
            console.log("Replaced:" + source);
            var catched = $(source);
            if (catched[0].tagName !== "GOML")
                throw new jThree.Exceptions.InvalidArgumentException("Root should be goml");
            //console.dir(catched.find("jhead").children());
            //this.rootObj.find("head").append(catched.find("jhead").children());
            //this.rootObj.find("body").append(catched.find("jbody").children());
            var headChild = catched.find("jhead").children();
            var bodyChild = catched.find("jbody").children();
            this.parseHead(headChild, function (e) {
                _this.headTags.push(e);
            });
            this.parseBody(bodyChild, function (e) {
                _this.bodyTags.push(e);
            });
        };
        GomlLoader.prototype.parseHead = function (child, act) {
            if (!child)
                return;
            console.log(child);
            for (var i = 0; i < child.length; i++) {
                var elem = child[i];
                if (this.gomlTags.has(elem.tagName)) {
                    var newNode = this.gomlTags.get(elem.tagName).CreateNodeForThis(elem);
                    this.headTagsById.set(newNode.ID, newNode);
                    elem.classList.add("x-j3-" + newNode.ID);
                    act(newNode);
                    this.parseHead($(elem).children(), function (e) {
                        newNode.addChild(e);
                    });
                }
            }
        };
        GomlLoader.prototype.parseBody = function (child, act) {
            if (!child)
                return;
            console.log(child);
            for (var i = 0; i < child.length; i++) {
                var elem = child[i];
                if (this.gomlTags.has(elem.tagName)) {
                    var newNode = this.gomlTags.get(elem.tagName).CreateNodeForThis(elem);
                    this.bodyTagsById.set(newNode.ID, newNode);
                    elem.classList.add("x-j3-" + newNode.ID);
                    act(newNode);
                    this.parseHead($(elem).children(), function (e) {
                        newNode.addChild(e);
                    });
                }
            }
        };
        return GomlLoader;
    })(jThreeObject);
    jThree.GomlLoader = GomlLoader;
    var GomlTagBase = (function (_super) {
        __extends(GomlTagBase, _super);
        function GomlTagBase() {
            _super.apply(this, arguments);
        }
        Object.defineProperty(GomlTagBase.prototype, "TagName", {
            get: function () {
                return "";
            },
            enumerable: true,
            configurable: true
        });
        GomlTagBase.prototype.CreateNodeForThis = function (elem) {
            return null;
        };
        GomlTagBase.prototype.getTag = function (name) {
            return JThreeContext.Instance.GomlLoader.gomlTags.get(name);
        };
        return GomlTagBase;
    })(jThreeObject);
    jThree.GomlTagBase = GomlTagBase;
    var GomlRootTag = (function (_super) {
        __extends(GomlRootTag, _super);
        function GomlRootTag() {
            _super.apply(this, arguments);
        }
        GomlRootTag.prototype.CreateNodeForThis = function (elem) {
            throw new Error("Not implemented");
        };
        Object.defineProperty(GomlRootTag.prototype, "TagName", {
            get: function () {
                return "GOML";
            },
            enumerable: true,
            configurable: true
        });
        return GomlRootTag;
    })(GomlTagBase);
    jThree.GomlRootTag = GomlRootTag;
    var GomlHeadTag = (function (_super) {
        __extends(GomlHeadTag, _super);
        function GomlHeadTag() {
            _super.apply(this, arguments);
        }
        GomlHeadTag.prototype.CreateNodeForThis = function (elem) {
            throw new Error("Not implemented");
        };
        Object.defineProperty(GomlHeadTag.prototype, "TagName", {
            get: function () {
                return "HEAD";
            },
            enumerable: true,
            configurable: true
        });
        return GomlHeadTag;
    })(GomlTagBase);
    jThree.GomlHeadTag = GomlHeadTag;
    var GomlBodyTag = (function (_super) {
        __extends(GomlBodyTag, _super);
        function GomlBodyTag() {
            _super.apply(this, arguments);
        }
        GomlBodyTag.prototype.CreateNodeForThis = function (elem) {
            throw new Error("Not implemented");
        };
        Object.defineProperty(GomlBodyTag.prototype, "TagName", {
            get: function () {
                return "BODY";
            },
            enumerable: true,
            configurable: true
        });
        return GomlBodyTag;
    })(GomlTagBase);
    jThree.GomlBodyTag = GomlBodyTag;
    var GomlRdrTag = (function (_super) {
        __extends(GomlRdrTag, _super);
        function GomlRdrTag() {
            _super.apply(this, arguments);
        }
        GomlRdrTag.prototype.CreateNodeForThis = function (elem) {
            return new GomlTreeRdrNode(elem);
        };
        Object.defineProperty(GomlRdrTag.prototype, "TagName", {
            get: function () {
                return "RDR";
            },
            enumerable: true,
            configurable: true
        });
        return GomlRdrTag;
    })(GomlTagBase);
    jThree.GomlRdrTag = GomlRdrTag;
    var GomlVpTag = (function (_super) {
        __extends(GomlVpTag, _super);
        function GomlVpTag() {
            _super.apply(this, arguments);
        }
        GomlVpTag.prototype.CreateNodeForThis = function (elem) {
            return new GomlTreeVpNode(elem);
        };
        Object.defineProperty(GomlVpTag.prototype, "TagName", {
            get: function () {
                return "VP";
            },
            enumerable: true,
            configurable: true
        });
        return GomlVpTag;
    })(GomlTagBase);
    jThree.GomlVpTag = GomlVpTag;
    var GomlTreeNodeBase = (function (_super) {
        __extends(GomlTreeNodeBase, _super);
        function GomlTreeNodeBase(elem) {
            _super.call(this);
            this.children = [];
            this.element = elem;
        }
        GomlTreeNodeBase.prototype.addChild = function (child) {
            child.parent = this;
            this.children.push(child);
        };
        return GomlTreeNodeBase;
    })(JThreeObjectWithId);
    jThree.GomlTreeNodeBase = GomlTreeNodeBase;
    var GomlTreeRdrNode = (function (_super) {
        __extends(GomlTreeRdrNode, _super);
        function GomlTreeRdrNode(elem) {
            _super.call(this, elem);
            var test = $(elem);
            console.log("css test:" + $(test).css("clearcolor"));
            var targetCanvas = $("<canvas></canvas>");
            targetCanvas.addClass("x-j3-c-" + this.ID);
            $(this.Frame).append(targetCanvas);
            this.canvasManager = CanvasManager.fromCanvas(targetCanvas[0]);
            var scene = new jThree.Scene();
            scene.addRenderer(this.canvasManager.getDefaultViewport());
            JThreeContext.Instance.SceneManager.addScene(scene);
        }
        Object.defineProperty(GomlTreeRdrNode.prototype, "Frame", {
            get: function () {
                return this.element.getAttribute("frame") || "body";
            },
            enumerable: true,
            configurable: true
        });
        return GomlTreeRdrNode;
    })(GomlTreeNodeBase);
    jThree.GomlTreeRdrNode = GomlTreeRdrNode;
    var GomlTreeVpNode = (function (_super) {
        __extends(GomlTreeVpNode, _super);
        function GomlTreeVpNode(elem) {
            _super.call(this, elem);
        }
        return GomlTreeVpNode;
    })(GomlTreeNodeBase);
    jThree.GomlTreeVpNode = GomlTreeVpNode;
})(jThree || (jThree = {}));
var buf;
var time = 0;
var noInit;
$(function () {
    if (noInit)
        return;
    var jThreeContext = jThree.JThreeContext.Instance;
    //var renderer = jThree.CanvasManager.fromCanvas(<HTMLCanvasElement>document.getElementById("test-canvas"));
    //var renderer2 = jThree.CanvasManager.fromCanvas(<HTMLCanvasElement>document.getElementById("test-canvas2"));
    //var scene = new jThree.Scene();
    //scene.addRenderer(renderer.getDefaultViewport());
    //scene.addRenderer(renderer2.getDefaultViewport());
    //scene.addObject(new jThree.Triangle());
    //jThreeContext.SceneManager.addScene(scene);
    //buf = jThreeContext.ResourceManager.createBuffer("test-buffer", jThree.BufferTargetType.ArrayBuffer, jThree.BufferUsageType.DynamicDraw,3,jThree.ElementType.Float);
    jThreeContext.init();
    //GOML テスト
    jThreeContext.GomlLoader.initForPage();
});
