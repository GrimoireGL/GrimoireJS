import test from 'ava';
import jsdomAsync from '../JsDOMAsync';
import xmldom from 'xmldom';
const DOMParser = xmldom.DOMParser;
import NSDictionary from '../../lib-es5/Base/NSDictionary';
import NSIdentity from '../../lib-es5/Base/NSIdentity';

test.beforeEach(() => {
  NSIdentity.clear();
});

test('set element correctly', (t) => {
  const newKey = NSIdentity.from("test");
  const theDict = new NSDictionary();
  theDict.set(newKey, "test element");
  t.truthy(theDict._nameObjectMap[newKey.name]);
  t.truthy(theDict._nameObjectMap[newKey.name][0].value === "test element");
  t.truthy(theDict._fqnObjectMap[newKey.fqn] === "test element");
});

test('set element correctly when dupelicated name was given', (t) => {
  const newKey = NSIdentity.from("test");
  const secoundKey = NSIdentity.from("HTTP://GRIMOIRE.GL/NS/TEST", "test");
  const theDict = new NSDictionary();
  theDict.set(newKey, "test element");
  theDict.set(secoundKey, "test element2");
  t.truthy(theDict._nameObjectMap[newKey.name][0].value === "test element");
  t.truthy(theDict._nameObjectMap[secoundKey.name][1].value === "test element2");
  t.truthy(theDict._fqnObjectMap[newKey.fqn] === "test element");
  t.truthy(theDict._fqnObjectMap[secoundKey.fqn] === "test element2");
});

test('element should be repalaced when dupelicated fqn was given', (t) => {
  const newKey = NSIdentity.from("test");
  const secoundKey = NSIdentity.from("Test");
  const theDict = new NSDictionary();
  theDict.set(newKey, "test1");
  theDict.set(secoundKey, "test2");
  t.truthy(theDict.fromFQN(newKey.fqn));
  t.truthy(theDict._nameObjectMap[newKey.name][0].value === "test1");
  t.truthy(theDict._nameObjectMap[secoundKey.name][0].value === "test2");
});

test('get element correctly with fqn', (t) => {
  const newKey = NSIdentity.from("test");
  const theDict = new NSDictionary();
  theDict.set(newKey, "test1");
  t.truthy(theDict.fromFQN(newKey.fqn) === "test1");
});

test('get element with strict name', async(t) => {
  const newKey = NSIdentity.from("test");
  const secoundKey = NSIdentity.from("HTTP://GRIMOIRE.GL/NS/TEST", "test");
  const theDict = new NSDictionary();
  theDict.set(newKey, "test1");
  theDict.set(secoundKey, "test2");
  const domParser = new DOMParser();
  const parsed = domParser.parseFromString(require("./_TestResource/NSDictionary_QueryDOM.xml"), "text/xml");
  const idElement = parsed.getElementById("test");
  const attr = idElement.getAttributeNode("d:test");
  t.truthy(theDict.get("HTTP://GRIMOIRE.GL/NS/TEST", "test") === "test2");
  t.truthy(theDict.get("http://grimoire.gl/NS/test", "test") === "test2");
  t.truthy(theDict.get(idElement) === "test2");
  t.truthy(theDict.get(secoundKey) === "test2");
  t.truthy(theDict.get(newKey) === "test1");
  t.truthy(theDict.get(attr) === "test2");
});

test('get element with shortened namespace prefix', async(t) => {
  const newKey = NSIdentity.from("test");
  const secoundKey = NSIdentity.from("grimoirejs", "test");
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
  const secoundKey = NSIdentity.from("grimoirejs", "test");
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
  const newKey = NSIdentity.from("HTTP://GRIMOIRE.GL/NS/TEST", "test");
  const secoundKey = NSIdentity.from("HTTP://GRIMOIRE.GL/NS/TEST2", "test");
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
