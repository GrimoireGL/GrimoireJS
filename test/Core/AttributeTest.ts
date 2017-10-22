import test from "ava";
import { assert, spy } from "sinon";
import GrimoireComponent from "../../src/Component/GrimoireComponent";
import Attribute from "../../src/Core/Attribute";
import GrimoireInterface from "../../src/Core/GrimoireInterface";
import Identity from "../../src/Core/Identity";
import TestEnvManager from "../TestEnvManager";
import TestUtil from "../TestUtil";

TestEnvManager.init();

const GOML = "<goml></goml>";

test.beforeEach(async() => {
  GrimoireInterface.clear();
  GrimoireInterface.registerNode("goml");
});

test("attibute poperties should be initialized correctly", (t) => {
  const rootNode = TestUtil.DummyTreeInit(GOML);
  const idAttr = rootNode.getAttributeRaw("id");
  const baseComponent = rootNode.getComponent(GrimoireComponent);

  t.truthy(idAttr.name.fqn === "grimoirejs.GrimoireComponent.id");
  t.truthy(idAttr.declaration.default === null);
  t.truthy((idAttr.converter.name as Identity).fqn === "grimoirejs.String");
  t.truthy(idAttr.component === baseComponent);
});

test("get/set value should works correctly.", t => {
  const rootNode = TestUtil.DummyTreeInit(GOML);
  const idAttr = rootNode.getAttributeRaw("id");
  const baseComponent = rootNode.getComponent(GrimoireComponent);
  t.truthy(idAttr.Value === null);
  idAttr.Value = "string";
  t.truthy(idAttr.Value === "string");
  idAttr.Value = 123;
  t.truthy(idAttr.Value === "123");
  t.throws(() => {
    idAttr.Value = undefined;
  });
});

test("watch/unwatch should works correctly", t => {
  const rootNode = TestUtil.DummyTreeInit(GOML);
  const idAttr = rootNode.getAttributeRaw("id");
  const baseComponent = rootNode.getComponent(GrimoireComponent);
  const s = spy();

  const watcher = (n, o, a) => {
    s(n, o, a);
  };
  idAttr.watch(watcher);

  idAttr.Value = "newValue";
  t.truthy(s.args[0][0] === "newValue");
  t.truthy(s.args[0][1] === null);
  t.truthy(s.args[0][2] === idAttr);

  s.reset();
  idAttr.unwatch(watcher);
  idAttr.Value = "newValue2";
  assert.notCalled(s);
});

test("generateAttributeForComponent should works correctly", t => {
  const rootNode = TestUtil.DummyTreeInit(GOML);
  const idAttr = rootNode.getAttributeRaw("id");
  const baseComponent = rootNode.getComponent(GrimoireComponent);
  const hogeAttr = Attribute.generateAttributeForComponent("hoge", {
    converter: "Number",
    default: 42,
  }, baseComponent);
  t.throws(() => { // not resolve default value yet
    baseComponent.getAttribute("hoge");
  });
  hogeAttr.resolveDefaultValue({});
  t.truthy(baseComponent.getAttribute("hoge") === 42);
  hogeAttr.Value = 43;
  t.truthy(baseComponent.getAttribute("hoge") === 43);

  t.throws(() => { // converter can not resolve.
    Attribute.generateAttributeForComponent("fuga", {
      converter: "False",
      default: 42,
    }, baseComponent);
  });
  t.notThrows(() => { // default value undefined is OK.
    Attribute.generateAttributeForComponent("fuga", {
      converter: "Number",
      default: undefined,
    }, baseComponent);
  });
});
test("boundTo should works correctly", t => {
  const rootNode = TestUtil.DummyTreeInit(GOML);
  const idAttr = rootNode.getAttributeRaw("id");
  const baseComponent = rootNode.getComponent(GrimoireComponent);
  const obj = { id: "hoge" };
  idAttr.bindTo("id", obj);
  t.truthy(obj.id === idAttr.Value);
  idAttr.Value = "value";
  t.truthy(obj.id === idAttr.Value);
});

test("generateAttributeForComponent should works correctly (use dom value)", t => {
  GrimoireInterface.registerNode("node1", [], { "ns1.hoge": 52 });
  const rootNode = TestUtil.DummyTreeInit("<goml><node1/></goml>");
  const node = rootNode.children[0];
  const baseComponent = node.getComponent(GrimoireComponent);

  const attr1 = Attribute.generateAttributeForComponent("ns1.hoge", {
    converter: "Number",
    default: 42,
  }, baseComponent);

  t.throws(() => {
    attr1.resolveDefaultValue({ hoge: "43", "ns1.hoge": "44" }); // ambiguous
  });

  attr1.resolveDefaultValue({ "ns1.hoge": "43" });
  t.truthy(attr1.Value === 43);
});

test("generateAttributeForComponent should works correctly (use node value)", t => {
  GrimoireInterface.registerNode("node1", [], { "ns1.hoge": 52 });
  const rootNode = TestUtil.DummyTreeInit("<goml><node1/></goml>");
  const node = rootNode.children[0];
  const baseComponent = node.getComponent(GrimoireComponent);

  const attr1 = Attribute.generateAttributeForComponent("ns1.hoge", {
    converter: "Number",
    default: 42,
  }, baseComponent);
  const attr2 = Attribute.generateAttributeForComponent("ns2.hoge", {
    converter: "Number",
    default: 42,
  }, baseComponent);

  attr1.resolveDefaultValue({});
  t.truthy(attr1.Value === 52);
});

test("generateAttributeForComponent should works correctly (use declaration default value)", t => {
  GrimoireInterface.registerNode("node1");
  const rootNode = TestUtil.DummyTreeInit("<goml><node1/></goml>");
  const node = rootNode.children[0];
  const baseComponent = node.getComponent(GrimoireComponent);

  const attr1 = Attribute.generateAttributeForComponent("ns1.hoge", {
    converter: "Number",
    default: 42,
  }, baseComponent);
  const attr2 = Attribute.generateAttributeForComponent("ns2.hoge", {
    converter: "Number",
    default: 42,
  }, baseComponent);

  attr1.resolveDefaultValue({});
  t.truthy(attr1.Value === 42);
});
