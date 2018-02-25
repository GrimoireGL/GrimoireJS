import test from "ava";
import { assert, spy } from "sinon";
import GrimoireComponent from "../../src/Component/GrimoireComponent";
import { StandardAttribute } from "../../src/Core/Attribute";
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

  t.truthy(idAttr.identity.fqn === "grimoirejs.GrimoireComponent.id");
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
  const idAttr = rootNode.getAttributeRaw("id") as StandardAttribute;
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

  s.resetHistory();
  idAttr.unwatch(watcher);
  idAttr.Value = "newValue2";
  assert.notCalled(s);
});

test("generateAttributeForComponent should works correctly", t => {
  const rootNode = TestUtil.DummyTreeInit(GOML);
  const idAttr = rootNode.getAttributeRaw("id");
  const baseComponent = rootNode.getComponent(GrimoireComponent);
  const hogeAttr = StandardAttribute.generateAttributeForComponent("hoge", {
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
    StandardAttribute.generateAttributeForComponent("fuga", {
      converter: "False",
      default: 42,
    }, baseComponent);
  });
  t.notThrows(() => { // default value undefined is OK.
    StandardAttribute.generateAttributeForComponent("fuga", {
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

  const attr1 = StandardAttribute.generateAttributeForComponent("ns1.hoge", {
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

  const attr1 = StandardAttribute.generateAttributeForComponent("ns1.hoge", {
    converter: "Number",
    default: 42,
  }, baseComponent);
  const attr2 = StandardAttribute.generateAttributeForComponent("ns2.hoge", {
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

  const attr1 = StandardAttribute.generateAttributeForComponent("ns1.hoge", {
    converter: "Number",
    default: 42,
  }, baseComponent);
  const attr2 = StandardAttribute.generateAttributeForComponent("ns2.hoge", {
    converter: "Number",
    default: 42,
  }, baseComponent);

  attr1.resolveDefaultValue();
  t.truthy(attr1.Value === 42);
});

test("Normal attribute should evaluated correct timing.", t => {
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

  t.truthy(s.args.length === 0);
  GrimoireInterface.addRootNode(null, node);
  t.truthy(s.args[0][0] === 3);

  t.truthy(node.getAttribute("attr") === 6);
  node.setAttribute("attr", 5);
  t.truthy(s.args[1][0] === 5);

  t.truthy(node.getAttribute("attr") === 10);
});

test("Lazy attribute should evaluated correct timing.", t => {
  GrimoireInterface.registerConverter({
    name: "lazy",
    lazy: true,
    convert(a) {
      return () => {
        return {
          arg: a,
          random: Math.random(),
        };
      };
    },
  });
  GrimoireInterface.registerComponent({
    componentName: "Test",
    attributes: {
      lazy: {
        converter: "lazy",
        default: null,
      },
    },
  });
  GrimoireInterface.registerNode("node", ["Test"]);

  let node = TestUtil.DummyTreeInit("<node/>");
  t.truthy(node.getAttribute("lazy") === null); // null should not use converter.

  node = TestUtil.DummyTreeInit("<node lazy=\"2\"/>");

  t.truthy(node.getAttribute("lazy") !== node.getAttribute("lazy"));

  node.watch("lazy", (v) => {
    t.truthy(typeof v === "function");
    const v1 = v();
    const v2 = v();
    t.truthy(v1.random !== v2.random);
    t.truthy(v1.arg === v2.arg);
  }, true);

  node.setAttribute("lazy", "5");
  node.watch("lazy", (v) => {
    t.truthy(typeof v === "function");
    const v1 = v();
    const v2 = v();
    t.truthy(v1.random !== v2.random);
    t.truthy(v1.arg === v2.arg);
    t.truthy(v1.arg === "5");
  }, true);
});

test("promise attribute should evaluated correct timing.", async t => {
  GrimoireInterface.registerConverter({
    name: "promise",
    convert(v) {
      return v;
    },
  });

  GrimoireInterface.registerComponent({
    componentName: "Test",
    attributes: {
      promise: {
        converter: "promise",
        default: null,
      },
    },
  });
  GrimoireInterface.registerNode("node", ["Test"]);
  const node = TestUtil.DummyTreeInit("<node/>");
  node.resolveAttributesValue();

  t.truthy(node.getAttribute("promise") === null);
  const p1 = Promise.resolve(4);
  node.setAttribute("promise", p1);
  await p1;
  t.truthy(node.getAttribute("promise") === 4);

  let resolver;
  const p2 = new Promise((resolve, reject) => {
    resolver = resolve;
  });
  node.setAttribute("promise", p2);
  t.truthy(node.getAttribute("promise") === 4);
  resolver(5);
  await p2;
  t.truthy(node.getAttribute("promise") === 5);
  // For checking exceptions of promise attributes

  const node2 = TestUtil.DummyTreeInit("<node/>");
  let resolver2;
  const p3 = new Promise((resolve) => {
    resolver2 = resolve;
  });
  node2.setAttribute("promise", p3);
  t.notThrows(() => node2.getAttribute("promise"));
  t.truthy(node2.getAttribute("promise") === void 0);
  resolver2(6);
  t.truthy(node2.getAttribute("promise") === 6);
});
