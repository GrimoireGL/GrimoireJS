import PA from "power-assert";
const assert = PA.default;

import sinon from "sinon";
import Quaternion from "../../lib/Math/Quaternion";

describe('Quaternion', ()=>{
  it('Quaternion equals',()=>{
    assert(Quaternion.equals(Quaternion.Euler(10,20,30),Quaternion.Euler(10,20,30)));
  });
  it('Quaternion add',()=>{
    assert(Quaternion.equals(Quaternion.Add(new Quaternion([10,10,10,10]),
    new Quaternion([10,10,10,10])),new Quaternion([20,20,20,20])));
  });
  it('Quaternion multiply',()=>{
    assert(Quaternion.equals(Quaternion.Multiply(new Quaternion([10,10,10,10]),
    new Quaternion([10,10,10,10])),new Quaternion([200,200,200,-200])));
  });
});
