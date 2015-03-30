///<reference path="../../_references.ts"/>
///<reference path="../../def-test/qunit.d.ts"/>
var Vector2 = jThree.Mathematics.Vector.Vector2;
var Vector3 = jThree.Mathematics.Vector.Vector3;
var Vector4 = jThree.Mathematics.Vector.Vector4;
QUnit.module("VectorTest");
var testVec21 = new Vector2(1, 2);
var testVec22 = new Vector2(3, 4);
var testVec31 = new Vector3(1, 2, 3);
var testVec32 = new Vector3(3, 5, 4);
var testVec41 = new Vector4(1, 2, 3, 4);
var testVec42 = new Vector4(2, 3, 5, 7);
/**
 * Vector equal unit tests
 */
QUnit.test("equal test", function () {
    QUnit.equal(Vector2.equal(testVec21, new Vector2(1, 2)), true);
    QUnit.equal(Vector3.equal(testVec31, new Vector3(1, 2, 3)), true);
    QUnit.equal(Vector2.equal(testVec21, new Vector2(1, 3)), false);
    QUnit.equal(Vector3.equal(testVec31, new Vector3(1, 4, 3)), false);
    QUnit.equal(Vector4.equal(testVec41, new Vector4(1, 2, 3, 4)), true);
    QUnit.equal(Vector4.equal(testVec41, new Vector4(1, 2, 3, 5)), false);
});
/**
 * Vector add unit tests
 */
QUnit.test("add test", function () {
    QUnit.equal(Vector2.equal(Vector2.add(testVec21, testVec22), new Vector2(4, 6)), true);
    QUnit.equal(Vector3.equal(Vector3.add(testVec31, testVec32), new Vector3(4, 7, 7)), true);
    QUnit.equal(Vector4.equal(Vector4.add(testVec41, testVec42), new Vector4(3, 5, 8, 11)), true);
});
/**
 * Vector subtract unit tests
 */
QUnit.test("subtract test", function () {
    QUnit.equal(Vector2.equal(Vector2.subtract(testVec21, testVec22), new Vector2(-2, -2)), true);
    QUnit.equal(Vector3.equal(Vector3.subtract(testVec31, testVec32), new Vector3(-2, -3, -1)), true);
    QUnit.equal(Vector4.equal(Vector4.subtract(testVec41, testVec42), new Vector4(-1, -1, -2, -3)), true);
});
/**
 * Vector dot unit tests
 */
QUnit.test("dot test", function () {
    QUnit.equal(Vector2.dot(testVec21, testVec22), 11);
    QUnit.equal(Vector3.dot(testVec31, testVec32), 25);
    QUnit.equal(Vector4.dot(testVec41, testVec42), 51);
});
/**
 * Vector multiply scalar unit tests
 */
QUnit.test("multiply test", function () {
    QUnit.equal(Vector2.equal(Vector2.multiply(2, testVec21), new Vector2(2, 4)), true);
    QUnit.equal(Vector3.equal(Vector3.multiply(2, testVec31), new Vector3(2, 4, 6)), true);
    QUnit.equal(Vector4.equal(Vector4.multiply(2, testVec41), new Vector4(2, 4, 6, 8)), true);
});
/**
 * Vector magnitude unit tests
 */
QUnit.test("magnitude test", function () {
    QUnit.equal(Math.sqrt(5), testVec21.magnitude);
    QUnit.equal(Math.sqrt(14), testVec31.magnitude);
    QUnit.equal(Math.sqrt(30), testVec41.magnitude);
    QUnit.equal(Math.sqrt(5), testVec21.magnitude);
    QUnit.equal(Math.sqrt(14), testVec31.magnitude);
    QUnit.equal(Math.sqrt(30), testVec41.magnitude);
});
/**
 * Vector magnitude Squared unit tests
 */
QUnit.test("magnitude Squared test", function () {
    QUnit.equal(5, testVec21.magnitudeSquared);
    QUnit.equal(14, testVec31.magnitudeSquared);
    QUnit.equal(30, testVec41.magnitudeSquared);
    QUnit.equal(5, testVec21.magnitudeSquared);
    QUnit.equal(14, testVec31.magnitudeSquared);
    QUnit.equal(30, testVec41.magnitudeSquared);
});
/**
 * Vector negate unit tests
 */
QUnit.test("negate test", function () {
    QUnit.equal(Vector2.equal(jThree.Mathematics.Vector.Vector2.negate(testVec21), new Vector2(-1, -2)), true);
    QUnit.equal(Vector3.equal(jThree.Mathematics.Vector.Vector3.negate(testVec31), new Vector3(-1, -2, -3)), true);
    QUnit.equal(Vector4.equal(jThree.Mathematics.Vector.Vector4.negate(testVec41), new Vector4(-1, -2, -3, -4)), true);
});
//# sourceMappingURL=VectorTest.js.map