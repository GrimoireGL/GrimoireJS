import Environment from "../../src/Core/Environment";
import fs from "../fileHelper";
import GomlLoader from "../../src/Core/GomlLoader";
import GomlNode from "../../src/Core/GomlNode";
import GomlParser from "../../src/Core/GomlParser";
import GrimoireInterface from "../../src/Core/GrimoireInterface";
import jsdomAsync from "../JsDOMAsync";
import prequire from "proxyquire";
import sinon from "sinon";
import test from "ava";
import TestEnvManager from "../TestEnvManager";
import xhrmock from "xhr-mock";
import XMLReader from "../../src/Tools/XMLReader";
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

const testcase1_html = fs.readFile("../_TestResource/GomlLoaderTest_Case1.html");
const testcase2_html = fs.readFile("../_TestResource/GomlLoaderTest_Case2.html");
const testcase3_html = fs.readFile("../_TestResource/GomlLoaderTest_Case3.html");
const testcase4_html = fs.readFile("../_TestResource/GomlLoaderTest_Case4.html");



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
  return prequire("../../src/Core/GomlLoader", {
    "../Tools/XMLReader": {
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
  goml();
  testNode1();
  testNode2();
  testComponent1();
  testComponent2();
  testNodeBase();
  testComponentBase();

  await GrimoireInterface.resolvePlugins();
});

test("loadForPage throw Error if goml syntax is invalid.", async (t) => {
  const window = await jsdomAsync("<script type=\"text/goml\"><hoge></script>", []);
  Environment.document = window.document;
  const scriptTags = window.document.querySelectorAll("script[type=\"text/goml\"]");

  await t.throws(GomlLoader.loadFromScriptTag(scriptTags.item(0)));
});

test("Processing script[type=\"text/goml\"] tag correctly when the text content was existing", async (t) => {
  const window = await jsdomAsync(testcase1_html, []);
  Environment.document = window.document;
  const scriptTags = window.document.querySelectorAll("script[type=\"text/goml\"]");
  const spy = sinon.spy();
  const mockedParseXML = mockXMLParse(xml => {
    spy(xml.replace(/[\n\s]/g, ""));
  });
  await mockedParseXML.loadFromScriptTag(scriptTags.item(0));
  t.truthy(spy.calledWith(`<goml><goml><goml></goml><goml/></goml></goml>`));
});

test("Processing script[type=\"text/goml\"] tag correctly when the src attribute was existing", async (t) => {
  const window = await jsdomAsync(testcase2_html, []);
  Environment.document = window.document;
  const scriptTags = window.document.querySelectorAll("script[type=\"text/goml\"]");
  const spy = sinon.spy();
  const mockedParseXML = mockXMLParse(xml => {
    spy(xml.replace(/[\n\s]/g, ""));
  });

  await mockedParseXML.loadFromScriptTag(scriptTags.item(0));
  t.truthy(spy.calledWith(`<goml></goml>`));
});

test("Processing goml scripts from query", async (t) => {
  const window = await jsdomAsync(testcase3_html, []);
  Environment.document = window.document;
  const spy = sinon.spy();
  const mockedParseXML = mockXMLParse(xml => {
    spy(xml.trim());
  });
  await mockedParseXML.loadFromQuery("script.call");
  t.truthy(spy.calledWith("<goml>\n</goml>"));
});

test("Processing goml scripts for page", async (t) => {
  const window = await jsdomAsync(testcase4_html, []);
  Environment.document = window.document;
  const spy = sinon.spy();
  const mockedParseXML = mockXMLParse(xml => {
    spy(xml.trim());
  });
  await mockedParseXML.loadForPage();
  t.truthy(spy.calledWith("<goml>\n</goml>"));
});

test("all text/goml scripts tags should be loaded on loadForPage", async (t) => {
  const spy = sinon.spy();
  const original = GrimoireInterface.addRootNode.bind(GrimoireInterface);
  GrimoireInterface.addRootNode = (tag: HTMLScriptElement, rootNode: GomlNode) => {
    spy(tag);
    return original(tag, rootNode);
  };

  await TestEnvManager.loadPage(testcase4_html);
  t.truthy(spy.callCount === 4);
});



