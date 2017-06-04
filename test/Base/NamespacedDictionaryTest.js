import '../AsyncSupport';
import '../XMLDomInit';
import test from 'ava';
import sinon from 'sinon';
import xmldom from 'xmldom';
import jsdomAsync from "../JsDOMAsync";
import xhrmock from "xhr-mock";
import _ from "lodash";
import GomlLoader from "../../lib-es5/Node/GomlLoader";
import GrimoireInterface from "../../lib-es5/Interface/GrimoireInterface";
import NodeInterface from "../../lib-es5/Interface/NodeInterface";
import NSIdentity from "../../lib-es5/Base/NSIdentity";
import NSDictionary from "../../lib-es5/Base/NSDictionary";

test.beforeEach(() => {
  NSIdentity.clear();
});

test('set element correctly', (t) => {
  const newKey = NSIdentity.fromFQN("hoge.test");
  const value = "Grimoire";
  const theDict = new NSDictionary();
  theDict.set(newKey, value);
  t.truthy(theDict.get("test") === value);
  t.truthy(theDict.get("hoge.test") === value);
  t.truthy(theDict.get("false") == null);
});

test('set element correctly when dupelicated name was given', (t) => {
  const newKey = NSIdentity.fromFQN("test");
  const secoundKey = NSIdentity.fromFQN("ns.test");
  const v1 = "gr1";
  const v2 = "gr2";
  const theDict = new NSDictionary();
  theDict.set(newKey, v1);
  theDict.set(secoundKey, v2);
  t.truthy(theDict.get(newKey) === v1);
  t.truthy(theDict.get(secoundKey) === v2);
  t.throws(() => { theDict.get("test") });
  t.truthy(theDict.get("ns.test") === v2);
});

test('element should be repalaced when dupelicated fqn was given', (t) => {
  const newKey = NSIdentity.fromFQN("test");
  const secoundKey = NSIdentity.fromFQN("Test");
  const theDict = new NSDictionary();
  theDict.set(newKey, "test1");
  theDict.set(secoundKey, "test2");
  t.truthy(theDict.get(newKey) === "test1");
  t.truthy(theDict.get(secoundKey) === "test2");
});

test('get element with strict name', async(t) => {
  const newKey = NSIdentity.fromFQN("test");
  const secoundKey = NSIdentity.fromFQN("test.test");
  const theDict = new NSDictionary();
  theDict.set(newKey, "test1");
  theDict.set(secoundKey, "test2");
  const domParser = new DOMParser();
  const parsed = domParser.parseFromString(require("./_TestResource/NSDictionary_QueryDOM.xml"), "text/xml");
  const idElement = parsed.getElementById("test");
  const attr = idElement.getAttributeNode("d:test");
  t.truthy(theDict.get("test.test") === "test2");
  t.throws(() => { theDict.get("test") });
  t.truthy(theDict.get(idElement) === "test2");
  t.truthy(theDict.get(secoundKey) === "test2");
  t.truthy(theDict.get(newKey) === "test1");
  t.truthy(theDict.get(attr) === "test2");
});

test('get element with shortened namespace prefix', async(t) => {
  const newKey = NSIdentity.fromFQN("test");
  const secoundKey = NSIdentity.fromFQN("grimoirejs.test");
  const theDict = new NSDictionary();
  theDict.set(newKey, "test1");
  theDict.set(secoundKey, "test2");
  const domParser = new DOMParser();
  const parsed = domParser.parseFromString(require("./_TestResource/NSDictionary_QueryDOM.xml"), "text/xml");
  const idElement = parsed.getElementById("test2");
  const attr = idElement.attributes.item(1);
  t.truthy(theDict.get(idElement) === "test2");
  t.truthy(theDict.get(attr) === "test2");
});

test('get element with fuzzy name', async(t) => {
  const secoundKey = NSIdentity.fromFQN("grimoirejs.test");
  const theDict = new NSDictionary();
  theDict.set(secoundKey, "test2");
  const domParser = new DOMParser();
  const parsed = domParser.parseFromString(require("./_TestResource/NSDictionary_QueryDOM.xml"), "text/xml");
  const idElement = parsed.getElementById("test2");
  const attr = idElement.attributes.item(1);

  t.truthy(theDict.get(idElement) === "test2");
  t.truthy(theDict.get("test") === "test2");
  t.truthy(theDict.get(attr) === "test2");
});

test('get element with ambigious name should throw error', async(t) => {
  const newKey = NSIdentity.fromFQN("AATEST.test");
  const secoundKey = NSIdentity.fromFQN("AATEST2.test");
  const theDict = new NSDictionary();
  theDict.set(newKey, "test1");
  theDict.set(secoundKey, "test2");
  const domParser = new DOMParser();
  const parsed = domParser.parseFromString(require("./_TestResource/NSDictionary_QueryDOM.xml"), "text/xml");
  const idElement = parsed.getElementById("test2");
  const attr = idElement.attributes.item(1);
  t.throws(() => {
    theDict.get(idElement);
  });
  t.throws(() => {
    theDict.get(attr);
  });
});
