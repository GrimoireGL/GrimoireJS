import PA from "power-assert";
const assert = PA.default;

import sinon from "sinon";
import Vector3 from "../../lib/Math/Vector3";

describe("Vector3 test",()=>{
  it("equal with is correct",()=>{
    assert((new Vector3(1,1,0)).equalWith(new Vector3(1,1,0)));
  });
  it("equal with is correct 2",()=>{
    assert(!(new Vector3(1,2,0)).equalWith(new Vector3(1,1,0)));
  });
  it("nearly equal with is correct",()=>{
    assert((new Vector3(1,1,1)).nearlyEqualWith(new Vector3(1.001,1.001,0.999)));
  });
  it("Get the number of elements of a vector test",()=>{
    assert((new Vector3(1,1,2)).ElementCount === 3);
  });
  it("XUnit test",()=>{
    assert(Vector3.XUnit.equalWith(new Vector3(1,0,0)));
  });
  it("YUnit test",()=>{
    assert(Vector3.YUnit.equalWith(new Vector3(0,1,0)));
  });
  it("ZUnit test",()=>{
    assert(Vector3.ZUnit.equalWith(new Vector3(0,0,1)));
  });
  it("One Vector test",()=>{
    assert(Vector3.One.equalWith(new Vector3(1,1,1)));
  });
  it("Zero vector test",()=>{
    assert(Vector3.Zero.equalWith(new Vector3(0,0,0)));
  });
  it("copying vector test",()=>{
    assert(Vector3.copy(new Vector3(1,1,2)).equalWith(new Vector3(1,1,2)));
  });
  it("Get X of a vector test",()=>{
    assert((new Vector3(1,1,2).X == 1));
  });
  it("Get Y of a vector test",()=>{
    assert((new Vector3(1,1,2).Y == 1));
  });
  it("Get Z of a vector test",()=>{
    assert((new Vector3(1,1,2).Z == 2));
  });

  it("Set X of a vector test",()=>{
    let vec = new Vector3(1,1,2);
    vec.X = 2;
    assert(vec.equalWith(new Vector3(2,1,2)));
  });

  it("Set Y of a vector test",()=>{
    let vec = new Vector3(1,1,2);
    vec.Y = 2;
    assert(vec.equalWith(new Vector3(1,2,2)));
  });

  it("Set Z of a vector test",()=>{
    let vec = new Vector3(1,1,2);
    vec.Z = 3;
    assert(vec.equalWith(new Vector3(1,1,3)));
  });

  it("Dot vectors test",()=>{
    assert(Vector3.dot(new Vector3(1,1,2),new Vector3(1,2,3))===9);
  });
  it("Cross vectors test",()=>{
    assert(Vector3.cross(new Vector3(1,2,3),new Vector3(3,2,1)).equalWith(new Vector3(-4,8,-4)));
  });
  it("Add vectors test",()=>{
    assert(Vector3.add(new Vector3(1,1,2),new Vector3(1,2,3)).equalWith(new Vector3(2,3,5)));
  });
  it("Subtract vectors test",()=>{
    assert(Vector3.subtract(new Vector3(1,2,3),new Vector3(1,1,2)).equalWith(new Vector3(0,1,1)));
  });
  it("Multiply a vector test",()=>{
    assert(Vector3.multiply(2,new Vector3(1,1,2)).equalWith(new Vector3(2,2,4)));
  });
  it("Negate a vector test",()=>{
    assert(Vector3.negate(new Vector3(1,1,2)).equalWith(new Vector3(-1,-1,-2)));
  });
  it("Compare vectors test",()=>{
    assert(Vector3.equal(new Vector3(1,1,2),new Vector3(1,1,2))===true);
  });
  it("Roughly compare vectors test",()=>{
    assert(Vector3.nearlyEqual(new Vector3(1,1,2),new Vector3(1,1.009,2.001))===true);
  });
  it("Normalize a vector test for x axis",()=>{
    assert(Vector3.normalize(new Vector3(2,0,0)).equalWith(new Vector3(1,0,0)));
  });

  it("Normalize a vector test for a leaning axis",()=>{
    assert(Vector3.normalize(new Vector3(1,2,2)).nearlyEqualWith(new Vector3(0.333,0.666,0.666)));
  });

  it("Extract min elements from vectors test",()=>{
    assert(Vector3.min(new Vector3(1,1,2),new Vector3(1,2,1)).equalWith(new Vector3(1,1,1)));
  });
  it("Extract max elements from vectors test",()=>{
    assert(Vector3.max(new Vector3(1,1,2),new Vector3(1,2,1)).equalWith(new Vector3(1,2,2)));
  });
  it("Create an angle from Vector3 test",()=>{
    assert(Math.abs(Vector3.angle(new Vector3(1,1,0),new Vector3(1,0,1)) - 1.047197551) <= 0.01);
  });
  it("A vector dot with another one test",()=>{
    assert((new Vector3(1,1,2)).dotWith(new Vector3(1,2,3))===9);
  });
  it("Add vectors test",()=>{
    assert((new Vector3(1,1,2)).addWith(new Vector3(1,2,3)).equalWith(new Vector3(2,3,5)));
  });
  it("Subtract vectors test",()=>{
    assert((new Vector3(1,1,2)).subtractWith(new Vector3(1,2,3)).equalWith(new Vector3(0,-1,-1)));
  });
  it("multiply vectors test",()=>{
    assert((new Vector3(1,1,2)).multiplyWith(2).equalWith(new Vector3(2,2,4)));
  });
  it("negate a vector test",()=>{
    assert((new Vector3(1,1,2)).negateThis().equalWith(new Vector3(-1,-1,-2)));
  });
  it("normalize this vector test",()=>{
    assert((new Vector3(1,2,2)).normalizeThis().nearlyEqualWith(new Vector3(0.333,0.666,0.666)));
  });
  it("cross with test",()=>{
    assert((new Vector3(1,2,3).crossWith(new Vector3(2,3,4))).equalWith(new Vector3(-1,2,-1)));
  });
  it("a vector to string test",()=>{
    assert((new Vector3(1,1,2)).toString()==='(1, 1, 2)');
  });
  it("a vector to display string",()=>{
    assert((new Vector3(1,1,2)).toDisplayString()==='Vector3(1, 1, 2)');
  });
  it("a vector to mathematicastring",()=>{
    assert((new Vector3(1,1,2)).toMathematicaString()==='{1,1,2}');
  });

});
