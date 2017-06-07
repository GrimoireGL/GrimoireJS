import "../AsyncSupport";
import "../XMLDomInit";
import prequire from "proxyquire";
import jsdomAsync from "../JsDOMAsync";
import test from "ava";
import sinon from "sinon";
import xhrmock from "xhr-mock";
import XMLReader from "../../src/Base/XMLReader";
import GrimoireInterface from "../../src/Interface/GrimoireInterface";
import GomlParser from "../../src/Node/GomlParser";
import fs from "../fileHelper";
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
} from "./GomlParserTest_Registering";

declare namespace global {
  let Node: any;
  let document: any;
}

const testcase1_html = fs.readFile("../../_TestResource/GomlLoaderTest_Case1.html");
const testcase2_html = fs.readFile("../../_TestResource/GomlLoaderTest_Case2.html");
const testcase3_html = fs.readFile("../../_TestResource/GomlLoaderTest_Case3.html");
const testcase4_html = fs.readFile("../../_TestResource/GomlLoaderTest_Case4.html");



xhrmock.setup();
xhrmock.get("http://grimoire.gl/index.goml", (req, res) => {
  return res.status(200).body("<goml>\n</goml>");
});
xhrmock.get("http://grimoire.gl/index2.goml", (req, res) => {
  return res.status(200).body("<goml>\n</goml>");
});
xhrmock.get("http://grimoire.gl/index3.goml", (req, res) => {
  return res.status(200).body("<goml>\n</goml>");
});

function mockXMLParse(func) {
  return prequire("../../src/Node/GomlLoader", {
    "../Base/XMLReader": {
      default: {
        parseXML: (srcHtml) => {
          func(srcHtml);
          return XMLReader.parseXML(srcHtml);
        }
      }
    }
  }).default;
}

test.beforeEach(async () => {
  GrimoireInterface.clear();
  global.Node = {
    ELEMENT_NODE: 1
  };
  goml();
  testNode1();
  testNode2();
  testComponent1();
  testComponent2();
  testNodeBase();
  testComponentBase();

  await GrimoireInterface.resolvePlugins();
});

test("Processing script[type=\"text/goml\"] tag correctly when the text content was existing", async (t) => {
  const window = await jsdomAsync(testcase1_html, []);
  global.document = window.document;
  const scriptTags = window.document.querySelectorAll("script[type=\"text/goml\"]");
  const spy = sinon.spy();
  const mockedParseXML = mockXMLParse(xml => {
    spy(xml.replace(/[\n\s]/g, ""));
  });
  await mockedParseXML.loadFromScriptTag(scriptTags.item(0));
  t.truthy(spy.calledWith(`<goml><goml><goml></goml><goml/></goml></goml>`));
});

test("Processing script[type=\"text/goml\"] and call parse related methods in correct order", async (t) => {
  const src = testcase1_html;
  const window = await jsdomAsync(src, []);
  global.document = window.document;
  const scriptTags = window.document.querySelectorAll("script[type=\"text/goml\"]");
  const spy = sinon.spy();
  const mockedParseXML = mockXMLParse(xml => {
    spy(xml.replace(/[\n\s]/g, ""));
  });
  await mockedParseXML.loadFromScriptTag(scriptTags.item(0));
  t.truthy(spy.calledWith(`<goml><goml><goml></goml><goml/></goml></goml>`));
});

test("Processing script[type=\"text/goml\"] tag correctly when the src attribute was existing", async (t) => {
  const src = testcase2_html;
  const window = await jsdomAsync(src, []);
  global.document = window.document;
  const scriptTags = window.document.querySelectorAll("script[type=\"text/goml\"]");
  const spy = sinon.spy();
  const mockedParseXML = mockXMLParse(xml => {
    spy(xml.replace(/[\n\s]/g, ""));
  });

  await mockedParseXML.loadFromScriptTag(scriptTags.item(0));
  t.truthy(spy.calledWith(`<goml></goml>`));
});

test("Processing goml scripts from query", async (t) => {
  const src = testcase3_html;
  const window = await jsdomAsync(src, []);
  global.document = window.document;
  const spy = sinon.spy();
  const mockedParseXML = mockXMLParse(xml => {
    spy(xml.trim());
  });
  await mockedParseXML.loadFromQuery("script.call");
  t.truthy(spy.calledWith("<goml>\n</goml>"));
});

test("Processing goml scripts for page", async (t) => {
  const src = testcase4_html;
  const window = await jsdomAsync(src, []);
  global.document = window.document;
  const spy = sinon.spy();
  const mockedParseXML = mockXMLParse(xml => {
    spy(xml.trim());
  });
  await mockedParseXML.loadForPage();
  t.truthy(spy.calledWith("<goml>\n</goml>"));
});
