import '../AsyncSupport';
import '../XMLDomInit';
import xmldom from 'xmldom';
import test from 'ava';
import sinon from 'sinon';
import GrimoireInterface from "../../lib-es5/GrimoireInterface";
import Constants from "../../lib-es5/Base/Constants";
import Component from "../../lib-es5/Node/Component";
import jsdomAsync from "../JsDOMAsync";
import GomlParser from "../../lib-es5/Node/GomlParser";
import GomlLoader from "../../lib-es5/Node/GomlLoader";
import NSIdentity from "../../lib-es5/Base/NSIdentity";
import GomlNode from "../../lib-es5/Node/GomlNode";

global.Node = {
  ELEMENT_NODE: 1
};

test.beforeEach(() => {
  GrimoireInterface.clear();
  const parser = new DOMParser();
  const htmlDoc = parser.parseFromString("<html></html>", "text/html");
  global.document = htmlDoc;
  GrimoireInterface.registerNode("goml");
  GrimoireInterface.registerNode("scenes");
  GrimoireInterface.registerNode("scene")
});

test("addChild method works correctly", t => {
  const node = new GomlNode(GrimoireInterface.nodeDeclarations.get("goml"), null);
  const node2 = new GomlNode(GrimoireInterface.nodeDeclarations.get("scenes"), null);
  node.addChild(node2, null, null);
  node.addChild(node2, null, null);
  t.truthy(node.children[0].id === node2.id);
  t.truthy(node.children.length === 2);
});

test("delete method works correctly", t => {
  const node = new GomlNode(GrimoireInterface.nodeDeclarations.get("goml"), null);
  const node2 = new GomlNode(GrimoireInterface.nodeDeclarations.get("scenes"), null);
  const node3 = new GomlNode(GrimoireInterface.nodeDeclarations.get("scene"), null);
  node.addChild(node2, null, null);
  node2.addChild(node3, null, null);
  node2.delete();
  t.truthy(node.children.length === 0);
  t.truthy(node2.parent === null);
  t.truthy(node2.deleted === true);
  t.truthy(node3.deleted === true);
  t.truthy(node3.parent === null);
});

test("removeChild method works correctly", t => {
  const node = new GomlNode(GrimoireInterface.nodeDeclarations.get("goml"), null);
  const node2 = new GomlNode(GrimoireInterface.nodeDeclarations.get("scenes"), null);
  const node3 = new GomlNode(GrimoireInterface.nodeDeclarations.get("scene"), null);
  node.addChild(node2, null, null);
  node2.addChild(node3, null, null);
  node.removeChild(node2);
  t.truthy(node2.deleted === true);
  t.truthy(node3.deleted === true);
});

test("detachChild method works correctly", t => {
  const node = new GomlNode(GrimoireInterface.nodeDeclarations.get("goml"), null);
  const node2 = new GomlNode(GrimoireInterface.nodeDeclarations.get("scenes"), null);
  const node3 = new GomlNode(GrimoireInterface.nodeDeclarations.get("scene"), null);
  node.addChild(node2, null, null);
  node2.addChild(node3, null, null);
  node.detachChild(node2);
  t.truthy(node.children.length === 0);
  t.truthy(node2.deleted === false);
  t.truthy(node3.parent.id === node2.id);
  t.truthy(node3.deleted === false);
});

test("detach method works correctly", t => {
  const node = new GomlNode(GrimoireInterface.nodeDeclarations.get("goml"), null);
  const node2 = new GomlNode(GrimoireInterface.nodeDeclarations.get("scenes"), null);
  const node3 = new GomlNode(GrimoireInterface.nodeDeclarations.get("scene"), null);
  node.addChild(node2, null, null);
  node2.addChild(node3, null, null);
  node2.detach();
  try {
    node.detach()
  } catch (err) {
    t.truthy(err.message === "root Node cannot be detached.");
  }
  t.truthy(node.children.length === 0);
  t.truthy(node2.deleted === false);
  t.truthy(node3.parent.id === node2.id);
  t.truthy(node3.deleted === false);
});

test("attr method works correctly", t => {
  const node = new GomlNode(GrimoireInterface.nodeDeclarations.get("goml"), null);
  t.truthy(false);
});

test("addAttribute method works correctly", t => {
  const node = new GomlNode(GrimoireInterface.nodeDeclarations.get("goml"), null);
  t.truthy(false);
});

test("getComponents method works correctly", t => {
  GrimoireInterface.registerComponent("testComponent", {
    attr1: "testAttr"
  });
  GrimoireInterface.registerNode("testNode", ["testComponent"]);
  const node = new GomlNode(GrimoireInterface.nodeDeclarations.get("testNode"), null);
  const components = node.getComponents();
  t.truthy(components.length === 1);
  t.truthy(node._components[0].id === components[0].id);
});
test("getComponent method works correctly", t => {
  GrimoireInterface.registerComponent("testComponent", {
    attr1: "testAttr"
  });
  GrimoireInterface.registerComponent("testComponent2", {
    attr2: "testAttr2"
  });
  GrimoireInterface.registerNode("testNode", ["testComponent", "testComponent2"]);
  const node = new GomlNode(GrimoireInterface.nodeDeclarations.get("testNode"), null);
  const component2 = node.getComponent("testComponent2");
  t.truthy(component2.name.name === "TESTCOMPONENT2");
  const component = node.getComponent("testComponent");
  t.truthy(component.name.name === "TESTCOMPONENT");
});
test("setMounted method works correctly", t => {
  const node = new GomlNode(GrimoireInterface.nodeDeclarations.get("goml"), null);
  const node2 = new GomlNode(GrimoireInterface.nodeDeclarations.get("scenes"), null);
  const node3 = new GomlNode(GrimoireInterface.nodeDeclarations.get("scene"), null);
  node.addChild(node2, null, null);
  node2.addChild(node3, null, null);
  node.setMounted(true);
  t.truthy(node.mounted === true);
  t.truthy(node2.mounted === true);
  t.truthy(node3.mounted === true);
});
test("index method works correctly", t => {
  const node = new GomlNode(GrimoireInterface.nodeDeclarations.get("goml"), null);
  const node2 = new GomlNode(GrimoireInterface.nodeDeclarations.get("scenes"), null);
  node.addChild(node2, null, null);
  t.truthy(node2.index() === 0);
});