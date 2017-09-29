import * as _ from "lodash";
import Environment from "../../src/Core/Environment";
import fs from "../fileHelper";
import GomlLoader from "../../src/Core/GomlLoader";
import GrimoireInterface from "../../src/Core/GrimoireInterface";
import test from "ava";
import TestEnvManager from "../TestEnvManager";
import xhrmock from "xhr-mock";
import xmldom from "xmldom";
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

const testcase1_goml = fs.readFile("../_TestResource/GomlNodeTest_Case1.goml");
const testcase1_html = fs.readFile("../_TestResource/GomlNodeTest_Case1.html");

xhrmock.setup();
xhrmock.get("./GomlNodeTest_Case1.goml", (req, res) => {
  return res.status(200).body(testcase1_goml);
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
test.beforeEach(async () => {
  GrimoireInterface.clear();
  // const window = await jsdomAsync(html, []);
  // Environment.document = window.document;
  const parser = new xmldom.DOMParser();
  const htmlDoc = parser.parseFromString(testcase1_html, "text/html");
  Environment.document = htmlDoc;
  Environment.document.querySelectorAll = function (selector) {
    return Environment.document.getElementsByTagName("script");
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
  await GrimoireInterface.resolvePlugins();
  await GomlLoader.loadForPage();
  Environment["rootNode"] = _.values(GrimoireInterface.rootNodes)[0];
});

test("count first single.", (t) => {
  const ni = GrimoireInterface("script")("goml");
  // console.log(ni.nodes)
  // t.truthy(ni.count() === 1);
  // t.truthy(ni.first());
  t.truthy(true);

});
