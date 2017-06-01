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

// import NSIdentity from '../../lib-es5/Base/NSIdentity';
import Namespace from '../../lib-es5/Base/Namespace';
// import Constants from '../../lib-es5/Base/Constants';

test('constructor is works correctly.', (t) => {
  let ns = Namespace.define("a").extend("b");
  t.truthy(ns.qualifiedName === "a.b");
  t.truthy(ns.hierarchy.length === 2);

  ns = Namespace.define("a", "b", "c");
  t.truthy(ns.hierarchy.length === 3);
  t.truthy(ns.qualifiedName === "a.b.c");

  ns = ns.for("name");
  t.truthy(ns.fqn === "a.b.c.name");
});
