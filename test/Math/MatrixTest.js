import PA from "power-assert";
const assert = PA.default;

import sinon from "sinon";
import Matrix from "../../lib/Math/Matrix";
import Vector3 from "../../lib/Math/Vector3";
import Vector4 from "../../lib/Math/Vector4";
import Quaternion from "../../lib/Math/Quaternion";

describe('Matrix', ()=>{
  it('Matrix zero',()=>{
    assert(Matrix.equal(
      Matrix.zero(),
      new Matrix([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0])));
  });
  it('Matrix identity',()=>{
    assert(Matrix.equal(
      Matrix.identity(),
      new Matrix([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1])));
  });
  it('Matrix fromElements',()=>{
    assert(Matrix.equal(
      Matrix.fromElements(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16),
          new Matrix([1, 5, 9, 13, 2, 6, 10, 14, 3, 7, 11, 15, 4, 8, 12, 16])));
  });
  it('Matrix fromFunc',()=>{
    let f = function(a , b){
      return a + b;
    }
    assert(Matrix.equal(Matrix.fromFunc(f),new Matrix([0,1,2,3,1,2,3,4,2,3,4,5,3,4,5,6])));
  });
  it('Matrix equal',()=>{
    assert(Matrix.equal(Matrix.zero(),Matrix.zero()));
  });
  it('Matrix add',()=>{
    assert(Matrix.equal(
      Matrix.add(new Matrix([1, 5, 9, 13, 2, 6, 10, 14, 3, 7, 11, 15, 4, 8, 12, 16]),
      new Matrix([1, 5, 9, 13, 2, 6, 10, 14, 3, 7, 11, 15, 4, 8, 12, 16])),
      new Matrix([2, 10, 18, 26, 4, 12, 20, 28, 6, 14, 22, 30, 8, 16, 24, 32])));
  });
  it('Matrix subtract',()=>{
    assert(Matrix.equal(
      Matrix.subtract(new Matrix([0,1,2,3,0,1,2,3,0,1,2,3,0,1,2,3]),new Matrix([1,2,3,4,1,2,3,4,1,2,3,4,1,2,3,4])),
      new Matrix([-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1])));
  });
  it('Matrix scalarMultiply',()=>{
    assert(Matrix.equal(
      Matrix.scalarMultiply(2,
        new Matrix([1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8])),
        new Matrix([2,2,4,4,6,6,8,8,10,10,12,12,14,14,16,16])));
  });
  it('Matrix multiply',()=>{
    assert(Matrix.equal(
      Matrix.multiply(
        new Matrix([1,0,0,0,0,2,0,0,0,0,3,0,0,0,0,4]),
        new Matrix([1,0,0,0,0,2,0,0,0,0,3,0,0,0,0,4])),
        new Matrix([1,0,0,0,0,4,0,0,0,0,9,0,0,0,0,16])));
  });
  it('Matrix TRS',()=>{
assert(Matrix.equal(Matrix.TRS(new Vector3([1,2,3]),Quaternion.Euler(0,0,0),new Vector3([1,2,3])),
new Matrix([1,0,0,0,0,2,0,0,0,0,3,0,1,2,3,1])));
  });
  it('Matrix negate',()=>{
    assert(Matrix.equal(
      Matrix.negate(new Matrix([1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8])),
      new Matrix([-1,-1,-2,-2,-3,-3,-4,-4,-5,-5,-6,-6,-7,-7,-8,-8])));
  });
  it('Matrix transpose',()=>{
    assert(Matrix.equal(
      Matrix.transpose(new Matrix([1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8])),
      new Matrix([1,3,5,7,1,3,5,7,2,4,6,8,2,4,6,8])));
  });
  it('Matrix transformPoint',()=>{
    assert(Vector3.equal(Matrix.transformPoint(Matrix.translate(new Vector3([1,2,3])),new Vector3([1,2,3])),
      new Vector3([2,4,6])));
  });
  it('Matrix transformNormal',()=>{
    assert(Vector3.equal(Matrix.transformNormal(Matrix.translate(new Vector3([1,2,3])),new Vector3([1,2,3])),
      new Vector3([1,2,3])));

  });
  it('Matrix transform',()=>{
    assert(Vector3.equal(Matrix.transform(Matrix.translate(new Vector3([1,2,3])),new Vector4([1,2,3,1])),
      new Vector4([2,4,6,1])));
  });
  it('Matrix determinant',()=>{
    assert(
      Matrix.determinant(new Matrix([1,0,0,0,0,2,0,0,0,0,3,0,0,0,0,4]))===24);
  });
  it('Matrix inverse',()=>{
    assert(Matrix.equal(
      Matrix.inverse(new Matrix([1,0,0,0,0,2,0,0,0,0,2,0,0,0,0,4])),
      new Matrix([1,0,0,0,0,0.5,0,0,0,0,0.5,0,0,0,0,0.25])));
  });
  it('Matrix translate',()=>{
    assert(Matrix.equal(
      Matrix.translate(new Vector3([1,2,3])),
      new Matrix([1,0,0,0,0,1,0,0,0,0,1,0,1,2,3,1])));
  });
  it('Matrix scale',()=>{
    assert(Matrix.equal(
      Matrix.scale(new Vector3([1,2,3])),
      new Matrix([1,0,0,0,0,2,0,0,0,0,3,0,0,0,0,1])));
  });
  it('Matrix rotateX',()=>{
    assert(Matrix.equal(
      Matrix.rotateX(0),
      new Matrix([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1])));
  });
  it('Matrix rotateY',()=>{
    assert(Matrix.equal(
      Matrix.rotateY(0),
      new Matrix([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1])));
  });
  it('Matrix rotateZ',()=>{
    assert(Matrix.equal(
      Matrix.rotateZ(0),
      new Matrix([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1])));
  });
  it('Matrix rotationQuaternion',()=>{
    assert(Matrix.equal(Matrix.RotationQuaternion(Quaternion.Euler(0,0,0)),Matrix.scale(new Vector3([1,1,1]))));
  });
  it('Matrix frustum',()=>{
    assert(Matrix.equal(new Matrix([0,0,0,0,0,0,0,0,1,1,-1,-1,0,0,0,0]),Matrix.frustum(0,1,0,1,0,1)));
  });
  it('Matrix ortho',()=>{
    assert(Matrix.equal(new Matrix([2,0,0,0,0,2,0,0,0,0,-2,0,-1,-1,-1,1]),Matrix.ortho(0,1,0,1,0,1)));
  });
  it('Matrix perspective',()=>{
    let m1 = Matrix.perspective(Math.PI/4,1,0,1);
    let m2 = new Matrix([2.414,0,0,0,0,2.414,0,0,0,0,-1,-1,0,0,0,0]);
    let count = 0;
    for (let i = 0; i < 16; i++) {
      if(Math.abs(m1.getBySingleIndex(i)-m2.getBySingleIndex(i))<0.01)
      {
        count += 1;
      }

    }
    assert(count===16);
  });
  it('Matrix lookAt',()=>{
  assert(Matrix.equal(Matrix.lookAt(new Vector3([0, 0, 0]),new Vector3([0,0,1]),new Vector3([0,1,0]) ),
new Matrix([-1,0,0,0,0,1,0,0,0,0,-1,0,0,0,0,1])));
  });
  it('Matrix getAt',()=>{
    let matrix = new Matrix([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]);
    assert(matrix.getAt(1,1)===6);
  });
  it('Matrix setAt',()=>{
    let matrix = new Matrix([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]);
    matrix.setAt(1,1,100);
    assert(matrix.getAt(1,1)===100);
  });
  it('Matrix getBySingleIndex',()=>{
    let matrix = new Matrix([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]);
    assert(matrix.getBySingleIndex(5)===6);
  });
  it('Matrix getColmun',()=>{
    let matrix = new Matrix([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]);
    assert(new Vector4([1,2,3,4]).equalWith(matrix.getColmun(0)));
  });
  it('Matrix getRow',()=>{
    let matrix = new Matrix([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]);
    assert(new Vector4([1,5,9,13]).equalWith(matrix.getRow(0)));
  });
  it('Matrix multiplyWith',()=>{
  let matrix = new Matrix([1,2,3,4,1,2,3,4,1,2,3,4,1,2,3,4]);
  assert(Matrix.equal(new Matrix([2,4,6,8,2,4,6,8,2,4,6,8,2,4,6,8]),
  matrix.multiplyWith(Matrix.scalarMultiply(2,Matrix.identity()))));
  });
  it('Matrix elementCount',()=>{
    let matrix = new Matrix([1,2,3,4,1,2,3,4,1,2,3,4,1,2,3,4]);
    assert(matrix.ElementCount===16);
  });
  it('Matrix rowCount',()=>{
    let matrix = new Matrix([1,2,3,4,1,2,3,4,1,2,3,4,1,2,3,4]);
    assert(matrix.RowCount===4);
  });
  it('Matrix colmunCount',()=>{
    let matrix = new Matrix([1,2,3,4,1,2,3,4,1,2,3,4,1,2,3,4]);
    assert(matrix.ColmunCount===4);
  });
});
