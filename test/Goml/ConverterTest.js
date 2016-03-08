import test from 'ava';

import Color3 from '../../lib/Math/Color3';
import Color4 from '../../lib/Math/Color4';
import Vector3 from '../../lib/Math/Vector3';
import Vector4 from '../../lib/Math/Vector4';
import VectorColorCombinedParser from '../../lib/Goml/VectorColorCombinedParser';

test('Color3 parser #XXYYZZ', (t) => {
  t.ok(Color3.parse('#FF00FF').equalWith(new Color3(1, 0, 1)));
});

test('Color3 parser red', (t) => {
  t.ok(Color3.parse('red').equalWith(new Color3(1, 0, 0)));
});

test('Color3 parser #XYZ', (t) => {
  t.ok(Color3.parse('#0F0').equalWith(new Color3(0, 1, 0)));
});

test('Color3 parser #XYZAF must be undefined', (t) => {
  t.ok(typeof Color3.parse('#0F00F') === 'undefined');
});

test('Color4 parser #XXYYZZ', (t) => {
  t.ok(Color4.parse('#FF00FF').equalWith(new Color4(1, 0, 1, 1)));
});

test('Color4 parser red', (t) => {
  t.ok(Color4.parse('red').equalWith(new Color4(1, 0, 0, 1)));
});

test('Color4 parser #XYZ', (t) => {
  t.ok(Color4.parse('#0F0').equalWith(new Color4(0, 1, 0, 1)));
});

test('Color4 parser #XXYYZZAA', (t) => {
  t.ok(Color4.parse('#FF00FF00').equalWith(new Color4(1, 0, 1, 0)));
});

test('Color4 parser #XYZA', (t) => {
  t.ok(Color4.parse('#0F00').equalWith(new Color4(0, 1, 0, 0)));
});

test('Color4 parser #XYZAF must be undefined', (t) => {
  t.ok(typeof Color4.parse('#0F00F') === 'undefined');
});

test('Vector3 parser (x,y,z)', (t) => {
  t.ok(Vector3.parse('(1,2,3)').equalWith(new Vector3(1, 2, 3)));
});

test('Vector3 parser x,y,z', (t) => {
  t.ok(Vector3.parse('1,2,3').equalWith(new Vector3(1, 2, 3)));
});

test('Vector3 parser n(2,0,0)', (t) => {
  t.ok(Vector3.parse('n(2,0,0)').equalWith(new Vector3(1, 0, 0)));
});

test('Vector3 parser -(x,y,z)', (t) => {
  t.ok(Vector3.parse('-(1,2,3)').equalWith(new Vector3(-1, -2, -3)));
});

test('Vector3 parser -n(2,0,0)', (t) => {
  t.ok(Vector3.parse('-n(2,0,0)').equalWith(new Vector3(-1, 0, 0)));
});

test('Vector4 parser (x,y,z,w)', (t) => {
  t.ok(Vector4.parse('(1,2,3,4)').equalWith(new Vector4(1, 2, 3, 4)));
});

test('Vector4 parser x,y,z', (t) => {
  t.ok(Vector4.parse('1,2,3,4').equalWith(new Vector4(1, 2, 3, 4)));
});

test('Vector4 parser n(2,0,0)', (t) => {
  t.ok(Vector4.parse('n(2,0,0,0)').equalWith(new Vector4(1, 0, 0, 0)));
});

test('Vector4 parser -(x,y,z)', (t) => {
  t.ok(Vector4.parse('-(1,2,3,4)').equalWith(new Vector4(-1, -2, -3, -4)));
});

test('Vector4 parser -n(2,0,0)', (t) => {
  t.ok(Vector4.parse('-n(2,0,0,0)').equalWith(new Vector4(-1, 0, 0, 0)));
});

test('Vector3 parser (x,y,z)', (t) => {
  t.ok(VectorColorCombinedParser.parseTuple3('(1,2,3)').equalWith(new Vector3(1, 2, 3)));
});

test('Vector3 parseTuple3 x,y,z', (t) => {
  t.ok(VectorColorCombinedParser.parseTuple3('1,2,3').equalWith(new Vector3(1, 2, 3)));
});

test('Vector3 parseTuple3 n(2,0,0)', (t) => {
  t.ok(VectorColorCombinedParser.parseTuple3('n(2,0,0)').equalWith(new Vector3(1, 0, 0)));
});

test('Vector3 parseTuple3 -(x,y,z)', (t) => {
  t.ok(VectorColorCombinedParser.parseTuple3('-(1,2,3)').equalWith(new Vector3(-1, -2, -3)));
});

test('Vector3 parseTuple3 -n(2,0,0)', (t) => {
  t.ok(VectorColorCombinedParser.parseTuple3('-n(2,0,0)').equalWith(new Vector3(-1, 0, 0)));
});

test('Color3 parseTuple3 #XXYYZZ', (t) => {
  t.ok(VectorColorCombinedParser.parseTuple3('#FF00FF').equalWith(new Color3(1, 0, 1)));
});

test('Color3 parseTuple3 red', (t) => {
  t.ok(VectorColorCombinedParser.parseTuple3('red').equalWith(new Color3(1, 0, 0)));
});

test('Color3 parseTuple3 #XYZ', (t) => {
  t.ok(VectorColorCombinedParser.parseTuple3('#0F0').equalWith(new Color3(0, 1, 0)));
});

test('Color3 parseTuple3 #XYZAF must be undefined', (t) => {
  t.ok(typeof VectorColorCombinedParser.parseTuple3('#0F00F') === 'undefined');
});

