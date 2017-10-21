import test from "ava";
import { assert, spy } from "sinon";
import Environment from "../../src/Core/Environment";
import GomlParser from "../../src/Core/GomlParser";
import GrimoireInterface from "../../src/Core/GrimoireInterface";
import Identity from "../../src/Core/Identity";
import Namespace from "../../src/Core/Namespace";
import XMLReader from "../../src/Tools/XMLReader";
import {
  registerConflictComponent1,
  registerConflictComponent2,
  registerConflictNode1,
  registerConflictNode2,
  registerGoml,
  registerStringConverter,
  registerTestComponent1,
  registerTestComponent2,
  registerTestComponentBase,
  registerTestComponentOptional,
  registerTestNode1,
  registerTestNode2,
  registerTestNodeBase,
} from "../DummyObjectRegisterer";
import fs from "../fileHelper";
import TestEnvManager from "../TestEnvManager";

TestEnvManager.init();

// Get element from test case source which is located with relative path.
function obtainElementTag(path) {
  return XMLReader.parseXML(fs.readFile(path));
}

function registerUserPlugin() {
  GrimoireInterface.registerNode("scenes");
  GrimoireInterface.registerNode("scene");
}

let stringConverterSpy,
  testComponent1Spy,
  testComponent2Spy,
  testComponentBaseSpy,
  testComponentOptionalSpy,
  conflictComponent1Spy,
  conflictComponent2Spy;
const gomlParserTestCasePath1 = "../_TestResource/GomlParserTest_Case1.goml";
const gomlParserTestCasePath2 = "../_TestResource/GomlParserTest_Case2.goml";
const gomlParserTestCasePath3 = "../_TestResource/GomlParserTest_Case3.goml";
const gomlParserTestCasePath4 = "../_TestResource/GomlParserTest_Case4.goml";

test.beforeEach(async() => {
  GrimoireInterface.clear();
  registerGoml();
  registerTestNode1();
  registerTestNode2();
  registerTestNodeBase();
  registerConflictNode1();
  registerConflictNode2();
  stringConverterSpy = registerStringConverter();
  testComponent1Spy = registerTestComponent1();
  testComponent2Spy = registerTestComponent2();
  testComponentBaseSpy = registerTestComponentBase();
  testComponentOptionalSpy = registerTestComponentOptional();
  conflictComponent1Spy = registerConflictComponent1();
  conflictComponent2Spy = registerConflictComponent2();
  registerUserPlugin();
  await GrimoireInterface.resolvePlugins();
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
  const ns1 = Identity.fromFQN("test1.ConflictComponent");
  const ns2 = Identity.fromFQN("test2.ConflictComponent");
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

const testcases = [
  {
    source: gomlParserTestCasePath1,
    expected: {
      name: "goml",
      children: [{
        name: "goml",
        children: [
          { name: "goml" },
          { name: "goml" },
        ],
      }],
    },
  },
  {
    source: gomlParserTestCasePath2,
    expected: {
      name: "goml",
      attributes: { testAttr: "node default Value" },
      children: [
        {
          name: "goml",
          attributes: { testAttr: "hogehoge" },
        },
        {
          name: "goml",
        },
      ],
    },
  },
  {
    source: gomlParserTestCasePath3,
    expected: {
      name: "goml",
      children: [
        {
          name: "test-node1",
          attributes: { testAttr1: "hugahuga" },
          children: [
            {
              name: "test-node2",
              attributes: { testAttr2: "123", inheritAttr: "hogehoge" },
              optionalComponents: [
                {
                  name: "TestComponentOptional",
                  attributes: { value: "999" },
                },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    source: gomlParserTestCasePath4,
    expected: {
      name: "goml",
      children: [
        {
          name: "test1.conflict-node",
          optionalComponents: [
            {
              name: "test1.ConflictComponent",
            },
            {
              name: "test2.ConflictComponent",
            },
          ],
        },
        {
          name: "test2.conflict-node",
        },
      ],
    },
  },
];

testcases.forEach((testcase, i) => {
  test(`parseToGOM works correctly (${i})`, (t) => {
    const result = GomlParser.parseToGOM(obtainElementTag(testcase.source));
    t.deepEqual(result, testcase.expected);
  });
});
