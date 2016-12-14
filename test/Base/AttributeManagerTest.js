import '../XMLDomInit'
import test from 'ava';
import Ensure from '../../lib-es5/Base/Ensure';
import GrimoireInterface from '../../lib-es5/GrimoireInterface';
import NSDictionary from '../../lib-es5/Base/NSDictionary';
import AttributeManager from '../../lib-es5/Base/AttributeManager';
import NSIdentity from '../../lib-es5/Base/NSIdentity';
import Constants from '../../lib-es5/Base/Constants';

const genAttr = (name, watch) => {
  return { name: name, watch: watch, Value: "value of " + name };
}

const ns1 = new NSIdentity("aaa");
const ns2 = new NSIdentity("bbb");
const ns3 = new NSIdentity("ccc");

const genAM = () => {
  var d = {};
  d[ns1.name] = genAttr(ns1);
  d[ns2.name] = genAttr(ns2);
  d[ns3.name] = genAttr(ns3);
  const dict = Ensure.ensureTobeNSDictionary(d, Constants.defaultNamespace);
  return new AttributeManager("tag", dict);
}

test('test', (t) => {
  const am = genAM();
  t.truthy(am.attributes.toArray().length === 3);
  t.truthy(!!am.getAttribute(ns1.name));
});
