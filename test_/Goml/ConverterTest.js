import test from 'ava';
import PA from "power-assert";
const assert = PA.default;

import sinon from "sinon";
import Color3 from "../../lib-es5/Math/Color3";
import Color4 from "../../lib-es5/Math/Color4";
import Vector3 from "../../lib-es5/Math/Vector3";
import Vector4 from "../../lib-es5/Math/Vector4";
import Quaternion from "../../lib-es5/Math/Quaternion";
import VectorColorCombinedParser from "../../lib-es5/Goml/VectorColorCombinedParser";
import AttributeParser from "../../lib-es5/Goml/AttributeParser"

test('Color3 parser #XXYYZZ', (t) => {
  t.truthy(Color3.parse('#FF00FF').equalWith(new Color3(1, 0, 1)));
});

test('Color3 parser red', (t) => {
  t.truthy(Color3.parse('red').equalWith(new Color3(1, 0, 0)));
});

test('Color3 parser #XYZ', (t) => {
  t.truthy(Color3.parse('#0F0').equalWith(new Color3(0, 1, 0)));
});

test('Color3 parser #XYZAF must throws error', (t) => {
  t.throws(() => Color3.parse('#0F00F'));
});

test('Color4 parser #XXYYZZ', (t) => {
  t.truthy(Color4.parse('#FF00FF').equalWith(new Color4(1, 0, 1, 1)));
});

test('Color4 parser red', (t) => {
  t.truthy(Color4.parse('red').equalWith(new Color4(1, 0, 0, 1)));
});

test('Color4 parser #XYZ', (t) => {
  t.truthy(Color4.parse('#0F0').equalWith(new Color4(0, 1, 0, 1)));
});

test('Color4 parser #XXYYZZAA', (t) => {
  t.truthy(Color4.parse('#FF00FF00').equalWith(new Color4(1, 0, 1, 0)));
});

test('Color4 parser #XYZA', (t) => {
  t.truthy(Color4.parse('#0F00').equalWith(new Color4(0, 1, 0, 0)));
});

test('Color4 parser #XYZAF must throw error', (t) => {
  t.throws(() => typeof Color4.parse('#0F00F'));
});

test('Vector3 parser (x,y,z)', (t) => {
  t.truthy(Vector3.parse('(1,2,3)').equalWith(new Vector3(1, 2, 3)));
});

test('Vector3 parser x,y,z', (t) => {
  t.truthy(Vector3.parse('1,2,3').equalWith(new Vector3(1, 2, 3)));
});

test('Vector3 parser n(2,0,0)', (t) => {
  t.truthy(Vector3.parse('n(2,0,0)').equalWith(new Vector3(1, 0, 0)));
});

test('Vector3 parser -(x,y,z)', (t) => {
  t.truthy(Vector3.parse('-(1,2,3)').equalWith(new Vector3(-1, -2, -3)));
});

test('Vector3 parser -n(2,0,0)', (t) => {
  t.truthy(Vector3.parse('-n(2,0,0)').equalWith(new Vector3(-1, 0, 0)));
});

test('Vector4 parser (x,y,z,w)', (t) => {
  t.truthy(Vector4.parse('(1,2,3,4)').equalWith(new Vector4(1, 2, 3, 4)));
});

test('Vector4 parser x,y,z', (t) => {
  t.truthy(Vector4.parse('1,2,3,4').equalWith(new Vector4(1, 2, 3, 4)));
});

test('Vector4 parser n(2,0,0)', (t) => {
  t.truthy(Vector4.parse('n(2,0,0,0)').equalWith(new Vector4(1, 0, 0, 0)));
});

test('Vector4 parser -(x,y,z)', (t) => {
  t.truthy(Vector4.parse('-(1,2,3,4)').equalWith(new Vector4(-1, -2, -3, -4)));
});

test('Vector4 parser -n(2,0,0)', (t) => {
  t.truthy(Vector4.parse('-n(2,0,0,0)').equalWith(new Vector4(-1, 0, 0, 0)));
});

test('Vector3 parser (x,y,z)', (t) => {
  t.truthy(VectorColorCombinedParser.parseTuple3('(1,2,3)').equalWith(new Vector3(1, 2, 3)));
});

test('Vector3 parseTuple3 x,y,z', (t) => {
  t.truthy(VectorColorCombinedParser.parseTuple3('1,2,3').equalWith(new Vector3(1, 2, 3)));
});

test('Vector3 parseTuple3 n(2,0,0)', (t) => {
  t.truthy(VectorColorCombinedParser.parseTuple3('n(2,0,0)').equalWith(new Vector3(1, 0, 0)));
});

test('Vector3 parseTuple3 -(x,y,z)', (t) => {
  t.truthy(VectorColorCombinedParser.parseTuple3('-(1,2,3)').equalWith(new Vector3(-1, -2, -3)));
});

test('Vector3 parseTuple3 -n(2,0,0)', (t) => {
  t.truthy(VectorColorCombinedParser.parseTuple3('-n(2,0,0)').equalWith(new Vector3(-1, 0, 0)));
});

test('Color3 parseTuple3 #XXYYZZ', (t) => {
  t.truthy(VectorColorCombinedParser.parseTuple3('#FF00FF').equalWith(new Color3(1, 0, 1)));
});

test('Color3 parseTuple3 red', (t) => {
  t.truthy(VectorColorCombinedParser.parseTuple3('red').equalWith(new Color3(1, 0, 0)));
});

test('Color3 parseTuple3 #XYZ', (t) => {
  t.truthy(VectorColorCombinedParser.parseTuple3('#0F0').equalWith(new Color3(0, 1, 0)));
});

test('Color3 parseTuple3 #XYZAF must throws error', (t) => {
  t.throws(()=>VectorColorCombinedParser.parseTuple3('#0F00F'));
});

test('180 should convert into radians', (t) => {
  t.truthy(AttributeParser.parseAngle("180") === Math.PI);
});
test('-180 should convert into radians', (t) => {
  t.truthy(AttributeParser.parseAngle("-180") === -Math.PI);
});
test('180 should convert into radians', (t) => {
  t.truthy(AttributeParser.parseAngle("180d") === Math.PI);
});
test('-180 should convert into radians', (t) => {
  t.truthy(AttributeParser.parseAngle("-180d") === -Math.PI);
});
test('180 should convert into radians', (t) => {
  t.truthy(AttributeParser.parseAngle("180deg") === Math.PI);
});
test('-180 should convert into radians', (t) => {
  t.truthy(AttributeParser.parseAngle("-180deg") === -Math.PI);
});
test('1/2p should mean 90degree', (t) => {
  t.truthy(AttributeParser.parseAngle("1/2p") === Math.PI / 2);
});
test('-1/2p should mean 90degree', (t) => {
  t.truthy(AttributeParser.parseAngle("-1/2p") === -Math.PI / 2);
});
test('0.5p should mean 90degree', (t) => {
  t.truthy(AttributeParser.parseAngle("0.5p") === Math.PI / 2);
});
test('1/2p should mean 90degree', (t) => {
  t.truthy(AttributeParser.parseAngle("1.0/2.0p") === Math.PI / 2);
});
test('1/2p should mean 90degree', (t) => {
  t.truthy(AttributeParser.parseAngle("1/2prad") === Math.PI / 2);
});
test('1/2rad should mean 1/2', (t) => {
  t.truthy(AttributeParser.parseAngle("1/2rad") === 1 / 2);
});
test('rotation 180 x', (t) => {
  let q = Quaternion.angleAxis(AttributeParser.parseAngle("180"), Vector3.XUnit);
  t.truthy(AttributeParser.parseRotation3D("x(180)").equalWith(q));
});
test('rotation 123.4 y', (t) => {
  t.truthy(AttributeParser.parseRotation3D("y(123.4)").equalWith(Quaternion.angleAxis(AttributeParser.parseAngle("123.4"), Vector3.YUnit)));
});
test('rotation 123.4 y with space', (t) => {
  t.truthy(AttributeParser.parseRotation3D(" y ( 123.4 ) ").equalWith(Quaternion.angleAxis(AttributeParser.parseAngle("123.4"), Vector3.YUnit)));
});
test('rotation 1/6p z', (t) => {
  t.truthy(AttributeParser.parseRotation3D("z(1/6p)").equalWith(Quaternion.angleAxis(AttributeParser.parseAngle("1/6p"), Vector3.ZUnit)));
});

test('rotation 1/6p z with space', (t) => {
  t.truthy(AttributeParser.parseRotation3D(" z ( 1 / 6 p ) ").equalWith(Quaternion.angleAxis(AttributeParser.parseAngle("1/6p"), Vector3.ZUnit)));
});

test('rotation 180 x with space', (t) => {
  let q = Quaternion.angleAxis(AttributeParser.parseAngle("180"), Vector3.XUnit);
  t.truthy(AttributeParser.parseRotation3D(" x( 180 ) ").equalWith(q));
});

test('axis rotation', (t) => {
  t.truthy(AttributeParser.parseRotation3D("axis(1/2p,1,2,3)").equalWith(Quaternion.angleAxis(AttributeParser.parseAngle("1/2p"), new Vector3(1, 2, 3))));
});

test('axis rotation with space', (t) => {
  t.truthy(AttributeParser.parseRotation3D(" axis ( 1 / 2 p , 1 , 2 , 3 ) ").equalWith(Quaternion.angleAxis(AttributeParser.parseAngle("1/2p"), new Vector3(1, 2, 3))));
});

test('euler rotation', (t) => {
  t.truthy(AttributeParser.parseRotation3D("30,20,50").equalWith(Quaternion.euler(AttributeParser.parseAngle("30"), AttributeParser.parseAngle("20"), AttributeParser.parseAngle("50"))));
});

test('euler rotation with space', (t) => {
  t.truthy(AttributeParser.parseRotation3D(" 30 , 20 , 50 ").equalWith(Quaternion.euler(AttributeParser.parseAngle("30"), AttributeParser.parseAngle("20"), AttributeParser.parseAngle("50"))));
});
