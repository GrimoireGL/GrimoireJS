/// <reference path="../../src/refs/bundle.ts" />
import PA = require('power-assert');
const assert = PA.default;

import sinon = require('sinon');
import Color3 = require("../../src/Math/Color3");
import Color4 = require("../../src/Math/Color4");
import Vector3 = require("../../src/Math/Vector3");
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
    assert(Vector3.parse("-n(2,0,0)").equalWith(new Vector3(-2,0,0)));
  });
});
