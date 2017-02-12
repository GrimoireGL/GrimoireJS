import '../XMLDomInit'
import test from 'ava';
import Ensure from '../../lib-es5/Base/Ensure';
import GrimoireInterface from '../../lib-es5/GrimoireInterface';
import NSDictionary from '../../lib-es5/Base/NSDictionary';
import AttributeManager from '../../lib-es5/Base/AttributeManager';
import NSIdentity from '../../lib-es5/Base/NSIdentity';
import Constants from '../../lib-es5/Base/Constants';
import Attribute from '../../lib-es5/Node/Attribute';
import sinon from 'sinon';

const genAttr = (name, watch) => {
  return { name: name, watch: watch, Value: "value of " + name };
}

const ns1 = NSIdentity.from("aaa");
const ns2 = NSIdentity.from("bbb");
const ns3 = NSIdentity.from("ccc");

const genAM = () => {
  const am = new AttributeManager("tag");
  am.addAttribute(genAttr(ns1));
  am.addAttribute(genAttr(ns2));
  am.addAttribute(genAttr(ns3));
  return am;
}

test('test', (t) => {
  const am = genAM();
  let count = 0;
  for (let key in am._attributesFQNMap) {
    count += am._attributesFQNMap[key].length;
  }
  t.truthy(count === 3);
  t.truthy(!!am.getAttribute(ns1.name));
});

test('test addAttribute', (t) => {
  const am = genAM();
  let l = 0;
  for (let key in am._attributesFQNMap) {
    l += am._attributesFQNMap[key].length;
  }
  am.addAttribute(genAttr(ns1))
  let count = 0;
  for (let key in am._attributesFQNMap) {
    count += am._attributesFQNMap[key].length;
  }
  t.truthy(count === l + 1);
  am.addAttribute(genAttr(ns1));
  count = 0;
  for (let key in am._attributesFQNMap) {
    count += am._attributesFQNMap[key].length;
  }
  t.truthy(count === l + 2);
});

test('test watch', (t) => {
  const am = genAM();
  const spy1 = sinon.spy();
  const spy2 = sinon.spy();
  am.addAttribute(genAttr(NSIdentity.from("ns", "aaa"), () => {
    spy1("watch");
  }));
  am.addAttribute(genAttr(NSIdentity.from("ns", "aaa"), () => {
    spy2("watch");
  }));
  am.watch(NSIdentity.from("ns", "aaa"), () => {});
  sinon.assert.called(spy1);
  sinon.assert.called(spy2);
});

test('test set/getAttribute', (t) => {
  const am = genAM();
  am.setAttribute("aaa", "hoge");
  t.truthy(am.getAttribute("aaa").Value === "hoge");
  am.addAttribute(genAttr(ns1));
  t.throws(() => {
    am.getAttribute("aaa");
  })
});
