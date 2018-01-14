import test from "ava";
import { assert, spy } from "sinon";
import GrimoireComponent from "../../src/Component/GrimoireComponent";
import Attribute from "../../src/Core/Attribute";
import GomlParser from "../../src/Core/GomlParser";
import GrimoireInterface from "../../src/Core/GrimoireInterface";
import Identity from "../../src/Core/Identity";
import XMLReader from "../../src/Tool/XMLReader";
import TestEnvManager from "../TestEnvManager";
import TestUtil from "../TestUtil";

TestEnvManager.init();

const GOML = "<goml></goml>";

test.beforeEach(async () => {
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
  hogeAttr.resolveDefaultValue();
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
    node.gomAttribute = { hoge: "43", "ns1.hoge": "44" };
    attr1.resolveDefaultValue(); // ambiguous
  });

  node.gomAttribute = { "ns1.hoge": "43" };
  attr1.resolveDefaultValue();
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

  attr1.resolveDefaultValue();
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

  attr1.resolveDefaultValue();
  t.truthy(attr1.Value === 42);
});

test("normal attribute should evaluated correct timing.", t => {
  const s = spy();
  GrimoireInterface.registerConverter({
    name: "normal",
    convert(a: number) {
      s(a);
      return a * 2;
    },
  });
  GrimoireInterface.registerComponent({
    componentName: "Test",
    attributes: {
      attr: {
        converter: "normal",
        default: 3,
      },
    },
  });
  GrimoireInterface.registerNode("node", ["Test"]);
  const doc = XMLReader.parseXML("<node/>");
  const node = GomlParser.parse(doc);

  t.truthy(s.notCalled);
  GrimoireInterface.addRootNode(null, node);
  t.truthy(s.args[0][0] === 3);

  t.truthy(node.getAttribute("normal") === 6);
  node.setAttribute("attr", 5);
  t.truthy(s.args[1][0] === 5);
  t.truthy(node.getAttribute("normal") === 10);
});

test("getAttribute", t => {
  GrimoireInterface.registerConverter({
    name: "normal",
    convert() {
      return 4;
    },
  });
  GrimoireInterface.registerConverter({
    name: "lazy",
    lazy: true,
    convert() {
      return () => Math.random();
    },
  });
  GrimoireInterface.registerConverter({
    name: "promise",
    lazy: true,
    convert(v) {
      return v;
    },
  });

  GrimoireInterface.registerComponent({
    componentName: "Test",
    attributes: {
      normal: {
        converter: "normal",
        default: null,
      },
      lazy: {
        converter: "lazy",
        default: null,
      },
      promise: {
        converter: "promise",
        default: null,
      },
    },
  });
  GrimoireInterface.registerNode("node", ["Test"]);
  const node = TestUtil.DummyTreeInit("<node/>");
  node.resolveAttributesValue();

  t.truthy(node.getAttribute("lazy") !== node.getAttribute("lazy"));
  t.truthy(node.getAttribute("promise") === null);
  node.setAttribute("promise", Promise.resolve(4));
  t.truthy(node.getAttribute("promise") === 4);
  let resolver;
  node.setAttribute("promise", new Promise((resolve, reject) => {
    resolver = resolve;
  }));
  t.truthy(node.getAttribute("promise") === 4);
  resolver(5);
  t.truthy(node.getAttribute("promise") === 5);


  node.watch("lazy", (v) => {
    t.truthy(typeof v === "function");
    t.truthy(v() === 4);
  }, true);
});

