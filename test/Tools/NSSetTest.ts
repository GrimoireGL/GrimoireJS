import GomlParser from "../../src/Core/GomlParser";
import NSIdentity from "../../src/Core/NSIdentity";
import NSSet from "../../src/Tools/NSSet";
import test from "ava";


test("test parse for goml parser", (t) => {
  const name = NSIdentity.fromFQN("namespace1.name1");
  const set = new NSSet();
  set.push(name);
  const array = set.toArray();
  t.truthy(array.length === 1);
  t.truthy(array[0].name === "name1");
});
