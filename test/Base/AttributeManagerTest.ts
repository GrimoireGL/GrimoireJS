import "../XMLDomInit";
import test from "ava";
import Ensure from "../../src/Base/Ensure";
import GrimoireInterface from "../../src/Interface/GrimoireInterface";
import NSDictionary from "../../src/Base/NSDictionary";
import AttributeManager from "../../src/Base/AttributeManager";
import NSIdentity from "../../src/Base/NSIdentity";
import Constants from "../../src/Base/Constants";
import Attribute from "../../src/Node/Attribute";
import sinon from "sinon";

const genAttr: (name: NSIdentity, watch?: Function | undefined) => Attribute = (name, watch) => {
  return { name: name, watch: watch, Value: "value of " + name } as Attribute;
};

const ns1 = NSIdentity.fromFQN("aaa");
const ns2 = NSIdentity.fromFQN("ns.bbb");
const ns3 = NSIdentity.fromFQN("ns.hoge.ccc");

const genAM = () => {
  const am = new AttributeManager("tag");
  am.addAttribute(genAttr(ns1, new Function()));
  am.addAttribute(genAttr(ns2, new Function()));
  am.addAttribute(genAttr(ns3, new Function()));
  return am;
};

test("test", (t) => {
  const am = genAM();
  let count = 0;
  for (let key in am["_attributesFQNMap"]) {
    count += am["_attributesFQNMap"][key].length;
  }
  t.truthy(count === 3);
  t.truthy(!!am.getAttribute(ns1.name));
});

test("test addAttribute", (t) => {
  const am = genAM();
  let l = 0;
  for (let key in am["_attributesFQNMap"]) {
    l += am["_attributesFQNMap"][key].length;
  }
  am.addAttribute(genAttr(ns1));
  let count = 0;
  for (let key in am["_attributesFQNMap"]) {
    count += am["_attributesFQNMap"][key].length;
  }
  t.truthy(count === l + 1);
  am.addAttribute(genAttr(ns1));
  count = 0;
  for (let key in am["_attributesFQNMap"]) {
    count += am["_attributesFQNMap"][key].length;
  }
  t.truthy(count === l + 2);
});

test("test watch", () => {
  const am = genAM();
  const spy1 = sinon.spy();
  const spy2 = sinon.spy();
  am.addAttribute(genAttr(NSIdentity.fromFQN("hoge.aaa"), () => {
    spy1("watch");
  }));
  am.addAttribute(genAttr(NSIdentity.fromFQN("hoge.aaa"), () => {
    spy2("watch");
  }));
  am.watch(NSIdentity.guess("hoge.aaa"), (a, b, c) => { /*do nothing*/ });
  sinon.assert.called(spy1);
  sinon.assert.called(spy2);
});

test("test set/getAttribute", (t) => {
  const am = genAM();
  am.setAttribute("aaa", "hoge");
  t.truthy(am.getAttribute("aaa") === "hoge");
  am.addAttribute(genAttr(NSIdentity.fromFQN("hoge.aaa")));
  t.throws(() => {
    am.getAttribute("aaa");
  });
});
