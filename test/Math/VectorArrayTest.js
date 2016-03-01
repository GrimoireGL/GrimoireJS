import PA from "power-assert";
const assert = PA.default;

import sinon from "sinon";
import VectorArray from "../../lib/Math/VectorArray";
import VectorBase from "../../lib/Math/VectorBase";
import Vector2 from "../../lib/Math/Vector2";
import Vector3 from "../../lib/Math/Vector3";
import Vector4 from "../../lib/Math/Vector4";

describe("VectorArray Test",()=>{
  it("create zero vector2 array test",()=>{
    let vecArray = new VectorArray.zeroVectorArray(2,10);
    for(let i=0 ;i<vecArray.length ; i++) {
      assert(vecArray[i]==0);
    }
  });
  it("create zero vector3 array test",()=>{
    let vecArray = new VectorArray.zeroVectorArray(3,10);
    for(let i=0 ;i<vecArray.length ; i++) {
      assert(vecArray[i]==0);
    }
  });
  it("create zero vector4 array test",()=>{
    let vecArray = new VectorArray.zeroVectorArray(4,10);
    for(let i=0 ;i<vecArray.length ; i++) {
      assert(vecArray[i]==0);
    }
  });
  it("append vector2 test",()=>{
    let vec = new VectorArray(1,2);
    vec.appendVector(new VectorArray(3,4));
    assert(VectorArray.equal(vec,new VectorArray(1,2,3,4)));
  });
  it("append vector3 test",()=>{
    let vec = new VectorArray(1,2,3);
    vec.appendVector(new VectorArray(4,5,6));
    assert(VectorArray.equal(vec,new VectorArray(1,2,3,4,5,6)));
  });
  it("append vector4 test",()=>{
    let vec = new VectorArray(1,2,3,4);
    vec.appendVector(new VectorArray(5,6,7,8));
    assert(VectorArray.equal(vec,new VectorArray(1,2,3,4,5,6,7,8)));
  });
  /*
  it("set vector test",()=>{
    let vec = new VectorArray(1,2,3,4,5,6,7,8,9,10);
    vec.setVector()
  });
  */
});
