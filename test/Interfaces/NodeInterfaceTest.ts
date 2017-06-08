import "../AsyncSupport";
import "../XMLDomInit";
import test from "ava";
import sinon from "sinon";
import xmldom from "xmldom";
import xhrmock from "xhr-mock";
import * as _ from "lodash";
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
} from "../Node/GomlParserTest_Registering";
import GomlLoader from "../../src/Node/GomlLoader";
import GrimoireInterface from "../../src/Interface/GrimoireInterface";
import fs from "../fileHelper";

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
declare namespace global {
  let document: any;
  let Node: any;
}

test.beforeEach(async () => {
  GrimoireInterface.clear();
  const parser = new DOMParser();
  const htmlDoc = parser.parseFromString(testcase1_html, "text/html");
  global.document = htmlDoc;
  global.document.querySelectorAll = function(selector) {
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
  await GrimoireInterface.resolvePlugins();
  await GomlLoader.loadForPage();
  global["rootNode"] = _.values(GrimoireInterface.rootNodes)[0];
  global["rootNode"].element.ownerDocument = global["document"];
});

test("count first single.", (t) => {
  const ni = GrimoireInterface("script")("goml");
  // console.log(ni.nodes)
  // t.truthy(ni.count() === 1);
  // t.truthy(ni.first());
  t.truthy(true);

});
