import PA from "power-assert";
const assert = PA.default;

import sinon from "sinon";
import Vector2 from "../../lib/Math/Vector2";

describe("Vector2 test",()=>{
  it("equal with is correct",()=>{
    assert((new Vector2(1,0)).equalWith(new Vector2(1,0)));
  });
  it("equal with is correct 2",()=>{
    assert(!(new Vector2(2,0)).equalWith(new Vector2(1,0)));
  });
  it("nearly equal with is correct",()=>{
    assert((new Vector2(1,1)).nearlyEqualWith(new Vector2(1.001,0.999)));
  });
  
  it("Get the nunber of elements of a vector test",()=>{
    assert((new Vector2(1,2)).ElementCount === 2);
  });

  it("XUnit test",()=>{
    assert(Vector2.XUnit.equalWith(new Vector2(1,0)));
  });
  it("YUnit test",()=>{
    assert(Vector2.YUnit.equalWith(new Vector2(0,1)));
  });
  it("One Vector test",()=>{
    assert(Vector2.One.equalWith(new Vector2(1,1)));
  });
  it("Zero vector test",()=>{
    assert(Vector2.Zero.equalWith(new Vector2(0,0)));
  });
  it("copying vector test",()=>{
    assert(Vector2.copy(new Vector2(1,2)).equalWith(new Vector2(1,2)));
  });
  it("Get X of a vector test",()=>{
    assert((new Vector2(1,2).X == 1));
  });
  it("Get Y of a vector test",()=>{
    assert((new Vector2(1,2).Y == 2));
  });

  it("Set X of a vector test",()=>{
    let vec = new Vector2(1,2);
    vec.X = 2;
    assert(vec.equalWith(new Vector2(2,2)));
  });

  it("Set Y of a vector test",()=>{
    let vec = new Vector2(1,2);
    vec.Y = 1;
    assert(vec.equalWith(new Vector2(1,1)));
  });


  it("Dot vectors test",()=>{
    assert(Vector2.dot(new Vector2(1,2),new Vector2(2,3))===8);
  });
  it("Add vectors test",()=>{
    assert(Vector2.add(new Vector2(1,2),new Vector2(2,3)).equalWith(new Vector2(3,5)));
  });
  it("Subtract vectors test",()=>{
    assert(Vector2.subtract(new Vector2(2,3),new Vector2(1,2)).equalWith(new Vector2(1,1)));
  });
  it("Multiply a vector test",()=>{
    assert(Vector2.multiply(2,new Vector2(1,2)).equalWith(new Vector2(2,4)));
  });
  it("Negate a vector test",()=>{
    assert(Vector2.negate(new Vector2(1,2)).equalWith(new Vector2(-1,-2)));
  });
  it("Compare vectors test",()=>{
    assert(Vector2.equal(new Vector2(1,2),new Vector2(1,2))===true);
  });
  it("Roughly compare vectors test",()=>{
    assert(Vector2.nearlyEqual(new Vector2(1,2),new Vector2(1.009,2.001))===true);
  });
  it("Normalize a vector test for x axis",()=>{
    assert(Vector2.normalize(new Vector2(2,0)).equalWith(new Vector2(1,0)));
  });

  it("Normalize a vector test for a leaning axis",()=>{
    assert(Vector2.normalize(new Vector2(3,4)).nearlyEqualWith(new Vector2(0.6,0.8)));
  });

  it("Extract min elements from vectors test",()=>{
    assert(Vector2.min(new Vector2(1,2),new Vector2(2,1)).equalWith(new Vector2(1,1)));
  });
  it("Extract max elements from vectors test",()=>{
    assert(Vector2.max(new Vector2(1,2),new Vector2(2,1)).equalWith(new Vector2(2,2)));
  });
  it("Create an angle from vector2 test",()=>{
    assert(Math.abs(Vector2.angle(new Vector2(1,0),new Vector2(0,1)) - 1.5707963) <= 0.01);
  });
  it("A vector dot with another one test",()=>{
    assert((new Vector2(1,2)).dotWith(new Vector2(2,3))===8);
  });
  it("Add vectors test",()=>{
    assert((new Vector2(1,2)).addWith(new Vector2(2,3)).equalWith(new Vector2(3,5)));
  });
  it("Subtract vectors test",()=>{
    assert((new Vector2(1,2)).subtractWith(new Vector2(2,3)).equalWith(new Vector2(1,1)));
  });
  it("multiply vectors test",()=>{
    assert((new Vector2(1,2)).multiplyWith(2).equalWith(new Vector2(2,4)));
  });
  it("negate a vector test",()=>{
    assert((new Vector2(1,2)).negateThis().equalWith(new Vector2(-1,-2)));
  });
  it("normalize this vector test",()=>{
    assert((new Vector2(3,4)).normalizeThis().nearlyEqualWith(new Vector2(0.6,0.8)));
  });
  it("a vector to string test",()=>{
    assert((new Vector2(1,2)).toString()==='(1, 2)');
  });
  it("a vector to display string",()=>{
    assert((new Vector2(1,2)).toDisplayString()==='Vector2(1, 2)');
  });
  it("a vector to mathematicastring",()=>{
    assert((new Vector2(1,2)).toMathematicaString()==='{1, 2}');
  });

});
