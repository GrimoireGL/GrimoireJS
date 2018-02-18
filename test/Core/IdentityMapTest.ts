import fs from "../fileHelper";
import GomlLoader from "../../src/Core/GomlLoader";
import NodeInterface from "../../src/Core/NodeInterface";
import NSDictionary from "../../src/Core/IdentityMap";
import Identity from "../../src/Core/Identity";
import test from "ava";
import TestEnvManager from "../TestEnvManager";
import xhrmock from "xhr-mock";
import xmldom from "xmldom";


const xml = fs.readFile("../_TestResource/NSDictionary_QueryDOM.xml");


TestEnvManager.init();

test.beforeEach(() => {
  Identity.clear();
});

test("set element correctly", t => {
  const newKey = Identity.fromFQN("hoge.test");
  const value = "Grimoire";
  const theDict = new NSDictionary();
  theDict.set(newKey, value);
  t.truthy(theDict.get("test") === value);
  t.truthy(theDict.get("hoge.test") === value);
  t.truthy(theDict.get("false") == null);
});

test("set element correctly when dupelicated name was given", (t) => {
  const newKey = Identity.fromFQN("test");
  const secoundKey = Identity.fromFQN("ns.test");
  const v1 = "gr1";
  const v2 = "gr2";
  const theDict = new NSDictionary();
  theDict.set(newKey, v1);
  theDict.set(secoundKey, v2);
  t.truthy(theDict.get(newKey) === v1);
  t.truthy(theDict.get(secoundKey) === v2);
  t.throws(() => theDict.get("test"));
  t.truthy(theDict.get("ns.test") === v2);
});

test("element should be repalaced when dupelicated fqn was given", (t) => {
  const newKey = Identity.fromFQN("test");
  const secoundKey = Identity.fromFQN("Test");
  const theDict = new NSDictionary();
  theDict.set(newKey, "test1");
  theDict.set(secoundKey, "test2");
  t.truthy(theDict.get(newKey) === "test1");
  t.truthy(theDict.get(secoundKey) === "test2");
});

test("get element with strict name", async (t) => {
  const newKey = Identity.fromFQN("test");
  const secoundKey = Identity.fromFQN("test.test");
  const theDict = new NSDictionary();
  theDict.set(newKey, "test1");
  theDict.set(secoundKey, "test2");
  const domParser = new xmldom.DOMParser();

  const parsed = domParser.parseFromString(xml, "text/xml");
  const idElement = parsed.getElementById("test");
  const attr = idElement.getAttributeNode("d:test");
  t.truthy(theDict.get("test.test") === "test2");
  t.throws(() => theDict.get("test"));
  t.truthy(theDict.get(idElement) === "test2");
  t.truthy(theDict.get(secoundKey) === "test2");
  t.truthy(theDict.get(newKey) === "test1");
  t.truthy(theDict.get(attr) === "test2");
});

test("get element with shortened namespace prefix", async (t) => {
  const newKey = Identity.fromFQN("test");
  const secoundKey = Identity.fromFQN("grimoirejs.test");
  const theDict = new NSDictionary();
  theDict.set(newKey, "test1");
  theDict.set(secoundKey, "test2");
  const domParser = new xmldom.DOMParser();
  const parsed = domParser.parseFromString(xml, "text/xml");
  const idElement = parsed.getElementById("test2");
  const attr = idElement.attributes.item(1);
  t.throws(() => {
    theDict.get(idElement);
  });
  t.throws(() => {
    theDict.get(attr);
  });
});
test("get element with shortened namespace prefix", async (t) => {
  const newKey = Identity.fromFQN("test");
  const theDict = new NSDictionary();
  theDict.set(newKey, "test");
  const domParser = new xmldom.DOMParser();
  const parsed = domParser.parseFromString(xml, "text/xml");
  const idElement = parsed.getElementById("test2");
  const attr = idElement.attributes.item(1);
  t.truthy(theDict.get(idElement) === "test");
  t.truthy(theDict.get(attr) === "test");
});

test("get element with fuzzy name", async (t) => {
  const secoundKey = Identity.fromFQN("grimoirejs.test");
  const theDict = new NSDictionary();
  theDict.set(secoundKey, "test2");
  const domParser = new xmldom.DOMParser();
  const parsed = domParser.parseFromString(xml, "text/xml");
  const idElement = parsed.getElementById("test2");
  const attr = idElement.attributes.item(1);

  t.truthy(theDict.get(idElement) === "test2");
  t.truthy(theDict.get("test") === "test2");
  t.truthy(theDict.get(attr) === "test2");
});

test("get element with ambiguous name should throw error", async (t) => {
  const newKey = Identity.fromFQN("AATEST.test");
  const secoundKey = Identity.fromFQN("AATEST2.test");
  const theDict = new NSDictionary();
  theDict.set(newKey, "test1");
  theDict.set(secoundKey, "test2");
  const domParser = new xmldom.DOMParser();
  const parsed = domParser.parseFromString(xml, "text/xml");
  const idElement = parsed.getElementById("test2");
  const attr = idElement.attributes.item(1);
  t.throws(() => {
    theDict.get(idElement);
  });
  t.throws(() => {
    theDict.get(attr);
  });
});
