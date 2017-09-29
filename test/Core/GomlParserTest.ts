import Environment from "../../src/Core/Environment";
import fs from "../fileHelper";
import GomlParser from "../../src/Core/GomlParser";
import GrimoireInterface from "../../src/Core/GrimoireInterface";
import Namespace from "../../src/Core/Namespace";
import NSIdentity from "../../src/Core/NSIdentity";
import test from "ava";
import TestEnvManager from "../TestEnvManager";
import xmldom from "xmldom";
import { assert, spy } from "sinon";
import {
  conflictComponent1,
  conflictComponent2,
  conflictNode1,
  conflictNode2,
  goml,
  stringConverter,
  testComponent1,
  testComponent2,
  testComponentBase,
  testComponentOptional,
  testNode1,
  testNode2,
  testNodeBase
  } from "../DummyObjectRegisterer";
require("babel-polyfill");

TestEnvManager.init();

declare namespace global {
  let Node: any;
  let document: any;
  let rootNode: any;
}


// Get element from test case source which is located with relative path.
function obtainElementTag(path) {
  const parser = new xmldom.DOMParser();
  return parser.parseFromString(fs.readFile(path), "text/xml").documentElement;
}

let stringConverterSpy,
  testComponent1Spy,
  testComponent2Spy,
  testComponentBaseSpy,
  testComponentOptionalSpy,
  conflictComponent1Spy,
  conflictComponent2Spy;

test.beforeEach(async () => {
  GrimoireInterface.clear();
  const parser = new xmldom.DOMParser();
  const htmlDoc = parser.parseFromString("<html></html>", "text/html");
  Environment.document = htmlDoc;
  goml();
  testNode1();
  testNode2();
  testNodeBase();
  conflictNode1();
  conflictNode2();
  stringConverterSpy = stringConverter();
  testComponent1Spy = testComponent1();
  testComponent2Spy = testComponent2();
  testComponentBaseSpy = testComponentBase();
  testComponentOptionalSpy = testComponentOptional();
  conflictComponent1Spy = conflictComponent1();
  conflictComponent2Spy = conflictComponent2();
  registerUserPlugin();
  await GrimoireInterface.resolvePlugins();
});

const gomlParserTestCasePath1 = "../_TestResource/GomlParserTest_Case1.goml";
const gomlParserTestCasePath2 = "../_TestResource/GomlParserTest_Case2.goml";
const gomlParserTestCasePath3 = "../_TestResource/GomlParserTest_Case3.goml";
const gomlParserTestCasePath4 = "../_TestResource/GomlParserTest_Case4.goml";


function registerUserPlugin() {
  GrimoireInterface.registerNode("scenes");
  GrimoireInterface.registerNode("scene");
}

test("aaa", t => {
  GrimoireInterface.nodeDeclarations.forEach(nm => {
    t.truthy(nm.resolvedDependency);
  });
});
test("bbb", async t => {
  await GrimoireInterface.resolvePlugins();
  GrimoireInterface.nodeDeclarations.forEach(nm => {
    t.truthy(nm.resolvedDependency);
  });
});

test("test for parsing node hierarchy.", (t) => {
  const element = obtainElementTag(gomlParserTestCasePath1);
  const node = GomlParser.parse(element);
  t.truthy(node.parent === null);
  t.truthy(node.children.length === 1);
  const c = node.children[0];
  t.truthy(c.parent === node);
  t.truthy(c.children.length === 2);
  t.truthy(c.children[0].children.length === 0);
  t.truthy(c.children[0].parent === c);
  t.truthy(c.children[1].children.length === 0);
  t.truthy(c.children[1].parent === c);
});

test("test for send/broadcastMessage and component Attribute parsing.", (t) => {
  const element = obtainElementTag(gomlParserTestCasePath2);
  const node = GomlParser.parse(element);
  t.truthy(node.parent === null);
  assert.notCalled(stringConverterSpy);
});

test("test for parse user-define component.", (t) => {
  const element = obtainElementTag(gomlParserTestCasePath3);
  const node = GomlParser.parse(element);
  node.setMounted(true);

  t.truthy(node.children.length === 1); // only test-node1
  t.truthy(node.children[0].getAttribute("testAttr1") === "hugahuga"); // goml default
  t.truthy(node.children[0].getAttribute("hoge") === "DEFAULT"); // component default
  t.truthy(node.children[0].children.length === 1);
  t.truthy(node.children[0].children[0].getAttribute("testAttr2") === "123");
  node.broadcastMessage("onTest", "testArg");
  assert.neverCalledWith(testComponent1Spy, "testArg");
  assert.neverCalledWith(testComponent2Spy, "testArg");
  assert.neverCalledWith(testComponentOptionalSpy, "testArg");
  t.truthy("testArg" === testComponentBaseSpy.args[2][1]);
});

test("test for namespace parsing.", (t) => {
  const element = obtainElementTag(gomlParserTestCasePath4);
  const node = GomlParser.parse(element);
  node.setMounted(true);
  node.broadcastMessage("onTest", "testArg");
  assert.calledWith(conflictComponent1Spy, "aaa");
  assert.calledWith(conflictComponent2Spy, "bbb");
});

test("test for companion", (t) => {
  const element = obtainElementTag(gomlParserTestCasePath4);
  const node = GomlParser.parse(element);
  const components = node.children[0].getComponents<any>();
  const ns1 = NSIdentity.fromFQN("test1.ConflictComponent");
  const ns2 = NSIdentity.fromFQN("test2.ConflictComponent");
  const compo1 = components.find((comp) => ns1.fqn === comp.name.fqn);
  const compo2 = components.find((comp) => ns2.fqn === comp.name.fqn);
  t.truthy(compo1.companion === compo2.companion);
});

test("treeInterface must be same if the node is included in same tree", (t) => {
  const element = obtainElementTag(gomlParserTestCasePath4);
  const node = GomlParser.parse(element);
  const original = node["_treeInterface"];
  node.callRecursively(v => {
    t.truthy(original === v["_treeInterface"]);
  });
});
