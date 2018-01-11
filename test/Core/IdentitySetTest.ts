import GomlParser from "../../src/Core/GomlParser";
import Identity from "../../src/Core/Identity";
import IdentitySet from "../../src/Core/IdentitySet";
import test from "ava";


test("test parse for goml parser", (t) => {
  const name = Identity.fromFQN("namespace1.name1");
  const set = new IdentitySet();
  set.push(name);
  const array = set.toArray();
  t.truthy(array.length === 1);
  t.truthy(array[0].name === "name1");
});
