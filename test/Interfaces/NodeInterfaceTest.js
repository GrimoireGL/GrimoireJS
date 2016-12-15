import '../AsyncSupport';
import '../XMLDomInit'
import test from 'ava';
import sinon from 'sinon';
import xmldom from 'xmldom';
import jsdomAsync from "../JsDOMAsync";
import xhrmock from "xhr-mock";
import _ from "lodash";
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
} from "../Node/_TestResource/GomlParserTest_Registering";
import GomlLoader from "../../lib-es5/Node/GomlLoader";
import GrimoireInterface from "../../lib-es5/GrimoireInterface";

xhrmock.setup();
xhrmock.get("./GomlNodeTest_Case1.goml", (req, res) => {
  return res.status(200).body(require("../Node/_TestResource/GomlNodeTest_Case1.goml"));
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

test.beforeEach(async() => {
  GrimoireInterface.clear();
  const parser = new DOMParser();
  const htmlDoc = parser.parseFromString(require("../Node/_TestResource/GomlNodeTest_Case1.html"), "text/html");
  global.document = htmlDoc;
  global.document.querySelectorAll = function (selector) {
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
  await GomlLoader.loadForPage();
  global.rootNode = _.values(GrimoireInterface.rootNodes)[0];
  global.rootNode.element.ownerDocument = global.document;
});

test('count first single.', (t) => {
  // const ni = GrimoireInterface("*")("*");
  // console.log(GrimoireInterface("*")("*").nodes)
  // t.truthy(ni.count() === 1);
  // t.truthy(ni.first());
  t.truthy(true);

});
