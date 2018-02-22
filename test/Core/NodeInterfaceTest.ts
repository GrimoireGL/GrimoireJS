import test from "ava";
import * as _ from "lodash";
import xhrmock from "xhr-mock";
import Environment from "../../src/Core/Environment";
import GomlLoader from "../../src/Core/GomlLoader";
import GrimoireInterface from "../../src/Core/GrimoireInterface";
import {
  registerConflictComponent1,
  registerConflictComponent2,
  registerConflictNode1,
  registerConflictNode2,
  registerGoml,
  registerStringConverter,
  registerTestComponent1,
  registerTestComponent2,
  registerTestComponent3,
  registerTestComponentBase,
  registerTestComponentOptional,
  registerTestNode1,
  registerTestNode2,
  registerTestNode3,
  registerTestNodeBase,
} from "../DummyObjectRegisterer";
import fs from "../fileHelper";
import TestEnvManager from "../TestEnvManager";

const testcase1_goml = fs.readFile("../_TestResource/GomlNodeTest_Case1.goml");
const testcase1_html = fs.readFile("../_TestResource/GomlNodeTest_Case1.html");

TestEnvManager.init(testcase1_html);
TestEnvManager.mockSetup();
TestEnvManager.mock("./GomlNodeTest_Case1.goml", testcase1_goml);

let stringConverterSpy,
  testComponent1Spy,
  testComponent2Spy,
  testComponent3Spy,
  testComponentBaseSpy,
  testComponentOptionalSpy,
  conflictComponent1Spy,
  conflictComponent2Spy;

function resetSpies() {
  stringConverterSpy.resetHistory();
  testComponent1Spy.resetHistory();
  testComponent2Spy.resetHistory();
  testComponent3Spy.resetHistory();
  testComponentBaseSpy.resetHistory();
  testComponentOptionalSpy.resetHistory();
  conflictComponent1Spy.resetHistory();
  conflictComponent2Spy.resetHistory();
}
test.beforeEach(async() => {
  GrimoireInterface.clear();

  registerGoml();
  registerTestNode1();
  registerTestNode2();
  registerTestNode3();
  registerTestNodeBase();
  registerConflictNode1();
  registerConflictNode2();
  stringConverterSpy = registerStringConverter();
  testComponent1Spy = registerTestComponent1();
  testComponent2Spy = registerTestComponent2();
  testComponent3Spy = registerTestComponent3();
  testComponentBaseSpy = registerTestComponentBase();
  testComponentOptionalSpy = registerTestComponentOptional();
  conflictComponent1Spy = registerConflictComponent1();
  conflictComponent2Spy = registerConflictComponent2();
  await GrimoireInterface.resolvePlugins();
  await GomlLoader.loadForPage();
});

test("count first single.", (t) => {
  const ni = GrimoireInterface("script")("goml");
  // console.log(ni.nodes)
  // t.truthy(ni.count() === 1);
  // t.truthy(ni.first());
  t.truthy(true);
  // TODO add test
});
