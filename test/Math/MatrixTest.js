import test from 'ava';

import Matrix from '../../lib-es5/Math/Matrix';
import Vector3 from '../../lib-es5/Math/Vector3';
import Vector4 from '../../lib-es5/Math/Vector4';
import Quaternion from '../../lib-es5/Math/Quaternion';

test('zero', (t) => {
  t.ok(Matrix.equals(
    Matrix.zero(),
    new Matrix([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])));
});

test('identity', (t) => {
  t.ok(Matrix.equals(
    Matrix.identity(),
    new Matrix([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1])));
});

test('fromElements', (t) => {
  t.ok(Matrix.equals(
    Matrix.fromElements(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16),
    new Matrix([1, 5, 9, 13, 2, 6, 10, 14, 3, 7, 11, 15, 4, 8, 12, 16])));
});

test('fromFunc', (t) => {
  function f(a, b) {
    return a + b;
  }
  t.ok(Matrix.equals(Matrix.fromFunc(f), new Matrix([0, 1, 2, 3, 1, 2, 3, 4, 2, 3, 4, 5, 3, 4, 5, 6])));
});

test('equals', (t) => {
  t.ok(Matrix.equals(Matrix.zero(), Matrix.zero()));
});

test('add', (t) => {
  t.ok(Matrix.equals(
    Matrix.add(new Matrix([1, 5, 9, 13, 2, 6, 10, 14, 3, 7, 11, 15, 4, 8, 12, 16]),
    new Matrix([1, 5, 9, 13, 2, 6, 10, 14, 3, 7, 11, 15, 4, 8, 12, 16])),
    new Matrix([2, 10, 18, 26, 4, 12, 20, 28, 6, 14, 22, 30, 8, 16, 24, 32])));
});

test('subtract', (t) => {
  t.ok(Matrix.equals(
    Matrix.subtract(new Matrix([0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3]), new Matrix([1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4])),
    new Matrix([-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1])));
});

test('scalarMultiply', (t) => {
  t.ok(Matrix.equals(
    Matrix.scalarMultiply(2,
      new Matrix([1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8])),
      new Matrix([2, 2, 4, 4, 6, 6, 8, 8, 10, 10, 12, 12, 14, 14, 16, 16])));
});

test('multiply', (t) => {
  t.ok(Matrix.equals(
    Matrix.multiply(
      new Matrix([1, 0, 0, 0, 0, 2, 0, 0, 0, 0, 3, 0, 0, 0, 0, 4]),
      new Matrix([1, 0, 0, 0, 0, 2, 0, 0, 0, 0, 3, 0, 0, 0, 0, 4])),
      new Matrix([1, 0, 0, 0, 0, 4, 0, 0, 0, 0, 9, 0, 0, 0, 0, 16])));
});

test('tRS', (t) => {
  t.ok(Matrix.equals(Matrix.trs(new Vector3([1, 2, 3]), Quaternion.euler(0, 0, 0), new Vector3([1, 2, 3])),
  new Matrix([1, 0, 0, 0, 0, 2, 0, 0, 0, 0, 3, 0, 1, 2, 3, 1])));
});

test('negate', (t) => {
  t.ok(Matrix.equals(
    Matrix.negate(new Matrix([1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8])),
    new Matrix([-1, -1, -2, -2, -3, -3, -4, -4, -5, -5, -6, -6, -7, -7, -8, -8])));
});

test('transpose', (t) => {
  t.ok(Matrix.equals(
    Matrix.transpose(new Matrix([1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8])),
    new Matrix([1, 3, 5, 7, 1, 3, 5, 7, 2, 4, 6, 8, 2, 4, 6, 8])));
});

test('transformPoint', (t) => {
  t.ok(Vector3.equals(Matrix.transformPoint(Matrix.translate(new Vector3([1, 2, 3])), new Vector3([1, 2, 3])),
    new Vector3([2, 4, 6])));
});

test('transformNormal', (t) => {
  t.ok(Vector3.equals(Matrix.transformNormal(Matrix.translate(new Vector3([1, 2, 3])), new Vector3([1, 2, 3])),
    new Vector3([1, 2, 3])));
});

test('transform', (t) => {
  t.ok(Vector3.equals(Matrix.transform(Matrix.translate(new Vector3([1, 2, 3])), new Vector4([1, 2, 3, 1])),
    new Vector4([2, 4, 6, 1])));
});

test('determinant', (t) => {
  t.ok(
    Matrix.determinant(new Matrix([1, 0, 0, 0, 0, 2, 0, 0, 0, 0, 3, 0, 0, 0, 0, 4])) === 24);
});

test('inverse', (t) => {
  t.ok(Matrix.equals(
    Matrix.inverse(new Matrix([1, 0, 0, 0, 0, 2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 4])),
    new Matrix([1, 0, 0, 0, 0, 0.5, 0, 0, 0, 0, 0.5, 0, 0, 0, 0, 0.25])));
});

test('translate', (t) => {
  t.ok(Matrix.equals(
    Matrix.translate(new Vector3([1, 2, 3])),
    new Matrix([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 2, 3, 1])));
});

test('scale', (t) => {
  t.ok(Matrix.equals(
    Matrix.scale(new Vector3([1, 2, 3])),
    new Matrix([1, 0, 0, 0, 0, 2, 0, 0, 0, 0, 3, 0, 0, 0, 0, 1])));
});

test('rotateX', (t) => {
  t.ok(Matrix.equals(
    Matrix.rotateX(0),
    new Matrix([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1])));
});

test('rotateY', (t) => {
  t.ok(Matrix.equals(
    Matrix.rotateY(0),
    new Matrix([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1])));
});

test('rotateZ', (t) => {
  t.ok(Matrix.equals(
    Matrix.rotateZ(0),
    new Matrix([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1])));
});

test('rotationQuaternion', (t) => {
  t.ok(Matrix.equals(Matrix.rotationQuaternion(Quaternion.euler(0, 0, 0)), Matrix.scale(new Vector3([1, 1, 1]))));
});

test('frustum', (t) => {
  t.ok(Matrix.equals(new Matrix([0, 0, 0, 0, 0, 0, 0, 0, 1, 1, -1, -1, 0, 0, 0, 0]), Matrix.frustum(0, 1, 0, 1, 0, 1)));
});

test('ortho', (t) => {
  t.ok(Matrix.equals(new Matrix([2, 0, 0, 0, 0, 2, 0, 0, 0, 0, -2, 0, -1, -1, -1, 1]), Matrix.ortho(0, 1, 0, 1, 0, 1)));
});

test('perspective', (t) => {
  let m1 = Matrix.perspective(Math.PI / 4, 1, 0, 1);
  let m2 = new Matrix([2.414, 0, 0, 0, 0, 2.414, 0, 0, 0, 0, -1, -1, 0, 0, 0, 0]);
  let count = 0;
  for (let i = 0; i < 16; i++) {
    if (Math.abs(m1.getBySingleIndex(i) - m2.getBySingleIndex(i)) < 0.01) {
      count += 1;
    }
  }
  t.ok(count === 16);
});

test('lookAt', (t) => {
  t.ok(Matrix.equals(Matrix.lookAt(new Vector3([0, 0, 0]), new Vector3([0, 0, 1]), new Vector3([0, 1, 0])),
  new Matrix([-1, 0, 0, 0, 0, 1, 0, 0, 0, 0, -1, 0, 0, 0, 0, 1])));
});

test('getAt', (t) => {
  let matrix = new Matrix([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
  t.ok(matrix.getAt(1, 1) === 6);
});

test('setAt', (t) => {
  let matrix = new Matrix([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
  matrix.setAt(1, 1, 100);
  t.ok(matrix.getAt(1, 1) === 100);
});

test('getBySingleIndex', (t) => {
  let matrix = new Matrix([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
  t.ok(matrix.getBySingleIndex(5) === 6);
});

test('getColmun', (t) => {
  let matrix = new Matrix([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
  t.ok(new Vector4([1, 2, 3, 4]).equalWith(matrix.getColmun(0)));
});

test('getRow', (t) => {
  let matrix = new Matrix([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
  t.ok(new Vector4([1, 5, 9, 13]).equalWith(matrix.getRow(0)));
});

test('multiplyWith', (t) => {
  let matrix = new Matrix([1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4]);
  t.ok(Matrix.equals(new Matrix([2, 4, 6, 8, 2, 4, 6, 8, 2, 4, 6, 8, 2, 4, 6, 8]),
  matrix.multiplyWith(Matrix.scalarMultiply(2, Matrix.identity()))));
});

test('elementCount', (t) => {
  let matrix = new Matrix([1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4]);
  t.ok(matrix.ElementCount === 16);
});

test('rowCount', (t) => {
  let matrix = new Matrix([1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4]);
  t.ok(matrix.RowCount === 4);
});

test('colmunCount', (t) => {
  let matrix = new Matrix([1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4]);
  t.ok(matrix.ColmunCount === 4);
});

