import test from 'ava';
import '../AsyncSupport';
import '../XMLDomInit';
import xmldom from 'xmldom';
import sinon from 'sinon';
import GrimoireInterface from "../../lib-es5/Interface/GrimoireInterface";
import Constants from "../../lib-es5/Base/Constants";
import Component from "../../lib-es5/Node/Component";
import jsdomAsync from "../JsDOMAsync";
import GomlParser from "../../lib-es5/Node/GomlParser";
import GomlLoader from "../../lib-es5/Node/GomlLoader";
import GomlNode from "../../lib-es5/Node/GomlNode";

import NSIdentity from '../../lib-es5/Base/NSIdentity';

test.beforeEach(() => {
  NSIdentity.clear();
});

test('Not accept to get invalid name or namespace', (t) => {
  NSIdentity.fromFQN("hoge");
  NSIdentity.fromFQN("a.b");
  t.throws(() => {
    NSIdentity.guess("aaa");
  });
  t.throws(() => {
    NSIdentity.guess("b", "a");
  });
  t.throws(() => {
    NSIdentity.guess("Wrongamespace", "WrongName");
  });
  t.notThrows(() => {
    NSIdentity.guess("hoge");
  });
  t.notThrows(() => {
    NSIdentity.guess("a", "b");
  });
  t.notThrows(() => {
    NSIdentity.guess("b");
  });
});

test('Transform name and ns correctly', (t) => {
  const i = NSIdentity.fromFQN("ns.Sample");
  t.truthy(i.name === "Sample");
  t.truthy(i.ns.qualifiedName === "ns");
});
