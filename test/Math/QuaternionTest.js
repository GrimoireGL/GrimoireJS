import PA from "power-assert";
const assert = PA.default;

import sinon from "sinon";
import Quaternion from "../../lib/Math/Quaternion";
import Vector3 from "../../lib/Math/Vector3";
import Matrix from "../../lib/Math/Matrix";


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
  it('To Do Quaternion angleAxis',()=>{

  });
  it('Quaternion euler',()=>{
    assert(Quaternion.equals(Quaternion.Euler(0,0,0),new Quaternion([0,0,0,1])));
  });
  it('To Do Quaternion eulerXYZ',()=>{

  });
  it('To Do Quaternion Slerp',()=>{

  });
  it('To Do Quaternion ',()=>{

  });
  it('To Do Quaternion Angle',()=>{

  });
  it('To Do Quaternion FromToRotation',()=>{

  });
  it('To Do Quaternion LookRotation',()=>{

  });
  it('To Do Quaternion identity',()=>{
    Matrix.
  });
});
