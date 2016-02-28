import PA from "power-assert";
const assert = PA.default;

import sinon from "sinon";
import Quaternion from "../../lib/Math/Quaternion";
import Vector3 from "../../lib/Math/Vector3";
import Matrix from "../../lib/Math/Matrix";


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
  it('To Do Quaternion angleAxis',()=>{

  });
  it('Quaternion euler',()=>{
    assert(Quaternion.equals(Quaternion.euler(0,0,0),new Quaternion([0,0,0,1])));
  });
  it('To Do Quaternion eulerXYZ',()=>{

  });
  it('To Do Quaternion Slerp',()=>{

  });
  it('To Do Quaternion Angle',()=>{

  });
  it('To Do Quaternion FromToRotation',()=>{

  });
  it('To Do Quaternion LookRotation',()=>{

  });
  it('Quaternion identity',()=>{
    assert(Matrix.equals(Matrix.rotationQuaternion(Quaternion.Identity),Matrix.identity()));
  });
  it('Quaternion get X',()=>{
    assert(new Quaternion([10,20,20,10]).X === 10 );
  });
  it('Quaternion get Y',()=>{
    assert(new Quaternion([10,20,20,10]).Y === 20 );
  });
  it('Quaternion get Z',()=>{
    assert(new Quaternion([10,20,20,10]).Z === 20 );
  });
  it('Quaternion get W',()=>{
    assert(new Quaternion([10,20,20,10]).W === 10 );
  });
  it('Quaternion get ImaginaryPart',()=>{
   assert(Vector3.equals(new Quaternion([10,20,20,10]).ImaginaryPart,
   new Vector3([10,20,20])));
  });
  it('Quaternion get Conjugate',()=>{
   assert(Quaternion.equals(new Quaternion([10,20,20,10]).Conjugate,
   new Quaternion([-10,-20,-20,10])));
  });
  it('Quaternion get Length',()=>{
  assert(new Quaternion([1,1,1,1]).Length===2);
  });
  it('Quaternion get Normalize',()=>{
    assert(Quaternion.equals(new Quaternion([1,1,1,1]).normalize(),new Quaternion([0.5,0.5,0.5,0.5])));
  });
  it('Quaternion get Normalize',()=>{
    assert(Quaternion.equals(new Quaternion([1,1,1,1]).inverse(),new Quaternion([-0.25,-0.25,-0.25,0.25])));
  });
});
