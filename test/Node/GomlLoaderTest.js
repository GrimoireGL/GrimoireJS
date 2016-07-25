import prequire from "proxyquire";
import jsdomAsync from "../JsDOMAsync";
import test from 'ava';
import sinon from 'sinon';
import "babel-polyfill";
import xhrmock from "xhr-mock";

xhrmock.setup();
xhrmock.get("http://grimoire.gl/index.goml", (req, res) => {
    return res.status(200).body("TheTestStringFromAjax1");
});
xhrmock.get("http://grimoire.gl/index2.goml", (req, res) => {
    return res.status(200).body("TheTestStringFromAjax2");
});
xhrmock.get("http://grimoire.gl/index3.goml", (req, res) => {
    return res.status(200).body("TheTestStringFromAjax3");
});
global.DOMParser = function() {}

function mockXMLParse(func) {
    return prequire('../../lib-es5/Core/Node/GOMLLoader', {
        "../Base/XMLReader": {
            default: {
                parseXML: (src) => {
                    func(src);
                }
            }
        }
    }).default;
}

test('Processing script[type="text/goml"] tag correctly when the text content was existing', async(t) => {
    const src = require("./_TestResource/GomlLoaderTest_Case1.html");
    const window = await jsdomAsync(src, []);
    const scriptTags = window.document.querySelectorAll('script[type="text/goml"]');
    const spy = sinon.spy();
    const mockedParseXML = mockXMLParse((src) => {
        spy(src.trim());
    });
    await mockedParseXML.loadFromScriptTag(scriptTags.item(0));
    t.truthy(spy.calledWith("TheTestString"));
});

test('Processing script[type="text/goml"] tag correctly when the src attribute was existing', async(t) => {
    const src = require("./_TestResource/GomlLoaderTest_Case2.html");
    const window = await jsdomAsync(src, []);
    const scriptTags = window.document.querySelectorAll('script[type="text/goml"]');
    const spy = sinon.spy();
    const mockedParseXML = mockXMLParse((src) => {
        spy(src.trim());
    });
    await mockedParseXML.loadFromScriptTag(scriptTags.item(0));
    t.truthy(spy.calledWith("TheTestStringFromAjax1"));
});

test('Processing goml scripts from query', async(t) => {
    const src = require("./_TestResource/GomlLoaderTest_Case3.html");
    const window = await jsdomAsync(src, []);
    global.document = window.document;
    const spy = sinon.spy();
    const mockedParseXML = mockXMLParse((src) => {
        spy(src.trim());
    });
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
