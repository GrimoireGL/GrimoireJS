import Identity from "../../src/Core/Identity";
import test from "ava";
import TestEnvManager from "../TestEnvManager";


TestEnvManager.init();

test.beforeEach(() => {
  Identity.clear();
});

test("generate instance works correctly", t => {
  let inst = Identity.fromFQN("hoge");
  t.truthy(inst.fqn === "hoge");
  t.truthy(Identity.fromFQN("hoge") === inst); // instance is singleton for same fqn.
});

test("Not accept to get invalid name or namespace", (t) => {
  Identity.fromFQN("hoge");
  Identity.fromFQN("other.a.hoge");
  Identity.fromFQN("other.b.hoge");
  Identity.fromFQN("a.b");
  t.throws(() => {
    Identity.guess("aaa"); // not found
  });
  t.throws(() => {
    Identity.guess("b", "a"); // not found
  });
  t.throws(() => {
    Identity.guess("Wrongamespace", "WrongName"); // not found
  });

  t.truthy(Identity.guess("hoge").fqn === "hoge"); // ok because strict fqn match.
  t.truthy(Identity.guess("a", "b").fqn === "a.b");
  t.truthy(Identity.guess("b").fqn === "a.b");

  t.throws(() => {
    Identity.guess("a"); // not name
  });
  t.throws(() => {
    let a = Identity.guess("other.hoge"); // ambiguous
    console.log(a);
  });
  t.truthy(Identity.guess("a.hoge").fqn === "other.a.hoge");
});

test("Transform name and ns correctly", (t) => {
  const i = Identity.fromFQN("ns.ns1.Sample");
  t.truthy(i.name === "Sample");
  t.truthy(i.ns.qualifiedName === "ns.ns1");
});

test("isMatch works correctly", t => {
  let hoge = Identity.fromFQN("a.b.c");
  t.truthy(hoge.isMatch("c"));
  t.truthy(hoge.isMatch("b.c"));
  t.truthy(hoge.isMatch("a.c"));
  t.truthy(hoge.isMatch("a.b.c"));
  t.truthy(!hoge.isMatch("c.c"));
  t.truthy(!hoge.isMatch("b.a.c"));
  t.truthy(!hoge.isMatch("b"));
  t.truthy(!hoge.isMatch("d"));
  t.truthy(!hoge.isMatch("a.d"));
});
