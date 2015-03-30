///<reference path="../../_references.ts"/>
///<reference path="../../def-test/qunit.d.ts"/>
QUnit.module("Matrix Test");
module jThreeTest {
    import Matrix = jThree.Matrix.Matrix;
    import Vector3 = jThree.Mathematics.Vector.Vector3;
    import Vector4 = jThree.Mathematics.Vector.Vector4;
    import VectorBase = jThree.Mathematics.Vector.VectorBase;

    function matEqual(actual: Matrix, expect: Matrix): void {
        QUnit.equal(Matrix.equal(actual, expect), true, "actual:\n{0}\n,expected:\n{1}\n".format(actual, expect));
    }

    function matNotEqaual(actual: Matrix, expect: Matrix) {
        QUnit.equal(Matrix.equal(actual, expect), false, "actual:\n{0}\n,expected:\n{1}\n".format(actual, expect));
    }

    function vec3Equal(actual: Vector3, expect: Vector3): void {
        QUnit.equal(Vector3.equal(actual, expect), true,"actual:\n{0},expected:\n{1}\n".format(actual,expect));
    }

    function vec4Equal(actual:Vector4,expect:Vector4) {
        QUnit.equal(Vector4.equal(actual, expect), true, "actual:\n{0},expected:\n{1}\n".format(actual, expect));
    }

        var m1: Matrix = new Matrix(new Float32Array(
            [1, 2, 3, 4,
            1, 2, 3, 4,
            1, 2, 3, 4,
            1, 2, 3, 4]));

        var m2: Matrix = new Matrix(new Float32Array(
            [3, 5, 7, 9,
            3, 5, 7, 9,
            3, 5, 7, 9,
            3, 6, 8, 9
            ]));

        var v31: Vector3 = new Vector3(1, 2, 3);

        var v41:Vector4=new Vector4(1,2,3,4);


    QUnit.test("equalTest", () => {
        matEqual(m1, new Matrix(new Float32Array([
            1, 2, 3, 4,
            1, 2, 3, 4,
            1, 2, 3, 4,
            1, 2, 3, 4
        ])));
        matNotEqaual(m1, new Matrix(new Float32Array([
                1, 2, 3, 4,
                1, 2, 3, 4,
                1, 2, 4, 4,
                1, 2, 3, 4
            ]
        )));
    });

    QUnit.test("addTest", () => {
        matEqual(Matrix.add(m1, m2), new Matrix(new Float32Array([
            4, 7, 10, 13,
            4, 7, 10, 13,
            4, 7, 10, 13,
            4, 8, 11, 13
        ])));
    });

    QUnit.test("subtractTest", () => {
        matEqual(Matrix.subtract(m1, m2), new Matrix(new Float32Array([
            -2, -3, -4, -5,
            -2, -3, -4, -5,
            -2, -3, -4, -5,
            -2, -4, -5, -5
        ])));
    });

    QUnit.test("scalarMultiplyTest", () => {
        matEqual(Matrix.scalarMultiply(2, m1), new Matrix(new Float32Array([
            2, 4, 6, 8,
            2, 4, 6, 8,
            2, 4, 6, 8,
            2, 4, 6, 8
        ])));
    });

    QUnit.test("nvertTest", () => {
        matEqual(Matrix.negate(m1), new Matrix(new Float32Array([
            -1, -2, -3, -4,
            -1, -2, -3, -4,
            -1, -2, -3, -4,
            -1, -2, -3, -4
        ])));
    });

    QUnit.test("transposeTest", () => {
        matEqual(Matrix.transpose(m1), new Matrix(new Float32Array(
        [
            1, 1, 1, 1,
            2, 2, 2, 2,
            3, 3, 3, 3,
            4, 4, 4, 4
        ])));
    });

    QUnit.test("translateTest", () => {
        matEqual(Matrix.translate(new Vector3(1, 2, 3)), new Matrix(new Float32Array([
            1, 0, 0, 1,
            0, 1, 0, 2,
            0, 0, 1, 3,
            0, 0, 0, 1
        ])));
    });

    QUnit.test("transformPointTest", () => {
            vec3Equal(Matrix.transformPoint(m1, v31), new Vector3(18, 18, 18));
        }
    );

    QUnit.test("transformNormalTest", () => {
        vec3Equal(Matrix.transformNormal(m1, v31), new Vector3(14, 14, 14));
    });

    QUnit.test("transformTest", () => {
        vec4Equal(Matrix.transform(m1, v41), new Vector4(30, 30, 30, 30));
    });

    QUnit.test("determinant test",() => {
        QUnit.equal(Matrix.determinant(Matrix.translate(new Vector3(1,2,3))),1);
    });
}