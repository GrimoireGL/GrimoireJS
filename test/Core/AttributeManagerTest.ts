import test from "ava";
import sinon from "sinon";

import Attribute from "../../src/Core/Attribute";
import AttributeManager from "../../src/Core/AttributeManager";
import NSIdentity from "../../src/Core/NSIdentity";


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

test("check init for attribute manager", (t) => {
  const am = genAM();
  let count = 0;
  for (let key in am["_attributesFQNMap"]) {
    count += am["_attributesFQNMap"][key].length;
  }
  t.truthy(count === 3);
  t.truthy(!!am.getAttribute(ns1.name));
});

test("simple addAttribute should works correctly", (t) => {
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

test("addAttribute with value/watch buffers should works correctly", (t) => {
  const fqn = "notregisterd.fqn.hoge";
  const am = genAM();
  am.setAttribute(fqn, "hogehoge");
  t.truthy(am.getAttribute(fqn) === "hogehoge");
  let attr = genAttr(NSIdentity.fromFQN(fqn));
  am.addAttribute(attr);
  t.truthy(am.getAttribute(fqn) === "hogehoge");
  t.truthy(attr.Value === "hogehoge");

  const fqn2 = "notregisterd.fqn.hoge2";
  const spy = sinon.spy();
  const attrRaw = new Attribute();
  attrRaw.name = NSIdentity.fromFQN(fqn2);
  attrRaw.component = { isActive: true } as any;
  attrRaw.converter = { convert: x => x } as any;
  am.watch(fqn2, (n, o, a) => {
    spy(n, o, a);
  });

  am.setAttribute(attrRaw.name.fqn, "not called");
  t.truthy(!sinon.called);
  am.addAttribute(attrRaw);
  am.setAttribute(attrRaw.name.fqn, "called");

  t.truthy("not called" === spy.args[0][0]);
  t.truthy(void 0 === spy.args[0][1]);
  t.truthy(attrRaw === spy.args[0][2]);

  t.truthy("called" === spy.args[1][0]);
  t.truthy("not called" === spy.args[1][1]);
  t.truthy(attrRaw === spy.args[1][2]);
});

test("watch should works correctly", () => {
  const am = genAM();
  const spy1 = sinon.spy();
  const spy2 = sinon.spy();
  const notCalledSpy = sinon.spy();
  am.addAttribute(genAttr(NSIdentity.fromFQN("hoge.aaa"), () => {
    spy1("watch");
  }));
  am.addAttribute(genAttr(NSIdentity.fromFQN("hoge.aaa"), () => {
    spy2("watch");
  }));
  am.addAttribute(genAttr(NSIdentity.fromFQN("hoge.bbbbbb"), () => {
    notCalledSpy("watch");
  }));
  am.watch(NSIdentity.guess("hoge.aaa"), (a, b, c) => { /*do nothing*/ });
  sinon.assert.called(spy1);
  sinon.assert.called(spy2);
  sinon.assert.notCalled(notCalledSpy);
});

test("set/getAttribute should works correctly", (t) => {
  const am = genAM();
  am.setAttribute("aaa", "hoge");
  t.truthy(am.getAttribute("aaa") === "hoge");
  am.addAttribute(genAttr(NSIdentity.fromFQN("hoge.aaa")));
  t.throws(() => {
    am.getAttribute("aaa"); // ambiguous
  });
  t.throws(() => {
    am.getAttribute("notexists"); // not found
  });
});
