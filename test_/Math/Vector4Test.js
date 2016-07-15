import test from 'ava';

import Vector4 from '../../lib-es5/Math/Vector4';

const BLOCK = 'Vector4';

test('equals with is correct', (t) => {
  t.ok((new Vector4(0, 1, 1, 0)).equalWith(new Vector4(0, 1, 1, 0)));
});

test('equals with is correct 2', (t) => {
  t.ok(!(new Vector4(0, 1, 2, 0)).equalWith(new Vector4(0, 1, 1, 0)));
});

test('nearly equals with is correct', (t) => {
  t.ok((new Vector4(0, 1, 1, 1)).nearlyEqualWith(new Vector4(0.001, 1.001, 1.001, 0.999)));
});

test('Get the number of elements of a vector', (t) => {
  t.ok((new Vector4(0, 1, 1, 2)).ElementCount === 4);
});

test('XUnit', (t) => {
  t.ok(Vector4.XUnit.equalWith(new Vector4(1, 0, 0, 0)));
});

test('YUnit', (t) => {
  t.ok(Vector4.YUnit.equalWith(new Vector4(0, 1, 0, 0)));
});

test('ZUnit', (t) => {
  t.ok(Vector4.ZUnit.equalWith(new Vector4(0, 0, 1, 0)));
});

test('WUnit', (t) => {
  t.ok(Vector4.WUnit.equalWith(new Vector4(0, 0, 0, 1)));
});

test('One Vector', (t) => {
  t.ok(Vector4.One.equalWith(new Vector4(1, 1, 1, 1)));
});

test('Zero vector', (t) => {
  t.ok(Vector4.Zero.equalWith(new Vector4(0, 0, 0, 0)));
});

test('copying vector', (t) => {
  t.ok(Vector4.copy(new Vector4(0, 1, 1, 2)).equalWith(new Vector4(0, 1, 1, 2)));
});

test('Get X of a vector', (t) => {
  t.ok(new Vector4(0, 1, 1, 2).X === 0);
});

test('Get Y of a vector', (t) => {
  t.ok(new Vector4(0, 1, 1, 2).Y === 1);
});

test('Get Z of a vector', (t) => {
  t.ok(new Vector4(0, 1, 1, 2).Z === 1);
});

test('Get W of a vector', (t) => {
  t.ok(new Vector4(0, 1, 1, 2).W === 2);
});

test('Set X of a vector', (t) => {
  let vec = new Vector4(0, 1, 1, 2);
  vec.X = 2;
  t.ok(vec.equalWith(new Vector4(2, 1, 1, 2)));
});

test('Set Y of a vector', (t) => {
  let vec = new Vector4(0, 1, 1, 2);
  vec.Y = 2;
  t.ok(vec.equalWith(new Vector4(0, 2, 1, 2)));
});

test('Set Z of a vector', (t) => {
  let vec = new Vector4(0, 1, 1, 2);
  vec.Z = 3;
  t.ok(vec.equalWith(new Vector4(0, 1, 3, 2)));
});

test('Set W of a vector', (t) => {
  let vec = new Vector4(0, 1, 1, 2);
  vec.W = 3;
  t.ok(vec.equalWith(new Vector4(0, 1, 1, 3)));
});

test('Dot vectors', (t) => {
  t.ok(Vector4.dot(new Vector4(1, 1, 1, 2), new Vector4(1, 1, 2, 3)) === 10);
});

test('Add vectors', (t) => {
  t.ok(Vector4.add(new Vector4(0, 1, 1, 2), new Vector4(0, 1, 2, 3)).equalWith(new Vector4(0, 2, 3, 5)));
});

test('Subtract vectors', (t) => {
  t.ok(Vector4.subtract(new Vector4(0, 1, 2, 3), new Vector4(0, 1, 1, 2)).equalWith(new Vector4(0, 0, 1, 1)));
});

test('Multiply a vector', (t) => {
  t.ok(Vector4.multiply(2, new Vector4(0, 1, 1, 2)).equalWith(new Vector4(0, 2, 2, 4)));
});

test('Negate a vector', (t) => {
  t.ok(Vector4.negate(new Vector4(0, 1, 1, 2)).equalWith(new Vector4(0, -1, -1, -2)));
});

test('Compare vectors', (t) => {
  t.ok(Vector4.equals(new Vector4(0, 1, 1, 2), new Vector4(0, 1, 1, 2)) === true);
});

test('Roughly compare vectors', (t) => {
  t.ok(Vector4.nearlyEquals(new Vector4(0, 1, 1, 2), new Vector4(0.0000001, 1, 1.009, 2.001)) === true);
});

test('Normalize a vector test for x axis', (t) => {
  t.ok(Vector4.normalize(new Vector4(0, 2, 0, 0)).equalWith(new Vector4(0, 1, 0, 0)));
});

test('Normalize a vector test for a leaning axis', (t) => {
  t.ok(Vector4.normalize(new Vector4(0, 1, 2, 2)).nearlyEqualWith(new Vector4(0, 0.333, 0.666, 0.666)));
});

test('Extract min elements from vectors', (t) => {
  t.ok(Vector4.min(new Vector4(0, 1, 1, 2), new Vector4(0, 1, 2, 1)).equalWith(new Vector4(0, 1, 1, 1)));
});

test('Extract max elements from vectors', (t) => {
  t.ok(Vector4.max(new Vector4(0, 1, 1, 2), new Vector4(0, 1, 2, 1)).equalWith(new Vector4(0, 1, 2, 2)));
});

test('Create an angle from Vector4', (t) => {
  t.ok(Math.abs(Vector4.angle(new Vector4(0, 1, 1, 0), new Vector4(0, 1, 0, 1)) - 1.047197551) <= 0.01);
});

test('A vector dot with another one', (t) => {
  t.ok((new Vector4(0, 1, 1, 2)).dotWith(new Vector4(0, 1, 2, 3)) === 9);
});

test('Add vectors', (t) => {
  t.ok((new Vector4(0, 1, 1, 2)).addWith(new Vector4(0, 1, 2, 3)).equalWith(new Vector4(0, 2, 3, 5)));
});

test('Subtract vectors', (t) => {
  t.ok((new Vector4(0, 1, 1, 2)).subtractWith(new Vector4(0, 1, 2, 3)).equalWith(new Vector4(0, 0, -1, -1)));
});

test('multiply vectors', (t) => {
  t.ok((new Vector4(0, 1, 1, 2)).multiplyWith(2).equalWith(new Vector4(0, 2, 2, 4)));
});

test('negate a vector', (t) => {
  t.ok((new Vector4(0, 1, 1, 2)).negateThis().equalWith(new Vector4(0, -1, -1, -2)));
});

test('normalize this vector', (t) => {
  t.ok((new Vector4(0, 1, 2, 2)).normalizeThis().nearlyEqualWith(new Vector4(0, 0.333, 0.666, 0.666)));
});

test('vector to string', (t) => {
  t.ok((new Vector4(0, 1, 1, 2)).toString() === '(0, 1, 1, 2)');
});

test('vector to display string', (t) => {
  t.ok((new Vector4(0, 1, 1, 2)).toDisplayString() === 'Vector4(0, 1, 1, 2)');
});

test('vector to mathematicastring', (t) => {
  t.ok((new Vector4(0, 1, 1, 2)).toMathematicaString() === '{0,1,1,2}');
});
