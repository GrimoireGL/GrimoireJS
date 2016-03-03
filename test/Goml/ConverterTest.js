import PA from "power-assert";
const assert = PA.default;

import sinon from "sinon";
import Color3 from "../../lib/Math/Color3";
import Color4 from "../../lib/Math/Color4";
import Vector3 from "../../lib/Math/Vector3";
import Vector4 from "../../lib/Math/Vector4";
import VectorColorCombinedParser from "../../lib/Goml/VectorColorCombinedParser";
import AttributeParser from "../../lib/Goml/AttributeParser"

describe('Color parsers',()=>
{
  it('Color3 parser #XXYYZZ',()=>{
    assert(Color3.parse("#FF00FF").equalWith(new Color3(1,0,1)));
  });
  it('Color3 parser red',()=>{
    assert(Color3.parse("red").equalWith(new Color3(1,0,0)));
  });
  it('Color3 parser #XYZ',()=>{
    assert(Color3.parse("#0F0").equalWith(new Color3(0,1,0)));
  });
  it('Color3 parser #XYZAF must be undefined',()=>{
    assert(typeof Color3.parse("#0F00F") === "undefined");
  });
  it('Color4 parser #XXYYZZ',()=>{
    assert(Color4.parse("#FF00FF").equalWith(new Color4(1,0,1,1)));
  });
  it('Color4 parser red',()=>{
    assert(Color4.parse("red").equalWith(new Color4(1,0,0,1)));
  });
  it('Color4 parser #XYZ',()=>{
    assert(Color4.parse("#0F0").equalWith(new Color4(0,1,0,1)));
  });
  it('Color4 parser #XXYYZZAA',()=>{
    assert(Color4.parse("#FF00FF00").equalWith(new Color4(1,0,1,0)));
  });
  it('Color4 parser #XYZA',()=>{
    assert(Color4.parse("#0F00").equalWith(new Color4(0,1,0,0)));
  });
  it('Color4 parser #XYZAF must be undefined',()=>{
    assert(typeof Color4.parse("#0F00F") === "undefined");
  });
  it('Vector3 parser (x,y,z)',()=>{
    assert(Vector3.parse("(1,2,3)").equalWith(new Vector3(1,2,3)));
  });
  it('Vector3 parser x,y,z',()=>{
    assert(Vector3.parse("1,2,3").equalWith(new Vector3(1,2,3)));
  });
  it('Vector3 parser n(2,0,0)',()=>{
    assert(Vector3.parse("n(2,0,0)").equalWith(new Vector3(1,0,0)));
  });
  it('Vector3 parser -(x,y,z)',()=>{
    assert(Vector3.parse("-(1,2,3)").equalWith(new Vector3(-1,-2,-3)));
  });
  it('Vector3 parser -n(2,0,0)',()=>{
    assert(Vector3.parse("-n(2,0,0)").equalWith(new Vector3(-1,0,0)));
  });
  it('Vector4 parser (x,y,z,w)',()=>{
    assert(Vector4.parse("(1,2,3,4)").equalWith(new Vector4(1,2,3,4)));
  });
  it('Vector4 parser x,y,z',()=>{
    assert(Vector4.parse("1,2,3,4").equalWith(new Vector4(1,2,3,4)));
  });
  it('Vector4 parser n(2,0,0)',()=>{
    assert(Vector4.parse("n(2,0,0,0)").equalWith(new Vector4(1,0,0,0)));
  });
  it('Vector4 parser -(x,y,z)',()=>{
    assert(Vector4.parse("-(1,2,3,4)").equalWith(new Vector4(-1,-2,-3,-4)));
  });
  it('Vector4 parser -n(2,0,0)',()=>{
    assert(Vector4.parse("-n(2,0,0,0)").equalWith(new Vector4(-1,0,0,0)));
  });
  it('Vector3 parser (x,y,z)',()=>{
    assert(VectorColorCombinedParser.parseTuple3("(1,2,3)").equalWith(new Vector3(1,2,3)));
  });
  it('Vector3 parseTuple3 x,y,z',()=>{
    assert(VectorColorCombinedParser.parseTuple3("1,2,3").equalWith(new Vector3(1,2,3)));
  });
  it('Vector3 parseTuple3 n(2,0,0)',()=>{
    assert(VectorColorCombinedParser.parseTuple3("n(2,0,0)").equalWith(new Vector3(1,0,0)));
  });
  it('Vector3 parseTuple3 -(x,y,z)',()=>{
    assert(VectorColorCombinedParser.parseTuple3("-(1,2,3)").equalWith(new Vector3(-1,-2,-3)));
  });
  it('Vector3 parseTuple3 -n(2,0,0)',()=>{
    assert(VectorColorCombinedParser.parseTuple3("-n(2,0,0)").equalWith(new Vector3(-1,0,0)));
  });
  it('Color3 parseTuple3 #XXYYZZ',()=>{
    assert(VectorColorCombinedParser.parseTuple3("#FF00FF").equalWith(new Color3(1,0,1)));
  });
  it('Color3 parseTuple3 red',()=>{
    assert(VectorColorCombinedParser.parseTuple3("red").equalWith(new Color3(1,0,0)));
  });
  it('Color3 parseTuple3 #XYZ',()=>{
    assert(VectorColorCombinedParser.parseTuple3("#0F0").equalWith(new Color3(0,1,0)));
  });
  it('Color3 parseTuple3 #XYZAF must be undefined',()=>{
    assert(typeof VectorColorCombinedParser.parseTuple3("#0F00F") === "undefined");
  });
});

describe("AngleParser",()=>{
  it('180 should convert into radians',()=>{
    assert(AttributeParser.parseAngle("180") === Math.PI);
  });
  it('180 should convert into radians',()=>{
    assert(AttributeParser.parseAngle("180d") === Math.PI);
  });
  it('180 should convert into radians',()=>{
    assert(AttributeParser.parseAngle("180deg") === Math.PI);
  });
  it('1/2p should mean 90degree',()=>{
    assert(AttributeParser.parseAngle("1/2p") === Math.PI/2);
  });
  it('0.5p should mean 90degree',()=>{
    assert(AttributeParser.parseAngle("0.5p") === Math.PI/2);
  });
  it('1/2p should mean 90degree',()=>{
    assert(AttributeParser.parseAngle("1.0/2.0p") === Math.PI/2);
  });
  it('1/2p should mean 90degree',()=>{
    assert(AttributeParser.parseAngle("1/2prad") === Math.PI/2);
  });
  it('1/2rad should mean 1/2',()=>{
    assert(AttributeParser.parseAngle("1/2rad") === 1/2);
  });
});
