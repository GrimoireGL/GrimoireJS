import test from 'ava';

import Vector2 from '../../lib-es5/Math/Vector2';

test('equal with is correct', (t) => {
  t.truthy((new Vector2(1, 0)).equalWith(new Vector2(1, 0)));
});

test('equal with is correct 2', (t) => {
  t.truthy(!(new Vector2(2, 0)).equalWith(new Vector2(1, 0)));
});

test('nearly equal with is correct', (t) => {
  t.truthy((new Vector2(1, 1)).nearlyEqualWith(new Vector2(1.001, 0.999)));
});

test('Get the number of elements of a vector', (t) => {
  t.truthy((new Vector2(1, 2)).ElementCount === 2);
});

test('XUnit', (t) => {
  t.truthy(Vector2.XUnit.equalWith(new Vector2(1, 0)));
});

test('YUnit', (t) => {
  t.truthy(Vector2.YUnit.equalWith(new Vector2(0, 1)));
});

test('One Vector', (t) => {
  t.truthy(Vector2.One.equalWith(new Vector2(1, 1)));
});

test('Zero vector', (t) => {
  t.truthy(Vector2.Zero.equalWith(new Vector2(0, 0)));
});

test('copying vector', (t) => {
  t.truthy(Vector2.copy(new Vector2(1, 2)).equalWith(new Vector2(1, 2)));
});

test('Get X of a vector', (t) => {
  t.truthy(new Vector2(1, 2).X === 1);
});

test('Get Y of a vector', (t) => {
  t.truthy(new Vector2(1, 2).Y === 2);
});

test('Set X of a vector', (t) => {
  let vec = new Vector2(1, 2);
  vec.X = 2;
  t.truthy(vec.equalWith(new Vector2(2, 2)));
});

test('Set Y of a vector', (t) => {
  let vec = new Vector2(1, 2);
  vec.Y = 1;
  t.truthy(vec.equalWith(new Vector2(1, 1)));
});

test('Dot vectors', (t) => {
  t.truthy(Vector2.dot(new Vector2(1, 2), new Vector2(2, 3)) === 8);
});

test('Add vectors', (t) => {
  t.truthy(Vector2.add(new Vector2(1, 2), new Vector2(2, 3)).equalWith(new Vector2(3, 5)));
});

test('Subtract vectors', (t) => {
  t.truthy(Vector2.subtract(new Vector2(2, 3), new Vector2(1, 2)).equalWith(new Vector2(1, 1)));
});

test('Multiply a vector', (t) => {
  t.truthy(Vector2.multiply(2, new Vector2(1, 2)).equalWith(new Vector2(2, 4)));
});

test('Negate a vector', (t) => {
  t.truthy(Vector2.negate(new Vector2(1, 2)).equalWith(new Vector2(-1, -2)));
});

test('Compare vectors', (t) => {
  t.truthy(Vector2.equals(new Vector2(1, 2), new Vector2(1, 2)) === true);
});

test('Roughly compare vectors', (t) => {
  t.truthy(Vector2.nearlyEquals(new Vector2(1, 2), new Vector2(1.009, 2.001)) === true);
});

test('Normalize a vector test for x axis', (t) => {
  t.truthy(Vector2.normalize(new Vector2(2, 0)).equalWith(new Vector2(1, 0)));
});

test('Normalize a vector test for a leaning axis', (t) => {
  t.truthy(Vector2.normalize(new Vector2(3, 4)).nearlyEqualWith(new Vector2(0.6, 0.8)));
});

test('Extract min elements from vectors', (t) => {
  t.truthy(Vector2.min(new Vector2(1, 2), new Vector2(2, 1)).equalWith(new Vector2(1, 1)));
});

test('Extract max elements from vectors', (t) => {
  t.truthy(Vector2.max(new Vector2(1, 2), new Vector2(2, 1)).equalWith(new Vector2(2, 2)));
});

test('Create an angle from vector2', (t) => {
  t.truthy(Math.abs(Vector2.angle(new Vector2(1, 0), new Vector2(0, 1)) - 1.5707963) <= 0.01);
});

test('A vector dot with another one', (t) => {
  t.truthy((new Vector2(1, 2)).dotWith(new Vector2(2, 3)) === 8);
});

test('Add vectors', (t) => {
  t.truthy((new Vector2(1, 2)).addWith(new Vector2(2, 3)).equalWith(new Vector2(3, 5)));
});

test('Subtract vectors', (t) => {
  t.truthy((new Vector2(1, 2)).subtractWith(new Vector2(2, 3)).equalWith(new Vector2(1, 1)));
});

test('multiply vectors', (t) => {
  t.truthy((new Vector2(1, 2)).multiplyWith(2).equalWith(new Vector2(2, 4)));
});

test('negate a vector', (t) => {
  t.truthy((new Vector2(1, 2)).negateThis().equalWith(new Vector2(-1, -2)));
});

test('normalize this vector', (t) => {
  t.truthy((new Vector2(3, 4)).normalizeThis().nearlyEqualWith(new Vector2(0.6, 0.8)));
});

test('a vector to string', (t) => {
  t.truthy((new Vector2(1, 2)).toString() === '(1, 2)');
});

test('a vector to display string', (t) => {
  t.truthy((new Vector2(1, 2)).toDisplayString() === 'Vector2(1, 2)');
});

test('a vector to mathematicastring', (t) => {
  t.truthy((new Vector2(1, 2)).toMathematicaString() === '{1, 2}');
});
