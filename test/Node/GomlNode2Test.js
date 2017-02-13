import '../AsyncSupport';
import '../XMLDomInit'
import test from 'ava';
import sinon from 'sinon';
import xmldom from 'xmldom';
import jsdomAsync from "../JsDOMAsync";
import xhrmock from "xhr-mock";
import _ from "lodash";
import {
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
  testNodeBase,
  conflictNode1,
  conflictNode2,
  conflictComponent1,
  conflictComponent2
} from "./_TestResource/GomlParserTest_Registering";
import GomlLoader from "../../lib-es5/Node/GomlLoader";
import GrimoireInterface from "../../lib-es5/GrimoireInterface";

xhrmock.setup();
xhrmock.get("./GomlNodeTest_Case1.goml", (req, res) => {
  let aa = res.status(200).body(readFile("../../test/Node/_TestResource/GomlNodeTest_Case1.goml"));
  return aa;
});

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

function readFile(path) {
  const fs = require("fs");
  const p = require("path");
  return fs.readFileSync(p.join(__dirname, path), "utf8");
}

test.beforeEach(async() => {
  GrimoireInterface.clear();
  const parser = new DOMParser();
  const htmlDoc = parser.parseFromString(readFile("../../test/Node/_TestResource/GomlNodeTest_Case1.html"), "text/html");
  global.document = htmlDoc;
  global.document.querySelectorAll = function () {
    return global.document.getElementsByTagName("script");
  };
  global.Node = {
    ELEMENT_NODE: 1
  };
  goml();
  testNode1();
  testNode2();
  testNode3();
  testNodeBase();
  conflictNode1();
  conflictNode2();
  stringConverterSpy = stringConverter();
  testComponent1Spy = testComponent1();
  testComponent2Spy = testComponent2();
  testComponent3Spy = testComponent3();
  testComponentBaseSpy = testComponentBase();
  testComponentOptionalSpy = testComponentOptional();
  conflictComponent1Spy = conflictComponent1();
  conflictComponent2Spy = conflictComponent2();
  await GomlLoader.loadForPage();
  global.rootNode = _.values(GrimoireInterface.rootNodes)[0];
});

test('Root node must not have parent', (t) => {
  t.truthy(_.isNull(rootNode._parent));
  t.truthy(_.isNull(rootNode.parent));
});

test('Nodes must have companion', (t) => {
  const companion = rootNode.companion;
  t.truthy(companion);
  rootNode.callRecursively((n) => {
    t.truthy(companion === n.companion);
  });
});

test('Nodes must have tree', (t) => {
  const tree = rootNode.tree;
  t.truthy(tree);
  rootNode.callRecursively((n) => {
    t.truthy(tree === n.tree);
  })
});

test('mount should be called in ideal timing', (t) => {
  const testNode3 = rootNode.children[0];
  testNode3.enabled = true;
  const order = [testComponent3Spy, testComponent2Spy, testComponentOptionalSpy, testComponent1Spy];
  sinon.assert.callOrder(testComponent3Spy, testComponent2Spy, testComponentOptionalSpy, testComponent1Spy)
  order.forEach(v => {
    t.truthy(v.getCall(1).args[0] === "mount");
  });
});

test('awake and mount should be called in ideal timing', (t) => {
  const order = [testComponent3Spy, testComponent2Spy, testComponentOptionalSpy, testComponent1Spy];
  order.forEach(v => {
    t.truthy(v.getCall(0).args[0] === "awake");
    t.truthy(v.getCall(1).args[0] === "mount");
  });
});

test('Nodes should be mounted after loading', (t) => {
  t.truthy(rootNode.mounted);
  rootNode.callRecursively((n) => {
    t.truthy(n.mounted);
  });
});
test('attribute default value work correctly1', (t) => {
  t.truthy(rootNode.getAttribute("id") !== void 0);
  t.truthy(rootNode.getAttribute("id") === null);
});

test('attribute watch should work correctly', (t) => {
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
test('attribute watch should work correctly2', (t) => {
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

test('enabled should work correctly', (t) => {
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

test('Broadcast message should call correct order', (t) => {
  sinon.assert.callOrder(testComponent3Spy, testComponent2Spy, testComponentOptionalSpy, testComponent1Spy);
});

test('Broadcast message with range should work correctly', (t) => {
  const testNode3 = rootNode.children[0];
  resetSpies();
  testNode3.enabled = true;
  rootNode.broadcastMessage(1, "onTest");
  sinon.assert.called(testComponent3Spy);
  sinon.assert.notCalled(testComponent2Spy);
  sinon.assert.notCalled(testComponentOptionalSpy);
  sinon.assert.notCalled(testComponent1Spy);
});

test('Broadcast message with enabled should work correctly', (t) => {
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

test('SendMessage should call correct order', (t) => {
  const testNode2 = rootNode.children[0].children[0];
  testNode2.sendMessage("onTest");
  sinon.assert.callOrder(testComponent2Spy, testComponentOptionalSpy);
});

test('Detach node should invoke unmount before detaching', (t) => {
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

test('Remove() should invoke unmount before deleting', (t) => {
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

test('Get component return value correctly', (t) => {
  const testNode2 = rootNode.children[0].children[0];
  t.truthy(!testNode2.getComponent("TestComponent1"));
  t.truthy(testNode2.getComponent("TestComponent2")); // Must check actually the instance being same.
});

test('broadcastMessage should not invoke message if the component is not enabled', (t) => {
  const testNode3 = rootNode.children[0];
  testNode3.enabled = true;
  resetSpies();
  const optionalComponent = rootNode.children[0].children[0].getComponent("TestComponentOptional");
  optionalComponent.enabled = false;
  rootNode.broadcastMessage("onTest");
  const called = [testComponent3Spy, testComponent2Spy, testComponent1Spy];
  sinon.assert.callOrder.apply(sinon.assert, called);
  sinon.assert.notCalled(testComponentOptionalSpy);
});

test('broadcastMessage should not invoke message if the node is not enabled', (t) => {
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

test('class attribute can be obatined as default', (t) => {
  const testNode3 = rootNode.children[0];
  var classes = testNode3.getAttribute("class");
  t.truthy(classes.length === 1);
  t.truthy(classes[0] === "classTest");
});

test('id attribute can be obatined as default', (t) => {
  const testNode3 = rootNode.children[0];
  t.truthy(testNode3.getAttribute("id") === "test");
});

test('enabled attribute can be obatined as default', (t) => {
  const testNode3 = rootNode.children[0];
  t.truthy(testNode3.getAttribute("enabled") === false);
});

test('id attribute should sync with element', (t) => {
  const testNode3 = rootNode.children[0];
  const id = testNode3.getAttribute("id");
  testNode3.setAttribute("id", "test2");
  t.truthy(testNode3.element.id === "test2");
});

test('class attribute should sync with element', (t) => {
  const testNode3 = rootNode.children[0];
  testNode3.setAttribute("class", "test");
  t.truthy(testNode3.element.className === "test");
});

test('addComponent should work correctly', (t) => {
  const testNode3 = rootNode.children[0];
  testNode3.addComponent("TestComponentOptional");
  t.truthy(testNode3.getComponent("TestComponentOptional"));
});
test('addNode works correctly', (t) => {
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
  t.truthy(child.getComponent("GrimoireComponent").getAttribute("id") === "idtest");
});

test('null should be "" as id and classname', (t) => {
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
  t.truthy(child.getComponent("GrimoireComponent").getAttribute("id") === null);
  t.truthy(child.getAttribute("class") === null);
  t.truthy(child.element.className === "");
  t.truthy(child.getComponent("GrimoireComponent").getAttribute("class") === null);
});

// test("getComponentsInChildren",t=>{
//   GrimoireInterface("")
// });
