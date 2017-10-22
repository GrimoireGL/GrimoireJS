import test from "ava";
import { spy } from "sinon";
import Attribute from "../../src/Core/Attribute";
import Component from "../../src/Core/Component";
import Constants from "../../src/Core/Constants";
import Environment from "../../src/Core/Environment";
import GomlLoader from "../../src/Core/GomlLoader";
import GomlNode from "../../src/Core/GomlNode";
import GomlParser from "../../src/Core/GomlParser";
import GrimoireInterface from "../../src/Core/GrimoireInterface";
import Identity from "../../src/Core/Identity";
import TestEnvManager from "../TestEnvManager";
import TestUtil from "../TestUtil";

TestEnvManager.init();

test.beforeEach(async () => {
  GrimoireInterface.clear();
  TestEnvManager.loadPage("<html></html>");
  GrimoireInterface.registerNode("goml");
  GrimoireInterface.registerNode("scenes");
  GrimoireInterface.registerNode("scene");
  GrimoireInterface.registerComponent({
    componentName: "Test",
    attributes: {},
    valueTest: "Test",
  });
  GrimoireInterface.registerComponent({
    componentName: "Test2",
    attributes: {},
    valueTest: "Test2",
  });
  await GrimoireInterface.resolvePlugins();
});

test("Add component works correctly", t => {
  const node = new GomlNode(GrimoireInterface.nodeDeclarations.get("goml"));
  node.addComponent("Test");
  node.addComponent("Test2");
  node.addComponent("Test");
  t.truthy(node.getComponents("Test").length === 2);
  t.truthy(node.getComponents("Test2").length === 1);
  const a = node.getComponent("Test") as any;
  t.truthy(a.valueTest === "Test");
  const b = node.getComponent("Test2") as any;
  t.truthy(b.valueTest === "Test2");
});

test("Remove component actually delete specified insatnce", t => {
  const node = new GomlNode(GrimoireInterface.nodeDeclarations.get("goml"));
  node.addComponent("Test");
  node.addComponent("Test2");
  node.addComponent("Test");
  const a = node.getComponent("Test") as any;
  node.removeComponent(a);
  t.truthy(node.getComponent("Test"));
  t.truthy(node.getComponents("Test").length === 1);
});

test("Remove components should delete specified all components in node", t => {
  const node = new GomlNode(GrimoireInterface.nodeDeclarations.get("goml"));
  node.addComponent("Test");
  node.addComponent("Test");
  node.addComponent("Test");
  t.truthy(node.getComponents("Test").length === 3);
  node.removeComponents("Test");
  t.truthy(node.getComponents("Test").length === 0);
});

test("addChild method works correctly", t => {
  const node = new GomlNode(GrimoireInterface.nodeDeclarations.get("goml"));
  const node2 = new GomlNode(GrimoireInterface.nodeDeclarations.get("scenes"));
  node.addChild(node2, null);
  node.addChild(node2, null);
  t.truthy(node.children[0].id === node2.id);
  t.truthy(node.children.length === 2);
});

test("delete method works correctly", t => {
  const node = new GomlNode(GrimoireInterface.nodeDeclarations.get("goml"));
  const node2 = new GomlNode(GrimoireInterface.nodeDeclarations.get("scenes"));
  const node3 = new GomlNode(GrimoireInterface.nodeDeclarations.get("scene"));
  node.addChild(node2, null);
  node2.addChild(node3, null);
  node2.remove();
  t.truthy(node.children.length === 0);
  t.truthy(node2.parent === null);
  t.truthy(node2.deleted === true);
  t.truthy(node3.deleted === true);
  t.truthy(node3.parent === null);
});

test("removeChild method works correctly", t => {
  const node = new GomlNode(GrimoireInterface.nodeDeclarations.get("goml"));
  const node2 = new GomlNode(GrimoireInterface.nodeDeclarations.get("scenes"));
  const node3 = new GomlNode(GrimoireInterface.nodeDeclarations.get("scene"));
  node.addChild(node2, null);
  node2.addChild(node3, null);
  node.removeChild(node2);
  t.truthy(node2.deleted === true);
  t.truthy(node3.deleted === true);
});

test("detachChild method works correctly", t => {
  const node = new GomlNode(GrimoireInterface.nodeDeclarations.get("goml"));
  const node2 = new GomlNode(GrimoireInterface.nodeDeclarations.get("scenes"));
  const node3 = new GomlNode(GrimoireInterface.nodeDeclarations.get("scene"));
  node.addChild(node2, null);
  node2.addChild(node3, null);
  node.detachChild(node2);
  t.truthy(node.children.length === 0);
  t.truthy(node2.deleted === false);
  t.truthy(node3.parent.id === node2.id);
  t.truthy(node3.deleted === false);
});

test("detach method works correctly", t => {
  const node = new GomlNode(GrimoireInterface.nodeDeclarations.get("goml"));
  const node2 = new GomlNode(GrimoireInterface.nodeDeclarations.get("scenes"));
  const node3 = new GomlNode(GrimoireInterface.nodeDeclarations.get("scene"));
  node.addChild(node2, null);
  node2.addChild(node3, null);
  node2.detach();
  try {
    node.detach();
  } catch (err) {
    t.truthy(err.message === "root Node cannot be detached.");
  }
  t.truthy(node.children.length === 0);
  t.truthy(node2.deleted === false);
  t.truthy(node3.parent.id === node2.id);
  t.truthy(node3.deleted === false);
});

test("getComponents method works correctly", t => {
  GrimoireInterface.registerComponent({
    componentName: "TestComponent",
    attributes: {
      attr1: {
        converter: "String",
        default: "testAttr",
      },
    },

  });
  GrimoireInterface.registerNode("test-node", ["TestComponent"]);
  const node = new GomlNode(GrimoireInterface.nodeDeclarations.get("test-node"));
  const components = node.getComponents();
  t.truthy(components.length === 2);
});

test("setMounted method works correctly", t => {
  const node = new GomlNode(GrimoireInterface.nodeDeclarations.get("goml"));
  const node2 = new GomlNode(GrimoireInterface.nodeDeclarations.get("scenes"));
  const node3 = new GomlNode(GrimoireInterface.nodeDeclarations.get("scene"));
  node.addChild(node2, null);
  node2.addChild(node3, null);
  node.setMounted(true);
  t.truthy(node.mounted === true);
  t.truthy(node2.mounted === true);
  t.truthy(node3.mounted === true);
});
test("index method works correctly", t => {
  const node = new GomlNode(GrimoireInterface.nodeDeclarations.get("goml"));
  const node2 = new GomlNode(GrimoireInterface.nodeDeclarations.get("scenes"));
  node.addChild(node2);
  t.truthy(node2.index === 0);
});
test("addComponent method works correctly", t => {
  const node = new GomlNode(GrimoireInterface.nodeDeclarations.get("goml"));
  const node2 = new GomlNode(GrimoireInterface.nodeDeclarations.get("scenes"));
  node.addChild(node2, null);
  GrimoireInterface.registerComponent({
    componentName: "TestComponent1",
    attributes: {
      testAttr1: {
        converter: "String",
        default: "thisistest",
      },
    },
  });
  const component = GrimoireInterface.componentDeclarations.get("TestComponent1").generateInstance();
  node._addComponentDirectly(component, true);
  const components = node.getComponents<Component>();
  t.truthy(components.length === 2);
  t.truthy(components[1].name.name === "TestComponent1");
  t.truthy(component.isDefaultComponent);
});
test("addComponent method works correctly", t => {
  const node = new GomlNode(GrimoireInterface.nodeDeclarations.get("goml"));
  const node2 = new GomlNode(GrimoireInterface.nodeDeclarations.get("scenes"));
  node.addChild(node2, null);
  GrimoireInterface.registerComponent({
    componentName: "TestComponent1",
    attributes: {
      testAttr1: {
        converter: "String",
        default: "thisistest",
      },
    },
  });
  const component = node.addComponent("TestComponent1", { testAttr1: "testValue" });
  const components = node.getComponents<Component>();
  t.truthy(components.length === 2);
  t.truthy(components[1].name.name === "TestComponent1");
  t.truthy(components[1].getAttribute("testAttr1") === "testValue");
  t.truthy(component.isDefaultComponent === false);
});
test("getComponent method overload works correctly", async t => {
  const node = new GomlNode(GrimoireInterface.nodeDeclarations.get("goml"));
  const node2 = new GomlNode(GrimoireInterface.nodeDeclarations.get("scenes"));
  node.addChild(node2, null);
  GrimoireInterface.registerComponent({
    componentName: "TestComponent1",
    attributes: {
      testAttr1: {
        converter: "String",
        default: "thisistest",
      },
    },
  });
  GrimoireInterface.registerComponent({
    componentName: "TestComponent2",
    attributes: {
      testAttr1: {
        converter: "String",
        default: "thisistest",
      },
    },
  }, "TestComponent1");
  await GrimoireInterface.resolvePlugins();

  node.addComponent("TestComponent2");
  t.truthy(node.getComponent<Component>("TestComponent2").name.name === "TestComponent2");
  t.truthy(node.getComponent<Component>("TestComponent1").name.name === "TestComponent2");
});
test("getComponents method overload works correctly", t => {
  const node = new GomlNode(GrimoireInterface.nodeDeclarations.get("goml"));
  const node2 = new GomlNode(GrimoireInterface.nodeDeclarations.get("scenes"));
  node.addChild(node2, null);
  GrimoireInterface.registerComponent({
    componentName: "TestComponent1",
    attributes: {
      testAttr1: {
        converter: "String",
        default: "thisistest",
      },
    },
  });
  GrimoireInterface.registerComponent({
    componentName: "TestComponent2",
    attributes: {
      testAttr1: {
        converter: "String",
        default: "thisistest",
      },
    },
  });
  node.addComponent("TestComponent1");
  node.addComponent("TestComponent2");
  const components = node.getComponents();
  t.truthy(components.length === 3);
});

// test("async message reciever called with await", async t => { // this is experimental feature!!
//   const gr = Environment.GrimoireInterface;
//   let res1;
//   const promise1 = new Promise(resolve => {
//     res1 = resolve;
//   });
//   let res2;
//   const promise2 = new Promise(resolve => {
//     res2 = resolve;
//   });
//   const spy1 = spy();
//   const spy2 = spy();

//   gr.registerComponent({
//     componentName: "hoge1",
//     attributes: {},
//     async $messsage(arg) {
//       spy1(arg);
//       return promise1;
//     },
//   });
//   gr.registerComponent({
//     componentName: "hoge2",
//     attributes: {},
//     async $messsage(arg) {
//       spy1(arg);
//       return promise2;
//     },
//   });
//   gr.registerNode("a", ["hoge1"]);
//   gr.registerNode("b", ["hoge2"]);

//   await TestEnvManager.loadPage(TestUtil.GenerateGomlEmbeddedHtml("<a><b/></a>"));

//   const root = gr("*")("a").first();
//   const arg = 42;

//   t.truthy(spy1.notCalled);
//   t.truthy(spy2.notCalled);
//   root.broadcastMessage("message", arg);
//   t.truthy(spy1.calledWith(arg));
//   t.truthy(spy2.notCalled);
//   res1();
//   t.truthy(spy2.calledWith(arg));

// });
