import test from "ava";
import Component from "../../src/Core/Component";
import Constants from "../../src/Core/Constants";
import GomlLoader from "../../src/Core/GomlLoader";
import GomlNode from "../../src/Core/GomlNode";
import GomlParser from "../../src/Core/GomlParser";
import GrimoireInterface from "../../src/Core/GrimoireInterface";
import Namespace from "../../src/Core/Namespace";
import TestEnvManager from "../TestEnvManager";

TestEnvManager.init();

test("define/for function works correctly.", (t) => {
  const g = Namespace.define("grimoire");
  t.truthy(g.for("test").fqn === "grimoire.test");
});

test("constructor is works correctly.", t => {
  let ns = Namespace.define("a").extend("b");
  t.truthy(ns.qualifiedName === "a.b");
  t.truthy(ns.hierarchy.length === 2);

  ns = Namespace.define("a", "b", "c");
  t.truthy(ns.hierarchy.length === 3);
  t.truthy(ns.qualifiedName === "a.b.c");

  const ns2 = ns.for("name");
  t.truthy(ns2.fqn === "a.b.c.name");
});

test("check some edge cases.", t => {
  const edgeTestCase = [
    [Namespace.define("a").extend("b"), "a.b"],
    [Namespace.define("a.b"), "a.b"],
    [Namespace.define(""), ""],
    [Namespace.define("a"), "a"],
    [Namespace.define("").extend(""), ""],
    [Namespace.define("a").extend(""), "a"],
    [Namespace.define("").extend("a"), "a"],
    [Namespace.define("a.b").extend("c.d"), "a.b.c.d"],
  ];

  edgeTestCase.forEach(element => {
    const ns = element[0] as Namespace;
    const expected = element[1];
    t.truthy(ns.qualifiedName === expected);
  });
  for (let i = 0; i < edgeTestCase.length; i++) {
    const element = edgeTestCase[i];
    const ns = element[0] as Namespace;
    const expected = element[1];
    t.truthy(ns.qualifiedName === expected, "$testcase: {i}");
  }

  const raiseExceptionTestCase = [
    () => Namespace.define(null),
    () => Namespace.define("a").extend(null),
    () => Namespace.define("a").for(null),
  ];

  for (let i = 0; i < raiseExceptionTestCase.length; i++) {
    t.throws(() => {
      raiseExceptionTestCase[i]();
    });
  }
});
