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
import Namespace from "../../src/Base/Namespace";

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
