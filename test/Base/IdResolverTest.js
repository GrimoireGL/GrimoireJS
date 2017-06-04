import test from 'ava';
import '../AsyncSupport';
import '../XMLDomInit';
import xmldom from 'xmldom';
import sinon from 'sinon';
import GrimoireInterface from "../../lib-es5/Interface/GrimoireInterface";
import Constants from "../../lib-es5/Base/Constants";
import Component from "../../lib-es5/Node/Component";
import jsdomAsync from "../JsDOMAsync";
import GomlParser from "../../lib-es5/Node/GomlParser";
import GomlLoader from "../../lib-es5/Node/GomlLoader";
import GomlNode from "../../lib-es5/Node/GomlNode";

import NSIdentity from '../../lib-es5/Base/NSIdentity';
import Namespace from '../../lib-es5/Base/Namespace';
import IdResolver from '../../lib-es5/Base/IdResolver';
// import Constants from '../../lib-es5/Base/Constants';


test("get() works correctly.", t => {
  let r = new IdResolver();

  r.add(NSIdentity.fromFQN("c.b.a"));
  t.truthy(r.get(Namespace.define("a")).length === 1)
  t.truthy(r.get(Namespace.define("b.a")).length === 1)
  t.truthy(r.get(Namespace.define("c.a")).length === 1)
  t.truthy(r.get(Namespace.define("c.b.a")).length === 1)
})
test('Not accept to get invalid name or namespace', (t) => {
  let r = new IdResolver();

  r.add(NSIdentity.fromFQN("a"));
  r = new IdResolver();

  // console.log("a");
  t.truthy(r.add(NSIdentity.fromFQN("a")));
  t.truthy(r.count == 1);
  t.truthy(!r.add(NSIdentity.fromFQN("a")));
  t.truthy(r.count == 1);
  // console.log("f");
  r.add(Namespace.define("z").for("b"));
  r.add(Namespace.define("y.b").hierarchy);
  r.add(NSIdentity.fromFQN("c"));
  t.truthy(r.count == 4);
  t.truthy(r.get(Namespace.define("a")).length === 1);
  t.truthy(r.get(Namespace.define("b")).length === 2);
  t.throws(() => {
    NSIdentity.from("b.c");
  });

  let id = NSIdentity.fromFQN("a.b.c");
  t.truthy(id.name === "c");
  t.truthy(id.ns.qualifiedName === "a.b");
  id = NSIdentity.guess("b.c");
  t.truthy(id.fqn === "a.b.c");


});

test('Not accept to get invalid name or namespace', (t) => {
  let r = new IdResolver();
  // console.log(r);
  r.add(NSIdentity.fromFQN("a"));
  r.add(NSIdentity.fromFQN("hoge.b"));
  r.add(NSIdentity.fromFQN("hage.huga.c"));
  r.add(NSIdentity.fromFQN("hage.a"));
  t.truthy(r.get(Namespace.define("a")).length === 2)

});

test('resolve works correctly', (t) => {
  let r = new IdResolver();
  r.add(NSIdentity.fromFQN("hoge.a"));
  r.add(NSIdentity.fromFQN("hoge.b"));
  r.add(NSIdentity.fromFQN("hage.huga.c"));
  r.add(NSIdentity.fromFQN("hage.huga.a"));
  t.truthy(r.get(Namespace.define("a")).length === 2);
  t.truthy(r.get(Namespace.define("b")).length === 1);
  t.truthy(r.resolve(Namespace.define("c")) === "hage.huga.c");

});
