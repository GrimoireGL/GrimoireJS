import PA from "power-assert";
const assert = PA.default;

import sinon from "sinon";
import Quaternion from "../../lib/Math/Quaternion";

describe('Quaternion', ()=>{
  it('Quaternion equals',()=>{
    assert(Quaternion.equals(Quaternion.euler(10,20,30),Quaternion.euler(10,20,30)));
  });
  it('Quaternion add',()=>{
    assert(Quaternion.equals(Quaternion.add(new Quaternion([10,10,10,10]),
    new Quaternion([10,10,10,10])),new Quaternion([20,20,20,20])));
  });
  it('Quaternion multiply',()=>{
    assert(Quaternion.equals(Quaternion.multiply(new Quaternion([10,10,10,10]),
    new Quaternion([10,10,10,10])),new Quaternion([200,200,200,-200])));
  });
});
