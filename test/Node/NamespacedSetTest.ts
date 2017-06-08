import "../XMLDomInit";
import test from "ava";
import GomlParser from "../../src/Node/GomlParser";
import xmldom from "xmldom";
import NSSet from "../../src/Base/NSSet";
import NSIdentity from "../../src/Base/NSIdentity";


test("test parse for goml parser", (t) => {
  const name = NSIdentity.fromFQN("namespace1.name1");
  const set = new NSSet();
  set.push(name);
  const array = set.toArray();
  t.truthy(array.length === 1);
  t.truthy(array[0].name === "name1");
});
