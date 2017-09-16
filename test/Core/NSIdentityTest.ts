require("babel-polyfill");
import test from "ava";
import sinon from "sinon";
import NSIdentity from "../../src/Core/NSIdentity";

test.beforeEach(() => {
  NSIdentity.clear();
});

test("generate instance works correctly", t => {
  let inst = NSIdentity.fromFQN("hoge");
  t.truthy(inst.fqn === "hoge");
  t.truthy(NSIdentity.fromFQN("hoge") === inst); // instance is singleton for same fqn.
});

test("Not accept to get invalid name or namespace", (t) => {
  NSIdentity.fromFQN("hoge");
  NSIdentity.fromFQN("other.a.hoge");
  NSIdentity.fromFQN("other.b.hoge");
  NSIdentity.fromFQN("a.b");
  t.throws(() => {
    NSIdentity.guess("aaa"); // not found
  });
  t.throws(() => {
    NSIdentity.guess("b", "a"); // not found
  });
  t.throws(() => {
    NSIdentity.guess("Wrongamespace", "WrongName"); // not found
  });

  t.truthy(NSIdentity.guess("hoge").fqn === "hoge"); // ok because strict fqn match.
  t.truthy(NSIdentity.guess("a", "b").fqn === "a.b");
  t.truthy(NSIdentity.guess("b").fqn === "a.b");

  t.throws(() => {
    NSIdentity.guess("a"); // not name
  });
  t.throws(() => {
    let a = NSIdentity.guess("other.hoge"); // ambiguous
    console.log(a);
  });
  t.truthy(NSIdentity.guess("a.hoge").fqn === "other.a.hoge");
});

test("Transform name and ns correctly", (t) => {
  const i = NSIdentity.fromFQN("ns.ns1.Sample");
  t.truthy(i.name === "Sample");
  t.truthy(i.ns.qualifiedName === "ns.ns1");
});

test("isMatch works correctly", t => {
  let hoge = NSIdentity.fromFQN("a.b.c");
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
