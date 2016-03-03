import test from 'ava';

import Vector3 from '../../lib/Math/Vector3';

test('equal with is correct', (t) => {
  t.ok((new Vector3(1, 1, 0)).equalWith(new Vector3(1, 1, 0)));
});

test('equal with is correct 2', (t) => {
  t.ok(!(new Vector3(1, 2, 0)).equalWith(new Vector3(1, 1, 0)));
});

test('nearly equal with is correct', (t) => {
  t.ok((new Vector3(1, 1, 1)).nearlyEqualWith(new Vector3(1.001, 1.001, 0.999)));
});

test('Get the number of elements of a vector', (t) => {
  t.ok((new Vector3(1, 1, 2)).ElementCount === 3);
});

test('XUnit', (t) => {
  t.ok(Vector3.XUnit.equalWith(new Vector3(1, 0, 0)));
});

test('YUnit', (t) => {
  t.ok(Vector3.YUnit.equalWith(new Vector3(0, 1, 0)));
});

test('ZUnit', (t) => {
  t.ok(Vector3.ZUnit.equalWith(new Vector3(0, 0, 1)));
});

test('One Vector', (t) => {
  t.ok(Vector3.One.equalWith(new Vector3(1, 1, 1)));
});

test('Zero vector', (t) => {
  t.ok(Vector3.Zero.equalWith(new Vector3(0, 0, 0)));
});

test('copying vector', (t) => {
  t.ok(Vector3.copy(new Vector3(1, 1, 2)).equalWith(new Vector3(1, 1, 2)));
});

test('Get X of a vector', (t) => {
  t.ok(new Vector3(1, 1, 2).X === 1);
});

test('Get Y of a vector', (t) => {
  t.ok(new Vector3(1, 1, 2).Y === 1);
});

test('Get Z of a vector', (t) => {
  t.ok(new Vector3(1, 1, 2).Z === 2);
});

test('Set X of a vector', (t) => {
  let vec = new Vector3(1, 1, 2);
  vec.X = 2;
  t.ok(vec.equalWith(new Vector3(2, 1, 2)));
});

test('Set Y of a vector', (t) => {
  let vec = new Vector3(1, 1, 2);
  vec.Y = 2;
  t.ok(vec.equalWith(new Vector3(1, 2, 2)));
});

test('Set Z of a vector', (t) => {
  let vec = new Vector3(1, 1, 2);
  vec.Z = 3;
  t.ok(vec.equalWith(new Vector3(1, 1, 3)));
});

test('Dot vectors', (t) => {
  t.ok(Vector3.dot(new Vector3(1, 1, 2), new Vector3(1, 2, 3)) === 9);
});

test('Cross vectors', (t) => {
  t.ok(Vector3.cross(new Vector3(1, 2, 3), new Vector3(3, 2, 1)).equalWith(new Vector3(-4, 8, -4)));
});

test('Add vectors', (t) => {
  t.ok(Vector3.add(new Vector3(1, 1, 2), new Vector3(1, 2, 3)).equalWith(new Vector3(2, 3, 5)));
});

test('Subtract vectors', (t) => {
  t.ok(Vector3.subtract(new Vector3(1, 2, 3), new Vector3(1, 1, 2)).equalWith(new Vector3(0, 1, 1)));
});

test('Multiply a vector', (t) => {
  t.ok(Vector3.multiply(2, new Vector3(1, 1, 2)).equalWith(new Vector3(2, 2, 4)));
});

test('Negate a vector', (t) => {
  t.ok(Vector3.negate(new Vector3(1, 1, 2)).equalWith(new Vector3(-1, -1, -2)));
});

test('Compare vectors', (t) => {
  t.ok(Vector3.equals(new Vector3(1, 1, 2), new Vector3(1, 1, 2)) === true);
});

test('Roughly compare vectors', (t) => {
  t.ok(Vector3.nearlyEquals(new Vector3(1, 1, 2), new Vector3(1, 1.009, 2.001)) === true);
});

test('Normalize a vector test for x axis', (t) => {
  t.ok(Vector3.normalize(new Vector3(2, 0, 0)).equalWith(new Vector3(1, 0, 0)));
});

test('Normalize a vector test for a leaning axis', (t) => {
  t.ok(Vector3.normalize(new Vector3(1, 2, 2)).nearlyEqualWith(new Vector3(0.333, 0.666, 0.666)));
});

test('Extract min elements from vectors', (t) => {
  t.ok(Vector3.min(new Vector3(1, 1, 2), new Vector3(1, 2, 1)).equalWith(new Vector3(1, 1, 1)));
});

test('Extract max elements from vectors', (t) => {
  t.ok(Vector3.max(new Vector3(1, 1, 2), new Vector3(1, 2, 1)).equalWith(new Vector3(1, 2, 2)));
});

test('Create an angle from Vector3', (t) => {
  t.ok(Math.abs(Vector3.angle(new Vector3(1, 1, 0), new Vector3(1, 0, 1)) - 1.047197551) <= 0.01);
});

test('A vector dot with another one', (t) => {
  t.ok((new Vector3(1, 1, 2)).dotWith(new Vector3(1, 2, 3)) === 9);
});

test('Add vectors', (t) => {
  t.ok((new Vector3(1, 1, 2)).addWith(new Vector3(1, 2, 3)).equalWith(new Vector3(2, 3, 5)));
});

test('Subtract vectors', (t) => {
  t.ok((new Vector3(1, 1, 2)).subtractWith(new Vector3(1, 2, 3)).equalWith(new Vector3(0, -1, -1)));
});

test('multiply vectors', (t) => {
  t.ok((new Vector3(1, 1, 2)).multiplyWith(2).equalWith(new Vector3(2, 2, 4)));
});

test('negate a vector', (t) => {
  t.ok((new Vector3(1, 1, 2)).negateThis().equalWith(new Vector3(-1, -1, -2)));
});

test('normalize this vector', (t) => {
  t.ok((new Vector3(1, 2, 2)).normalizeThis().nearlyEqualWith(new Vector3(0.333, 0.666, 0.666)));
});

test('cross with', (t) => {
  t.ok((new Vector3(1, 2, 3).crossWith(new Vector3(2, 3, 4))).equalWith(new Vector3(-1, 2, -1)));
});

test('a vector to string', (t) => {
  t.ok((new Vector3(1, 1, 2)).toString() === '(1, 1, 2)');
});

test('a vector to display string', (t) => {
  t.ok((new Vector3(1, 1, 2)).toDisplayString() === 'Vector3(1, 1, 2)');
});

test('a vector to mathematicastring', (t) => {
  t.ok((new Vector3(1, 1, 2)).toMathematicaString() === '{1,1,2}');
});
