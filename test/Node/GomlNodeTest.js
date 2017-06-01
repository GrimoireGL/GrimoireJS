import '../AsyncSupport';
import '../XMLDomInit';
import xmldom from 'xmldom';
import test from 'ava';
import sinon from 'sinon';
import GrimoireInterface from "../../lib-es5/Interface/GrimoireInterface";
import Constants from "../../lib-es5/Base/Constants";
import Component from "../../lib-es5/Node/Component";
import jsdomAsync from "../JsDOMAsync";
import GomlParser from "../../lib-es5/Node/GomlParser";
import GomlLoader from "../../lib-es5/Node/GomlLoader";
import NSIdentity from "../../lib-es5/Base/NSIdentity";
import GomlNode from "../../lib-es5/Node/GomlNode";
import Attribute from "../../lib-es5/Node/Attribute";

global.Node = {
  ELEMENT_NODE: 1
};

test.beforeEach(async() => {
  GrimoireInterface.clear();
  const parser = new DOMParser();
  const htmlDoc = parser.parseFromString("<html></html>", "text/html");
  global.document = htmlDoc;
  GrimoireInterface.registerNode("goml");
  GrimoireInterface.registerNode("scenes");
  GrimoireInterface.registerNode("scene");
  await GrimoireInterface.resolvePlugins();
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
  node2.remove();
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

test("getComponents method works correctly", t => {
  GrimoireInterface.registerComponent("TestComponent", {
    attributes: {
      attr1: {
        converter: "String",
        default: "testAttr"
      }
    }

  });
  GrimoireInterface.registerNode("test-node", ["TestComponent"]);
  const node = new GomlNode(GrimoireInterface.nodeDeclarations.get("test-node"), null);
  const components = node.getComponents();
  t.truthy(components.length === 2);
  t.truthy(node._components[0].id === components[0].id);
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
  node.addChild(node2);
  t.truthy(node2.index === 0);
});
test("addComponent method works correctly", t => {
  const node = new GomlNode(GrimoireInterface.nodeDeclarations.get("goml"), null);
  const node2 = new GomlNode(GrimoireInterface.nodeDeclarations.get("scenes"), null);
  node.addChild(node2, null, null);
  GrimoireInterface.registerComponent("TestComponent1", {
    attributes: {
      testAttr1: {
        converter: "String",
        default: "thisistest"
      }
    }
  });
  const component = GrimoireInterface.componentDeclarations.get("TestComponent1").generateInstance();
  node._addComponentDirectly(component, true);
  const components = node.getComponents();
  t.truthy(components.length == 2);
  t.truthy(components[1].name.name == "TestComponent1");
  t.truthy(component.isDefaultComponent)
});
test("addComponent method works correctly", t => {
  const node = new GomlNode(GrimoireInterface.nodeDeclarations.get("goml"), null);
  const node2 = new GomlNode(GrimoireInterface.nodeDeclarations.get("scenes"), null);
  node.addChild(node2, null, null);
  GrimoireInterface.registerComponent("TestComponent1", {
    attributes: {
      testAttr1: {
        converter: "String",
        default: "thisistest"
      }
    }
  });
  const component = node.addComponent("TestComponent1", { testAttr1: "testValue" });
  const components = node.getComponents();
  t.truthy(components.length == 2);
  t.truthy(components[1].name.name == "TestComponent1");
  t.truthy(components[1].getAttribute("testAttr1") == "testValue");
  t.truthy(component.isDefaultComponent === false);
});
test("getComponent method overload works correctly", async t => {
  const node = new GomlNode(GrimoireInterface.nodeDeclarations.get("goml"), null);
  const node2 = new GomlNode(GrimoireInterface.nodeDeclarations.get("scenes"), null);
  node.addChild(node2, null, null);
  GrimoireInterface.registerComponent("TestComponent1", {
    attributes: {
      testAttr1: {
        converter: "String",
        default: "thisistest"
      }
    }
  });
  GrimoireInterface.registerComponent("TestComponent2", {
    attributes: {
      testAttr1: {
        converter: "String",
        default: "thisistest"
      }
    }
  }, "TestComponent1");
  await GrimoireInterface.resolvePlugins();

  node.addComponent("TestComponent2");
  t.truthy(node.getComponent("TestComponent2").name.name == "TestComponent2");
  t.truthy(node.getComponent("TestComponent1").name.name == "TestComponent2");
});
test("getComponents method overload works correctly", t => {
  const node = new GomlNode(GrimoireInterface.nodeDeclarations.get("goml"), null);
  const node2 = new GomlNode(GrimoireInterface.nodeDeclarations.get("scenes"), null);
  node.addChild(node2, null, null);
  GrimoireInterface.registerComponent("TestComponent1", {
    attributes: {
      testAttr1: {
        converter: "String",
        default: "thisistest"
      }
    }
  });
  GrimoireInterface.registerComponent("TestComponent2", {
    attributes: {
      testAttr1: {
        converter: "String",
        default: "thisistest"
      }
    }
  });
  node.addComponent("TestComponent1");
  node.addComponent("TestComponent2");
  const components = node.getComponents();
  t.truthy(components.length == 3);
});
test("addAttribute method works correctly", t => {
  const node = new GomlNode(GrimoireInterface.nodeDeclarations.get("goml"), null);
  GrimoireInterface.registerComponent("TestComponent1", {
    attributes: {
      testAttr1: {
        converter: "String",
        default: "thisistest"
      }
    }
  });
  const component = GrimoireInterface.componentDeclarations.get("TestComponent1").generateInstance();
  const attr = new Attribute("testAttr", {
    converter: "String",
    default: "thisistest"
  }, component);
});
