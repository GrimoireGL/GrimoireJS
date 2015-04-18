///<reference path="../../_references.ts"/>
///<reference path="../../def-test/qunit.d.ts"/>
QUnit.module("Matricies Test");
var jThreeTest;
(function (jThreeTest) {
    var Matrix = jThree.Mathematics.Matricies.Matrix;
    var Vector3 = jThree.Mathematics.Vector.Vector3;
    var Vector4 = jThree.Mathematics.Vector.Vector4;
    function matEqual(actual, expect) {
        QUnit.equal(Matrix.equal(actual, expect), true, "actual:\n{0}\n,expected:\n{1}\n".format(actual, expect));
    }
    function matNotEqaual(actual, expect) {
        QUnit.equal(Matrix.equal(actual, expect), false, "actual:\n{0}\n,expected:\n{1}\n".format(actual, expect));
    }
    function vec3Equal(actual, expect) {
        QUnit.equal(Vector3.equal(actual, expect), true, "actual:\n{0},expected:\n{1}\n".format(actual, expect));
    }
    function vec4Equal(actual, expect) {
        QUnit.equal(Vector4.equal(actual, expect), true, "actual:\n{0},expected:\n{1}\n".format(actual, expect));
    }
    var m1 = Matrix.fromElements(1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4);
    var m2 = Matrix.fromElements(3, 5, 7, 9, 3, 5, 7, 9, 3, 5, 7, 9, 3, 6, 8, 9);
    var v31 = new Vector3(1, 2, 3);
    var v41 = new Vector4(1, 2, 3, 4);
    QUnit.test("equalTest", function () {
        matEqual(m1, Matrix.fromElements(1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4));
        matNotEqaual(m1, Matrix.fromElements(1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 4, 4, 1, 2, 3, 4));
    });
    QUnit.test("addTest", function () {
        matEqual(Matrix.add(m1, m2), Matrix.fromElements(4, 7, 10, 13, 4, 7, 10, 13, 4, 7, 10, 13, 4, 8, 11, 13));
    });
    QUnit.test("subtractTest", function () {
        matEqual(Matrix.subtract(m1, m2), Matrix.fromElements(-2, -3, -4, -5, -2, -3, -4, -5, -2, -3, -4, -5, -2, -4, -5, -5));
    });
    QUnit.test("scalarMultiplyTest", function () {
        matEqual(Matrix.scalarMultiply(2, m1), Matrix.fromElements(2, 4, 6, 8, 2, 4, 6, 8, 2, 4, 6, 8, 2, 4, 6, 8));
    });
    QUnit.test("nvertTest", function () {
        matEqual(Matrix.negate(m1), Matrix.fromElements(-1, -2, -3, -4, -1, -2, -3, -4, -1, -2, -3, -4, -1, -2, -3, -4));
    });
    QUnit.test("transposeTest", function () {
        matEqual(Matrix.transpose(m1), Matrix.fromElements(1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4));
    });
    QUnit.test("translateTest", function () {
        matEqual(Matrix.translate(new Vector3(1, 2, 3)), Matrix.fromElements(1, 0, 0, 1, 0, 1, 0, 2, 0, 0, 1, 3, 0, 0, 0, 1));
    });
    QUnit.test("transformPointTest", function () {
        vec3Equal(Matrix.transformPoint(m1, v31), new Vector3(18, 18, 18));
    });
    QUnit.test("transformNormalTest", function () {
        vec3Equal(Matrix.transformNormal(m1, v31), new Vector3(14, 14, 14));
    });
    QUnit.test("transformTest", function () {
        vec4Equal(Matrix.transform(m1, v41), new Vector4(30, 30, 30, 30));
    });
    QUnit.test("determinant test", function () {
        QUnit.equal(Matrix.determinant(Matrix.translate(new Vector3(1, 2, 3))), 1);
    });
    QUnit.test("look at test", function () {
        matEqual(Matrix.lookAt(new Vector3(0, 0, 0), new Vector3(0, 0, 1), new Vector3(0, 1, 0)), Matrix.identity());
        matEqual(Matrix.lookAt(new Vector3(0, 0, 0), new Vector3(0, 0, -1), new Vector3(0, 1, 0)), Matrix.fromElements(-1, 0, 0, 0, 0, 1, 0, 0, 0, 0, -1, 0, 0, 0, 0, 1));
    });
})(jThreeTest || (jThreeTest = {}));
//# sourceMappingURL=MatrixTest.js.map