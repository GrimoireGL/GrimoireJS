import "../RRSupport";
import prequire from "proxyquire";
import jsdomAsync from "../JsDOMAsync";
import test from 'ava';
import sinon from 'sinon';
import xhrmock from "xhr-mock";
import xmldom from "../XMLDomInit";

import XMLReader from "../../lib-es5/Core/Base/XMLReader";
import GrimoireInterface from "../../lib-es5/Core/GrimoireInterface";
import GomlParser from "../../lib-es5/Core/Node/GomlParser";
import {
  goml,
  testNode1,
  testNode2
} from "./_TestResource/GomlParserTest_Registering";
xhrmock.setup();
xhrmock.get("http://grimoire.gl/index.goml", (req, res) => {
    return res.status(200).body('<goml>\n</goml>');
});
xhrmock.get("http://grimoire.gl/index2.goml", (req, res) => {
    return res.status(200).body("TheTestStringFromAjax2");
});
xhrmock.get("http://grimoire.gl/index3.goml", (req, res) => {
    return res.status(200).body("TheTestStringFromAjax3");
});

function mockXMLParse(func,spy) {
    return prequire('../../lib-es5/Core/Node/GomlLoader', {
        "../Base/XMLReader": {
            default: {
                parseXML: (src) => {
                    func(src);
                    return XMLReader.parseXML(src);
                }
            }
        }
    }).default;
}

test.afterEach(() => {
  GrimoireInterface.clear();
});
test.beforeEach(() => {
  global.Node = {
    ELEMENT_NODE: 1
  };
  goml();
  testNode1();
  testNode2();
});
test('Processing script[type="text/goml"] tag correctly when the text content was existing', async(t) => {
    const src = require("./_TestResource/GomlLoaderTest_Case1.html");
    const window = await jsdomAsync(src, []);
    global.document = window.document;
    const scriptTags = window.document.querySelectorAll('script[type="text/goml"]');
    const spy = sinon.spy();
    const mockedParseXML = mockXMLParse((src) => {
        spy(src.replace(/[\n\s]/g,""));
    });
    await mockedParseXML.loadFromScriptTag(scriptTags.item(0));
    t.truthy(spy.calledWith(`<goml><goml><goml></goml><goml/></goml></goml>`));
});

test('Processing script[type="text/goml"] and call parse related methods in correct order', async(t) => {
    const src = require("./_TestResource/GomlLoaderTest_Case1.html");
    const window = await jsdomAsync(src, []);
    global.document = window.document;
    const scriptTags = window.document.querySelectorAll('script[type="text/goml"]');
    const spy = sinon.spy();
    const broadcastSpy = sinon.spy();
    const mockedParseXML = mockXMLParse((src) => {
        spy(src.replace(/[\n\s]/g,""));
    },broadcastSpy);
    await mockedParseXML.loadFromScriptTag(scriptTags.item(0));
    GrimoireInterface.registerNode("goml",[],{})
    t.truthy(spy.calledWith(`<goml></goml>`));
    t.truthy(broadcastSpy.calledWith("treeInitialized",scriptTags.item(0)));
});

test('Processing script[type="text/goml"] tag correctly when the src attribute was existing', async(t) => {
    const src = require("./_TestResource/GomlLoaderTest_Case2.html");
    const window = await jsdomAsync(src, []);
    global.document = window.document;
    const scriptTags = window.document.querySelectorAll('script[type="text/goml"]');
    const spy = sinon.spy();
    const mockedParseXML = mockXMLParse((src) => {
        spy(src.replace(/[\n\s]/g,""));
    });
    GrimoireInterface.registerNode("goml",[],{});
    console.log(GrimoireInterface.nodeDeclarations);
    await mockedParseXML.loadFromScriptTag(scriptTags.item(0));
    t.truthy(spy.calledWith(`<goml></goml>`));
});

test('Processing goml scripts from query', async(t) => {
    const src = require("./_TestResource/GomlLoaderTest_Case3.html");
    const window = await jsdomAsync(src, []);
    global.document = window.document;
    const spy = sinon.spy();
    const mockedParseXML = mockXMLParse((src) => {
        spy(src.trim());
    });
    GrimoireInterface.registerNode("goml",[],{});
    await mockedParseXML.loadFromQuery("script.call");
    t.truthy(spy.calledWith("TheTestStringFromAjax1"));
    t.truthy(!spy.calledWith("TheTestStringFromAjax2"));
    t.truthy(spy.calledWith("TheTestStringFromAjax3"));
});

test('Processing goml scripts for page', async(t) => {
    const src = require("./_TestResource/GomlLoaderTest_Case4.html");
    const window = await jsdomAsync(src, []);
    global.document = window.document;
    const spy = sinon.spy();
    const mockedParseXML = mockXMLParse((src) => {
        spy(src.trim());
    });
    await mockedParseXML.loadForPage();
    t.truthy(spy.calledWith("TheTestStringFromAjax1"));
    t.truthy(spy.calledWith("TheTestStringFromAjax2"));
    t.truthy(spy.calledWith("TheTestStringFromAjax3"));
    t.truthy(spy.calledWith("TheTestString"));
});
