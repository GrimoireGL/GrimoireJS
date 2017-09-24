import * as _ from "lodash";
import Attribute from "../../src/Core/Attribute";
import Component from "../../src/Core/Component";
import fs from "../fileHelper";
import GomlLoader from "../../src/Core/GomlLoader";
import GomlNode from "../../src/Core/GomlNode";
import GrimoireComponent from "../../src/Components/GrimoireComponent";
import GrimoireInterface from "../../src/Core/GrimoireInterface";
import NSIdentity from "../../src/Core/NSIdentity";
import sinon from "sinon";
import test from "ava";
import TestEnvManager from "../TestEnvManager";
import {
  conflictComponent1,
  conflictComponent2,
  conflictNode1,
  conflictNode2,
  goml,
  stringConverter,
  testComponent1,
  testComponent2,
  testComponent3,
  testComponentBase,
  testComponentOptional,
  testNode1,
  testNode2,
  testNode3,
  testNodeBase
  } from "../DummyObjectRegisterer";

TestEnvManager.init();

const tc1_goml = fs.readFile("../_TestResource/GomlNodeTest_Case1.goml");
const tc1_html = fs.readFile("../_TestResource/GomlNodeTest_Case1.html");

TestEnvManager.mockSetup();
TestEnvManager.mock("./GomlNodeTest_Case1.goml", tc1_goml);

let stringConverterSpy,
  testComponent1Spy,
  testComponent2Spy,
  testComponent3Spy,
  testComponentBaseSpy,
  testComponentOptionalSpy,
  conflictComponent1Spy,
  conflictComponent2Spy;

function resetSpies() {
  stringConverterSpy.reset();
  testComponent1Spy.reset();
  testComponent2Spy.reset();
  testComponent3Spy.reset();
  testComponentBaseSpy.reset();
  testComponentOptionalSpy.reset();
  conflictComponent1Spy.reset();
  conflictComponent2Spy.reset();
}
let rootNode: GomlNode;

test.beforeEach(async () => {
  GrimoireInterface.clear();
  goml();
  testNode1();
  testNode2();
  testNode3();
  testNodeBase();
  conflictNode1();
  conflictNode2();
  const spys: any = {};
  spys.stringConverterSpy = stringConverter();
  spys.testComponent1Spy = testComponent1();
  spys.testComponent2Spy = testComponent2();
  spys.testComponent3Spy = testComponent3();
  spys.testComponentBaseSpy = testComponentBase();
  spys.testComponentOptionalSpy = testComponentOptional();
  spys.conflictComponent1Spy = conflictComponent1();
  spys.conflictComponent2Spy = conflictComponent2();
  await GrimoireInterface.resolvePlugins();
  await TestEnvManager.loadPage(tc1_html);

  stringConverterSpy = spys.stringConverterSpy;
  testComponent1Spy = spys.testComponent1Spy;
  testComponent2Spy = spys.testComponent2Spy;
  testComponentBaseSpy = spys.testComponent3Spy;
  testComponent3Spy = spys.testComponent3Spy;
  testComponentBaseSpy = spys.testComponentBaseSpy;
  testComponentOptionalSpy = spys.testComponentOptionalSpy;
  conflictComponent1Spy = spys.conflictComponent1Spy;
  conflictComponent2Spy = spys.conflictComponent2Spy;
  rootNode = _.values(GrimoireInterface.rootNodes)[0];
});

test("Root node must not have parent", (t) => {
  t.truthy(_.isNull(rootNode.parent));
});

test("Nodes must have companion", (t) => {
  const companion = rootNode.companion;
  t.truthy(companion);
  rootNode.callRecursively((n) => {
    t.truthy(companion === n.companion);
  });
});

test("Nodes must have tree", (t) => {
  const tree = rootNode.tree;
  t.truthy(tree);
  rootNode.callRecursively((n) => {
    t.truthy(tree === n.tree);
  });
});

test("default value works correctly.", t => {
  const testNode3 = rootNode.children[0]; // test-node3
  const a = testNode3.getAttribute("hoge");
  t.truthy(a === "AAA"); // node default
  const b = testNode3.getAttribute("hogehoge");
  t.truthy(b === "hoge"); //  component default
  t.truthy(testNode3.getAttribute("id") === "test"); // goml default
  t.truthy(testNode3.getAttribute("testAttr3") === "tc2default"); // component default
});

test("mount should be called in ideal timing", (t) => {
  const testNode3 = rootNode.children[0];
  testNode3.enabled = true;
  const order = [testComponent3Spy, testComponent2Spy, testComponentOptionalSpy, testComponent1Spy];
  sinon.assert.callOrder(testComponent3Spy, testComponent2Spy, testComponentOptionalSpy, testComponent1Spy);
  order.forEach(v => {
    t.truthy(v.getCall(1).args[0] === "mount");
  });
});

test("awake and mount should be called in ideal timing", (t) => {
  const order = [testComponent3Spy, testComponent2Spy, testComponentOptionalSpy, testComponent1Spy];
  order.forEach(v => {
    t.truthy(v.getCall(0).args[0] === "awake");
    t.truthy(v.getCall(1).args[0] === "mount");
  });
});

test("Nodes should be mounted after loading", (t) => {
  t.truthy(rootNode.mounted);
  rootNode.callRecursively((n) => {
    t.truthy(n.mounted);
  });
});
test("attribute default value work correctly1", (t) => {
  t.truthy(rootNode.getAttribute("id") !== void 0);
  t.truthy(rootNode.getAttribute("id") === null);
});

test("attribute watch should work correctly", (t) => {
  const idAttr = rootNode.getAttributeRaw("id");
  const spy = sinon.spy();

  const watcher = (newValue, oldValue, attr) => {
    // spy("watch", { newValue: newValue, oldValue: oldValue, attr: attr });
    spy(newValue);
  };
  idAttr.watch(watcher);
  idAttr.Value = "id";
  t.truthy(spy.getCall(0).args[0] === "id");

  spy.reset();
  rootNode.enabled = false;
  idAttr.Value = "id";
  sinon.assert.notCalled(spy);
});
test("attribute watch should work correctly2", (t) => {
  const idAttr = rootNode.getAttributeRaw("id");
  const spy = sinon.spy();
  const watcher = (newValue, oldValue, attr) => {
    // spy("watch", { newValue: newValue, oldValue: oldValue, attr: attr });
    spy(newValue);
  };
  idAttr.watch(watcher);
  idAttr.unwatch(watcher);
  idAttr.Value = "id";
  sinon.assert.notCalled(spy);

  idAttr.watch(watcher, false, true);
  rootNode.enabled = false;
  idAttr.Value = "idid";
  t.truthy(spy.getCall(0).args[0] === "idid");
});

test("enabled should work correctly", (t) => {
  const testNode3 = rootNode.children[0];
  const testNode2 = testNode3.children[0];
  t.truthy(rootNode.enabled);
  t.truthy(rootNode.isActive);
  t.truthy(!testNode3.enabled);
  t.truthy(!testNode3.isActive);
  t.truthy(testNode2.enabled);
  t.truthy(!testNode2.isActive);
  testNode3.enabled = true;
  t.truthy(testNode3.enabled);
  t.truthy(testNode3.isActive);
  t.truthy(testNode2.enabled);
  t.truthy(testNode2.isActive);
  testNode2.enabled = false;
  t.truthy(!testNode2.enabled);
  t.truthy(!testNode2.isActive);
  rootNode.enabled = false;
  t.truthy(!rootNode.enabled);
  t.truthy(!rootNode.isActive);
  t.truthy(testNode3.enabled);
  t.truthy(!testNode3.isActive);
  t.truthy(!testNode2.enabled);
  t.truthy(!testNode2.isActive);
});

test("Broadcast message should call correct order", (t) => {
  sinon.assert.callOrder(testComponent3Spy, testComponent2Spy, testComponentOptionalSpy, testComponent1Spy);
});

test("Broadcast message with range should work correctly", (t) => {
  const testNode3 = rootNode.children[0];
  resetSpies();
  testNode3.enabled = true;
  rootNode.broadcastMessage(1, "onTest");
  sinon.assert.called(testComponent3Spy);
  sinon.assert.notCalled(testComponent2Spy);
  sinon.assert.notCalled(testComponentOptionalSpy);
  sinon.assert.notCalled(testComponent1Spy);
});

test("Broadcast message with enabled should work correctly", (t) => {
  const testNode3 = rootNode.children[0];
  const testNode2 = testNode3.children[0];

  resetSpies();
  sinon.assert.notCalled(testComponent3Spy);
  sinon.assert.notCalled(testComponent2Spy);
  sinon.assert.notCalled(testComponentOptionalSpy);
  sinon.assert.notCalled(testComponent1Spy);

  resetSpies();
  rootNode.broadcastMessage("onTest");
  sinon.assert.notCalled(testComponent3Spy);
  sinon.assert.notCalled(testComponent2Spy);
  sinon.assert.notCalled(testComponentOptionalSpy);
  sinon.assert.notCalled(testComponent1Spy);

  resetSpies();
  testNode3.enabled = true;
  testNode2.enabled = false;
  rootNode.broadcastMessage("onTest");
  sinon.assert.called(testComponent3Spy);
  sinon.assert.notCalled(testComponent2Spy);
  sinon.assert.notCalled(testComponentOptionalSpy);
  sinon.assert.called(testComponent1Spy);

  resetSpies();
  testNode2.enabled = true;
  rootNode.broadcastMessage("onTest");
  sinon.assert.called(testComponent3Spy);
  sinon.assert.called(testComponent2Spy);
  sinon.assert.called(testComponentOptionalSpy);
  sinon.assert.called(testComponent1Spy);
});

test("SendMessage should call correct order", (t) => {
  const testNode2 = rootNode.children[0].children[0];
  testNode2.sendMessage("onTest");
  sinon.assert.callOrder(testComponent2Spy, testComponentOptionalSpy);
});

test("Detach node should invoke unmount before detaching", (t) => {
  const testNode3 = rootNode.children[0];
  testNode3.enabled = true;
  resetSpies();
  testNode3.detach();
  const called = [testComponent2Spy, testComponentOptionalSpy, testComponent1Spy, testComponent3Spy];
  sinon.assert.callOrder.apply(sinon.assert, called);
  called.forEach((v) => {
    t.truthy(v.getCall(0).args[0] === "unmount");
  });
});

test("Remove() should invoke unmount before deleting", (t) => {
  const testNode3 = rootNode.children[0];
  testNode3.enabled = true;
  resetSpies();
  testNode3.remove();
  const called = [testComponent2Spy, testComponentOptionalSpy, testComponent1Spy, testComponent3Spy];
  sinon.assert.callOrder.apply(sinon.assert, called);
  called.forEach((v) => {
    t.truthy(v.getCall(0).args[0] === "unmount");
  });
});

test("Get component return value correctly", (t) => {
  const testNode2 = rootNode.children[0].children[0];
  t.truthy(!testNode2.getComponent("TestComponent1"));
  t.truthy(testNode2.getComponent("TestComponent2")); // Must check actually the instance being same.
});

test("broadcastMessage should not invoke message if the component is not enabled", (t) => {
  const testNode3 = rootNode.children[0];
  testNode3.enabled = true;
  resetSpies();
  const optionalComponent = rootNode.children[0].children[0].getComponent<Component>("TestComponentOptional");
  optionalComponent.enabled = false;
  rootNode.broadcastMessage("onTest");
  const called = [testComponent3Spy, testComponent2Spy, testComponent1Spy];
  sinon.assert.callOrder.apply(sinon.assert, called);
  sinon.assert.notCalled(testComponentOptionalSpy);
});

test("broadcastMessage should not invoke message if the node is not enabled", (t) => {
  const testNode3 = rootNode.children[0];
  testNode3.enabled = true;
  resetSpies();
  const testNode2 = rootNode.children[0].children[0];
  testNode2.enabled = false;
  rootNode.broadcastMessage("onTest");
  const called = [testComponent3Spy, testComponent1Spy];
  sinon.assert.callOrder.apply(sinon.assert, called);
  sinon.assert.notCalled(testComponentOptionalSpy);
  sinon.assert.notCalled(testComponent2Spy);
});

test("class attribute can be obatined as default", (t) => {
  const testNode3 = rootNode.children[0];
  let classes = testNode3.getAttribute("class");
  t.truthy(classes.length === 1);
  t.truthy(classes[0] === "classTest");
});

test("id attribute can be obatined as default", (t) => {
  const testNode3 = rootNode.children[0];
  t.truthy(testNode3.getAttribute("id") === "test");
});

test("enabled attribute can be obatined as default", (t) => {
  const testNode3 = rootNode.children[0];
  t.truthy(testNode3.getAttribute("enabled") === false);
});

test("id attribute should sync with element", (t) => {
  const testNode3 = rootNode.children[0];
  const id = testNode3.getAttribute("id");
  testNode3.setAttribute("id", "test2");
  t.truthy(testNode3.element.id === "test2");
});

test("class attribute should sync with element", (t) => {
  const testNode3 = rootNode.children[0];
  testNode3.setAttribute("class", "test");
  t.truthy(testNode3.element.className === "test");
});

test("addComponent should work correctly", (t) => {
  const testNode3 = rootNode.children[0];
  testNode3.addComponent("TestComponentOptional");
  t.truthy(testNode3.getComponent("TestComponentOptional"));
});

test("get/setAttribute should work correctly 1", t => {
  t.throws(() => {
    // throw error when get attribute for nonexist name.
    rootNode.getAttribute("hoge");
  });
  rootNode.setAttribute("hoge", "hogehoge");
  const att = rootNode.getAttribute("hoge");
  t.truthy(att === "hogehoge");
});

test("get/setAttribute should work correctly 2", t => {
  const c = rootNode.getComponent<Component>("GrimoireComponent");
  (c as any).__addAttribute("hoge", {
    converter: "String",
    default: "aaa"
  });
  const att = rootNode.getAttribute("hoge");
  t.truthy(att === "aaa");
});

test("get/setAttribute should work correctly 3", t => {
  const c = rootNode.getComponent<Component>("GrimoireComponent");
  rootNode.setAttribute("hoge", "bbb");
  (c as any).__addAttribute("hoge", {
    converter: "String",
    default: "aaa"
  });
  const att = rootNode.getAttribute("hoge");
  t.truthy(att === "bbb");
});

test("get/setAttribute should work correctly 4", t => {
  const c = rootNode.getComponent<Component>("GrimoireComponent");
  rootNode.setAttribute("ns1.hoge", "bbb");
  (c as any).__addAttribute("hoge", {
    converter: "String",
    default: "aaa"
  });
  const att = rootNode.getAttribute("hoge");
  t.truthy(att === "aaa");
});

test("attribute buffer is valid only last set value.", t => {
  const c = rootNode.getComponent<Component>("GrimoireComponent");
  rootNode.setAttribute("hoge", "bbb");
  rootNode.setAttribute("ns1.hoge", "ccc");
  (c as any).__addAttribute("ns1.hoge", {
    converter: "String",
    default: "aaa"
  });
  let att = rootNode.getAttribute("ns1.hoge");
  t.truthy(att === "ccc");

  // both buffer are resolved in above __addAttribute.
  (c as any).__addAttribute("hoge", {
    converter: "String",
    default: "aaa"
  });
  att = rootNode.getAttribute(NSIdentity.fromFQN(c.name.fqn + ".hoge"));
  t.truthy(att === "aaa");

  rootNode.setAttribute("ns2.aaa", "1");
  rootNode.setAttribute("aaa", "2");
  rootNode.setAttribute("ns2.aaa", "3");
  (c as any).__addAttribute("ns2.aaa", {
    converter: "String",
    default: "aaa"
  });
  att = rootNode.getAttribute(NSIdentity.fromFQN(c.name.fqn + ".ns2.aaa"));
  t.truthy(att === "3");
});

test("get/setAttribute should work correctly 6", t => {
  const c = rootNode.getComponent<Component>("GrimoireComponent");
  rootNode.setAttribute("ns1.hoge", "bbb");
  rootNode.setAttribute("hoge", "ccc");
  (c as any).__addAttribute("hoge", {
    converter: "String",
    default: "aaa"
  });
  const att = rootNode.getAttribute("hoge");
  t.truthy(att === "ccc");
});

test("get/setAttribute should work correctly 7", t => {
  const c = rootNode.getComponent<Component>("GrimoireComponent");
  (c as any).__addAttribute("ns1.hoge", {
    converter: "String",
    default: "1"
  });
  (c as any).__addAttribute("ns2.hoge", {
    converter: "String",
    default: "2"
  });
  (c as any).__addAttribute("hoge", {
    converter: "String",
    default: "3"
  });
  let att = rootNode.getAttribute("ns1.hoge");
  t.truthy(att === "1");
  t.throws(() => {
    rootNode.getAttribute("hoge"); // ambiguous!
  });
  att = rootNode.getAttribute("ns2.hoge");
  t.truthy(att === "2");
  att = rootNode.getAttribute(NSIdentity.fromFQN(c.name.fqn + ".hoge"));
  t.truthy(att === "3");
});
test("get/setAttribute should work correctly 8", t => {
  const c = rootNode.getComponent<Component>("GrimoireComponent");
  rootNode.setAttribute("hoge", "bbb");
  rootNode.setAttribute("ns2.hoge", "ccc");
  (c as any).__addAttribute("ns1.hoge", { // matchs hoge but not matchs ns2.hoge.
    converter: "String",
    default: "1"
  });
  let att = rootNode.getAttribute("ns1.hoge");
  t.truthy(att === "bbb");

  (c as any).__addAttribute("ns2.hoge", {
    converter: "String",
    default: "2"
  });
  t.throws(() => {
    rootNode.getAttribute("hoge");
  });
  att = rootNode.getAttribute("ns2.hoge");
  t.truthy(att === "ccc");

  (c as any).__addAttribute("hoge", {
    converter: "String",
    default: "3"
  });
  att = rootNode.getAttribute(NSIdentity.fromFQN(c.name.fqn + ".hoge"));
  t.truthy(att === "3");
});

test("addNode works correctly", (t) => {
  const testNode2 = rootNode.children[0].children[0];
  testNode2.addChildByName("test-node2", {
    testAttr2: "ADDEDNODE",
    id: "idtest"
  });
  const child = testNode2.children[0];
  t.truthy(child.name.name === "test-node2");
  t.truthy(child.getAttribute("testAttr2") === "ADDEDNODE");
  t.truthy(child.getAttribute("id") === "idtest");
  t.truthy(child.element.id === "idtest");
  t.truthy(child.getComponent(GrimoireComponent).getAttribute("id") === "idtest");
});

test("null should be \"\" as id and classname", async (t) => {
  const testNode2 = rootNode.children[0].children[0];
  testNode2.addChildByName("test-node2", {
    testAttr2: "ADDEDNODE",
    id: null,
    class: null
  });
  const child = testNode2.children[0];
  t.truthy(child.name.name === "test-node2");
  t.truthy(child.getAttribute("testAttr2") === "ADDEDNODE");
  t.truthy(child.getAttribute("id") === null);
  t.truthy(child.element.id === "");
  t.truthy(child.getComponent(GrimoireComponent).getAttribute("id") === null);
  t.truthy(child.getAttribute("class") === null);
  t.truthy(child.element.className === "");
  t.truthy(child.getComponent(GrimoireComponent).getAttribute("class") === null);
});

test("null should be \"\" as id and classname", async (t) => {
  const testNode2 = rootNode.children[0].children[0];
  testNode2.addChildByName("test-node2", {
    testAttr2: "ADDEDNODE",
    id: null,
    class: null
  });
  const child = testNode2.children[0];
  t.truthy(child.name.name === "test-node2");
  t.truthy(child.getAttribute("testAttr2") === "ADDEDNODE");
  t.truthy(child.getAttribute("id") === null);
  t.truthy(child.element.id === "");
  t.truthy(child.getComponent(GrimoireComponent).getAttribute("id") === null);
  t.truthy(child.getAttribute("class") === null);
  t.truthy(child.element.className === "");
  t.truthy(child.getComponent(GrimoireComponent).getAttribute("class") === null);
});

test("Grimoireinterface should works correctly", t => {
  const gi = GrimoireInterface("*");
  t.truthy(gi.rootNodes.length === 1);
});
