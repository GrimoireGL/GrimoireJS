var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
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
//# sourceMappingURL=Vector.js.map