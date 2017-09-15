import test from "ava";
import "../AsyncSupport";
import "../XMLDomInit";
import xmldom from "xmldom";
import sinon from "sinon";
import GrimoireInterface from "../../src/Interface/GrimoireInterface";
import Constants from "../../src/Base/Constants";
import Component from "../../src/Core/Component";
import GomlParser from "../../src/Core/GomlParser";
import GomlLoader from "../../src/Core/GomlLoader";
import GomlNode from "../../src/Core/GomlNode";

import NSIdentity from "../../src/Base/NSIdentity";

test.beforeEach(() => {
  NSIdentity.clear();
});

test("Not accept to get invalid name or namespace", (t) => {
  NSIdentity.fromFQN("hoge");
  NSIdentity.fromFQN("a.b");
  t.throws(() => {
    NSIdentity.guess("aaa");
  });
  t.throws(() => {
    NSIdentity.guess("b", "a");
  });
  t.throws(() => {
    NSIdentity.guess("Wrongamespace", "WrongName");
  });
  t.notThrows(() => {
    NSIdentity.guess("hoge");
  });
  t.notThrows(() => {
    NSIdentity.guess("a", "b");
  });
  t.notThrows(() => {
    NSIdentity.guess("b");
  });
});

test("Transform name and ns correctly", (t) => {
  const i = NSIdentity.fromFQN("ns.Sample");
  t.truthy(i.name === "Sample");
  t.truthy(i.ns.qualifiedName === "ns");
});

test("isMatch works correctly", t => {
  let hoge = NSIdentity.fromFQN("a.b.c");
  t.truthy(hoge.isMatch("c"));
  t.truthy(hoge.isMatch("b.c"));
  t.truthy(hoge.isMatch("a.c"));
  t.truthy(hoge.isMatch("a.b.c"));
  t.truthy(!hoge.isMatch("c.c"));
  t.truthy(!hoge.isMatch("b.a.c"));
  t.truthy(!hoge.isMatch("d"));
  t.truthy(!hoge.isMatch("a.d"));
});
