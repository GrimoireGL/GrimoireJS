import test from "ava";
import { assert, spy as sinonSpy } from "sinon";
import { StandardAttribute } from "../../src/Core/Attribute";
import AttributeManager from "../../src/Core/AttributeManager";
import Identity from "../../src/Core/Identity";
import TestEnvManager from "../TestEnvManager";

TestEnvManager.init();

const genAttr: (identity: Identity, watch?: Function | undefined) => StandardAttribute = (identity, watch) => {
  return { identity, watch, Value: "value of " + identity } as StandardAttribute;
};

const ns1 = Identity.fromFQN("aaa");
const ns2 = Identity.fromFQN("ns.bbb");
const ns3 = Identity.fromFQN("ns.hoge.ccc");

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
  for (const key in am["_attributesFQNMap"]) {
    count += am["_attributesFQNMap"][key].length;
  }
  t.truthy(count === 3);
  t.truthy(!!am.getAttribute(ns1.name));
});

test("simple addAttribute should works correctly", (t) => {
  const am = genAM();
  let l = 0;
  for (const key in am["_attributesFQNMap"]) {
    l += am["_attributesFQNMap"][key].length;
  }
  am.addAttribute(genAttr(ns1));
  let count = 0;
  for (const key in am["_attributesFQNMap"]) {
    count += am["_attributesFQNMap"][key].length;
  }
  t.truthy(count === l + 1);
  am.addAttribute(genAttr(ns1));
  count = 0;
  for (const key in am["_attributesFQNMap"]) {
    count += am["_attributesFQNMap"][key].length;
  }
  t.truthy(count === l + 2);
});

test("addAttribute with value/watch buffers should works correctly", (t) => {
  const fqn = "notregisterd.fqn.hoge";
  const am = genAM();
  am.setAttribute(fqn, "hogehoge");
  t.truthy(am.getAttribute(fqn) === "hogehoge");
  const attr = genAttr(Identity.fromFQN(fqn));
  am.addAttribute(attr);
  t.truthy(am.getAttribute(fqn) === "hogehoge");
  t.truthy(attr.Value === "hogehoge");

  const fqn2 = "notregisterd.fqn.hoge2";
  const spy = sinonSpy();
  const attrRaw = new StandardAttribute();
  attrRaw.identity = Identity.fromFQN(fqn2);
  attrRaw.component = { isActive: true } as any;
  attrRaw.converter = { convert: x => x } as any;
  am.watch(fqn2, (n, o, a) => {
    spy(n, o, a);
  });

  am.setAttribute(attrRaw.identity.fqn, "not called");
  t.truthy(!spy.called);
  am.addAttribute(attrRaw);
  am.setAttribute(attrRaw.identity.fqn, "called");

  t.truthy("not called" === spy.args[0][0]);
  t.truthy(undefined === spy.args[0][1]);
  t.truthy(attrRaw === spy.args[0][2]);

  t.truthy("called" === spy.args[1][0]);
  t.truthy("not called" === spy.args[1][1]);
  t.truthy(attrRaw === spy.args[1][2]);
});

test("watch should works correctly", () => {
  const am = genAM();
  const spy1 = sinonSpy();
  const spy2 = sinonSpy();
  const notCalledSpy = sinonSpy();
  am.addAttribute(genAttr(Identity.fromFQN("hoge.aaa"), () => {
    spy1("watch");
  }));
  am.addAttribute(genAttr(Identity.fromFQN("hoge.aaa"), () => {
    spy2("watch");
  }));
  am.addAttribute(genAttr(Identity.fromFQN("hoge.bbbbbb"), () => {
    notCalledSpy("watch");
  }));
  am.watch(Identity.guess("hoge.aaa"), (a, b, c) => { /*do nothing*/ });
  assert.called(spy1);
  assert.called(spy2);
  assert.notCalled(notCalledSpy);
});

test("set/getAttribute should works correctly", (t) => {
  const am = genAM();
  am.setAttribute("aaa", "hoge");
  t.truthy(am.getAttribute("aaa") === "hoge");
  am.addAttribute(genAttr(Identity.fromFQN("hoge.aaa")));
  t.throws(() => {
    am.getAttribute("aaa"); // ambiguous
  });
  t.throws(() => {
    am.getAttribute("notexists"); // not found
  });
});
