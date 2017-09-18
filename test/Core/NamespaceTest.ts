require("babel-polyfill");
import test from "ava";
import sinon from "sinon";
import GrimoireInterface from "../../src/Core/GrimoireInterface";
import Constants from "../../src/Tools/Constants";
import Component from "../../src/Core/Component";
import GomlParser from "../../src/Core/GomlParser";
import GomlLoader from "../../src/Core/GomlLoader";
import GomlNode from "../../src/Core/GomlNode";
import Namespace from "../../src/Core/Namespace";

test("define/for function works correctly.", (t) => { // TODO test
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

  let ns2 = ns.for("name");
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
    let ns = element[0] as Namespace;
    let expected = element[1];
    t.truthy(ns.qualifiedName === expected);
  });
  for (let i = 0; i < edgeTestCase.length; i++) {
    let element = edgeTestCase[i];
    let ns = element[0] as Namespace;
    let expected = element[1];
    t.truthy(ns.qualifiedName === expected, `$testcase: {i}`);
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
