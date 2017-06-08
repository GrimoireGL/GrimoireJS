import test from "ava";
import "../AsyncSupport";
import "../XMLDomInit";
import xmldom from "xmldom";
import sinon from "sinon";
import GrimoireInterface from "../../src/Interface/GrimoireInterface";
import Constants from "../../src/Base/Constants";
import Component from "../../src/Node/Component";
import GomlParser from "../../src/Node/GomlParser";
import GomlLoader from "../../src/Node/GomlLoader";
import GomlNode from "../../src/Node/GomlNode";
import NSIdentity from "../../src/Base/NSIdentity";
import Namespace from "../../src/Base/Namespace";
import IdResolver from "../../src/Base/IdResolver";


test("get() works correctly.", t => {
  let r = new IdResolver();
  r.add(NSIdentity.fromFQN("c.b.a"));
  t.truthy(r.get(Namespace.define("a")).length === 1);
  t.truthy(r.get(Namespace.define("b.a")).length === 1);
  t.truthy(r.get(Namespace.define("c.a")).length === 1);
  t.truthy(r.get(Namespace.define("c.b.a")).length === 1);
});

test("Not accept to get invalid name or namespace", (t) => {
  let r = new IdResolver();

  r.add(NSIdentity.fromFQN("a"));
  r = new IdResolver();

  // console.log("a");
  t.truthy(r.add(NSIdentity.fromFQN("a")));
  t.truthy(r.count === 1);
  t.truthy(!r.add(NSIdentity.fromFQN("a")));
  t.truthy(r.count === 1);
  // console.log("f");
  r.add(Namespace.define("z").for("b"));
  r.add(Namespace.define("y.b").hierarchy);
  r.add(NSIdentity.fromFQN("c"));
  t.truthy(r.count === 4);
  t.truthy(r.get(Namespace.define("a")).length === 1);
  t.truthy(r.get(Namespace.define("b")).length === 2);

  let id = NSIdentity.fromFQN("a.b.c");
  t.truthy(id.name === "c");
  t.truthy(id.ns.qualifiedName === "a.b");
  id = NSIdentity.guess("b.c");
  t.truthy(id.fqn === "a.b.c");


});

test("Not accept to get invalid name or namespace", (t) => {
  let r = new IdResolver();
  // console.log(r);
  r.add(NSIdentity.fromFQN("a"));
  r.add(NSIdentity.fromFQN("hoge.b"));
  r.add(NSIdentity.fromFQN("hage.huga.c"));
  r.add(NSIdentity.fromFQN("hage.a"));
  t.truthy(r.get(Namespace.define("a")).length === 2);

});

test("resolve works correctly", (t) => {
  let r = new IdResolver();
  r.add(NSIdentity.fromFQN("hoge.a"));
  r.add(NSIdentity.fromFQN("hoge.b"));
  r.add(NSIdentity.fromFQN("hage.huga.c"));
  r.add(NSIdentity.fromFQN("hage.huga.a"));
  t.truthy(r.get(Namespace.define("a")).length === 2);
  t.truthy(r.get(Namespace.define("b")).length === 1);
  t.truthy(r.resolve(Namespace.define("c")) === "hage.huga.c");

});
