import '../XMLDomInit'
import test from 'ava';
import GomlParser from "../../lib-es5/Node/GomlParser";
import xmldom from 'xmldom';
import NSSet from "../../lib-es5/Base/NSSet"
import NSIdentity from "../../lib-es5/Base/NSIdentity"


test('test parse for goml parser', (t) => {
  const name = new NSIdentity("namespace1", "name1");
  const set = new NSSet();
  set.push(name);
  const array = set.toArray();
  t.truthy(array.length === 1);
  t.truthy(array[0].name === "name1");

});
