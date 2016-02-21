import PA from "power-assert";
const assert = PA.default;

import sinon from "sinon";
import VectorBase from "../../lib/Math/VectorBase";
import Vector2 from "../../lib/Math/Vector2";
import Vector3 from "../../lib/Math/Vector3";
import Vector4 from "../../lib/Math/Vector4";

let error = 0.01;

describe("VectorBase Test",()=>{
  it("sqr magnitude test for vector2",()=>{
    assert((new Vector2(1,2)).sqrMagnitude == 5);
  });
  it("sqr magnitude test for vector3",()=>{
    assert((new Vector3(1,2,3)).sqrMagnitude == 14);
  });
  it("sqr magnitude test for vector4",()=>{
    assert((new Vector4(1,2,3,4)).sqrMagnitude == 30);
  });
  it("magnitude test for vector2",()=>{
    assert(((new Vector2(1,2)).magnitude - 2.2361) < error);
  });
  it("magnitude test for vector3",()=>{
    assert(((new Vector3(1,2,3)).magnitude - 3.7417) < error);
  });
  it("magnitude test for vector4",()=>{
    assert(((new Vector4(1,2,3,4)).magnitude - 5.4772) < error);
  });
  
});
