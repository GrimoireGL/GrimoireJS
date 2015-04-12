var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
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
//# sourceMappingURL=Matrix.js.map