import test from 'ava';
import jsdomAsync from '../JsDOMAsync';
import xmldom from 'xmldom';
const DOMParser = xmldom.DOMParser;
import NamespacedDictionary from '../../lib-es5/Core/Base/NamespacedDictionary';
import NamespacedIdentity from '../../lib-es5/Core/Base/NamespacedIdentity';

test('set element correctly', (t) => {
    const newKey = new NamespacedIdentity("test");
    const theDict = new NamespacedDictionary();
    theDict.set(newKey, "test element");
    t.ok(theDict._nameObjectMap.get(newKey.name).size === 1);
    t.ok(theDict._nameObjectMap.get(newKey.name).get(newKey.fqn) === "test element");
    t.ok(theDict._fqnObjectMap.get(newKey.fqn) === "test element");
});

test('set element correctly when dupelicated name was given', (t) => {
    const newKey = new NamespacedIdentity("test");
    const secoundKey = new NamespacedIdentity("HTTP://GRIMOIRE.GL/NS/TEST", "test");
    const theDict = new NamespacedDictionary();
    theDict.set(newKey, "test element");
    theDict.set(secoundKey, "test element2");
    t.ok(theDict._nameObjectMap.get(newKey.name).size === 2);
    t.ok(theDict._nameObjectMap.get(newKey.name).get(newKey.fqn) === "test element");
    t.ok(theDict._nameObjectMap.get(secoundKey.name).get(secoundKey.fqn) === "test element2");
    t.ok(theDict._fqnObjectMap.get(newKey.fqn) === "test element");
    t.ok(theDict._fqnObjectMap.get(secoundKey.fqn) === "test element2");
});

test('element should be repalaced when dupelicated fqn was given', (t) => {
    const newKey = new NamespacedIdentity("test");
    const secoundKey = new NamespacedIdentity("Test");
    const theDict = new NamespacedDictionary();
    theDict.set(newKey, "test1");
    theDict.set(secoundKey, "test2");
    t.ok(theDict.fromFQN(newKey.fqn));
    t.ok(theDict._nameObjectMap.get(newKey.name).size === 1);
    t.ok(theDict._nameObjectMap.get(newKey.name).get(newKey.fqn) === "test2");
});

test('get element correctly with fqn', (t) => {
    const newKey = new NamespacedIdentity("test");
    const theDict = new NamespacedDictionary();
    theDict.set(newKey, "test1");
    t.ok(theDict.fromFQN(newKey.fqn) === "test1");
});

test('get element with strict name', async(t) => {
    const newKey = new NamespacedIdentity("test");
    const secoundKey = new NamespacedIdentity("HTTP://GRIMOIRE.GL/NS/TEST", "test");
    const theDict = new NamespacedDictionary();
    theDict.set(newKey, "test1");
    theDict.set(secoundKey, "test2");
    const domParser = new DOMParser();
    const parsed = domParser.parseFromString(require("./_TestResource/NamespacedDictionary_QueryDOM.xml"), "text/xml");
    const idElement = parsed.getElementById("test");
    t.ok(theDict.get("HTTP://GRIMOIRE.GL/NS/TEST", "TEST") === "test2");
    t.ok(theDict.get("http://grimoire.gl/NS/test", "test") === "test2");
    t.ok(theDict.get(idElement) === "test2");
    t.ok(theDict.get(secoundKey) === "test2");
    t.ok(theDict.get(newKey) === "test1");
});

test('get element with shortened namespace prefix', async(t) => {
    const newKey = new NamespacedIdentity("test");
    const secoundKey = new NamespacedIdentity("HTTP://GRIMOIRE.GL/NS/DEFAULT", "test");
    const theDict = new NamespacedDictionary();
    theDict.set(newKey, "test1");
    theDict.set(secoundKey, "test2");
    const domParser = new DOMParser();
    const parsed = domParser.parseFromString(require("./_TestResource/NamespacedDictionary_QueryDOM.xml"), "text/xml");
    const idElement = parsed.getElementById("test2");
    t.ok(theDict.get(idElement) === "test2");
});

test('get element with fuzzy name', async(t) => {
    const secoundKey = new NamespacedIdentity("HTTP://GRIMOIRE.GL/NS/DEFAULT", "test");
    const theDict = new NamespacedDictionary();
    theDict.set(secoundKey, "test2");
    const domParser = new DOMParser();
    const parsed = domParser.parseFromString(require("./_TestResource/NamespacedDictionary_QueryDOM.xml"), "text/xml");
    const idElement = parsed.getElementById("test2");
    t.ok(theDict.get(idElement) === "test2");
    t.ok(theDict.get("test") === "test2");
});

test('get element with ambigious name should throw error', async(t) => {
    const newKey = new NamespacedIdentity("HTTP://GRIMOIRE.GL/NS/TEST","test");
    const secoundKey = new NamespacedIdentity("HTTP://GRIMOIRE.GL/NS/TEST2", "test");
    const theDict = new NamespacedDictionary();
    theDict.set(newKey, "test1");
    theDict.set(secoundKey, "test2");
    const domParser = new DOMParser();
    const parsed = domParser.parseFromString(require("./_TestResource/NamespacedDictionary_QueryDOM.xml"), "text/xml");
    const idElement = parsed.getElementById("test2");
    t.throws(() => {
        theDict.get(idElement);
    });
});
