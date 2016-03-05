import test from 'ava';

import Quaternion from '../../lib/Math/Quaternion';
import Vector3 from '../../lib/Math/Vector3';
import Matrix from '../../lib/Math/Matrix';

test('equals', (t) => {
  t.ok(Quaternion.equals(Quaternion.euler(10, 20, 30), Quaternion.euler(10, 20, 30)));
});

test('add', (t) => {
  t.ok(Quaternion.equals(Quaternion.add(new Quaternion([10, 10, 10, 10]),
  new Quaternion([10, 10, 10, 10])), new Quaternion([20, 20, 20, 20])));
});

test('multiply', (t) => {
  t.ok(Quaternion.equals(Quaternion.multiply(new Quaternion([10, 10, 10, 10]),
  new Quaternion([10, 10, 10, 10])), new Quaternion([200, 200, 200, -200])));
});

test('angleAxis', (t) => {
  t.pass();
});

test('euler', (t) => {
  t.ok(Quaternion.equals(Quaternion.euler(0, 0, 0), new Quaternion([0, 0, 0, 1])));
});

test('eulerXYZ', (t) => {
  t.pass();
});

test('Slerp', (t) => {
  t.pass();
});

test('Angle', (t) => {
  t.pass();
});

test('FromToRotation', (t) => {
  t.pass();
});

test('LookRotation', (t) => {
  t.pass();
});

test('identity', (t) => {
  t.ok(Matrix.equals(Matrix.rotationQuaternion(Quaternion.Identity), Matrix.identity()));
});

test('get X', (t) => {
  t.ok(new Quaternion([10, 20, 20, 10]).X === 10);
});

test('get Y', (t) => {
  t.ok(new Quaternion([10, 20, 20, 10]).Y === 20);
});

test('get Z', (t) => {
  t.ok(new Quaternion([10, 20, 20, 10]).Z === 20);
});

test('get W', (t) => {
  t.ok(new Quaternion([10, 20, 20, 10]).W === 10);
});

test('get ImaginaryPart', (t) => {
  t.ok(Vector3.equals(new Quaternion([10, 20, 20, 10]).ImaginaryPart,
 new Vector3([10, 20, 20])));
});

test('get Conjugate', (t) => {
  t.ok(Quaternion.equals(new Quaternion([10, 20, 20, 10]).Conjugate,
 new Quaternion([-10, -20, -20, 10])));
});

test('get Length', (t) => {
  t.ok(new Quaternion([1, 1, 1, 1]).Length === 2);
});

test('get Normalize', (t) => {
  t.ok(Quaternion.equals(new Quaternion([1, 1, 1, 1]).normalize(), new Quaternion([0.5, 0.5, 0.5, 0.5])));
});

test('get Normalize', (t) => {
  t.ok(Quaternion.equals(new Quaternion([1, 1, 1, 1]).inverse(), new Quaternion([-0.25, -0.25, -0.25, 0.25])));
});
