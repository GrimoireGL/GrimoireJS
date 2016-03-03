import test from 'ava';

import VectorBase from '../../lib/Math/VectorBase';
import Vector2 from '../../lib/Math/Vector2';
import Vector3 from '../../lib/Math/Vector3';
import Vector4 from '../../lib/Math/Vector4';

let error = 0.01;

const BLOCK = 'VectorBase';

test('sqr magnitude test for vector2', (t) => {
  t.ok((new Vector2(1, 2)).sqrMagnitude === 5);
});

test('sqr magnitude test for vector3', (t) => {
  t.ok((new Vector3(1, 2, 3)).sqrMagnitude === 14);
});

test('sqr magnitude test for vector4', (t) => {
  t.ok((new Vector4(1, 2, 3, 4)).sqrMagnitude === 30);
});

test('magnitude test for vector2', (t) => {
  t.ok((new Vector2(1, 2)).magnitude - 2.2361 < error);
});

test('magnitude test for vector3', (t) => {
  t.ok((new Vector3(1, 2, 3)).magnitude - 3.7417 < error);
});

test('magnitude test for vector4', (t) => {
  t.ok((new Vector4(1, 2, 3, 4)).magnitude - 5.4772 < error);
});
