import test from "ava";
require("babel-polyfill");
import xmldom from "xmldom";
import sinon from "sinon";
import GrimoireInterface from "../../src/Core/GrimoireInterface";
import Constants from "../../src/Tools/Constants";
import Component from "../../src/Core/Component";
import GomlParser from "../../src/Core/GomlParser";
import GomlLoader from "../../src/Core/GomlLoader";
import GomlNode from "../../src/Core/GomlNode";
import Namespace from "../../src/Core/Namespace";

test("constructor is works correctly.", (t) => {
  let ns = Namespace.define("a").extend("b");
  t.truthy(ns.qualifiedName === "a.b");
  t.truthy(ns.hierarchy.length === 2);

  ns = Namespace.define("a", "b", "c");
  t.truthy(ns.hierarchy.length === 3);
  t.truthy(ns.qualifiedName === "a.b.c");

  let ns2 = ns.for("name");
  t.truthy(ns2.fqn === "a.b.c.name");
});
