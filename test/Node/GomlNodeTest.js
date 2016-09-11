import '../AsyncSupport';
import '../XMLDomInit'
import test from 'ava';
import sinon from 'sinon';
import xmldom from 'xmldom';
import jsdomAsync from "../JsDOMAsync";
import xhrmock from "xhr-mock";
import _ from "lodash";
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
} from "./_TestResource/GomlParserTest_Registering";
import GomlLoader from "../../lib-es5/Node/GomlLoader";
import GrimoireInterface from "../../lib-es5/GrimoireInterface";

xhrmock.setup();
xhrmock.get("./GomlNodeTest_Case1.goml", (req, res) => {
    return res.status(200).body(require("./_TestResource/GomlNodeTest_Case1.goml"));
});

let stringConverterSpy,
  testComponent1Spy,
  testComponent2Spy,
  testComponent3Spy,
  testComponentBaseSpy,
  testComponentOptionalSpy,
  conflictComponent1Spy,
  conflictComponent2Spy;

  function resetSpies(){
    stringConverterSpy.reset();
    testComponent1Spy.reset();
    testComponent2Spy.reset();
    testComponent3Spy.reset();
    testComponentBaseSpy.reset();
    testComponentOptionalSpy.reset();
    conflictComponent1Spy.reset();
    conflictComponent2Spy.reset();
  }

test.beforeEach(async () => {
  GrimoireInterface.clear();
  const parser = new DOMParser();
  const htmlDoc = parser.parseFromString(require("./_TestResource/GomlNodeTest_Case1.html"),"text/html");
  global.document = htmlDoc;
  global.document.querySelectorAll = function(selector){
    return global.document.getElementsByTagName("script");
  };
  global.Node = {
    ELEMENT_NODE: 1
  };
  goml();
  testNode1();
  testNode2();
  testNode3();
  testNodeBase();
  conflictNode1();
  conflictNode2();
  stringConverterSpy = stringConverter();
  testComponent1Spy = testComponent1();
  testComponent2Spy = testComponent2();
  testComponent3Spy = testComponent3();
  testComponentBaseSpy = testComponentBase();
  testComponentOptionalSpy = testComponentOptional();
  conflictComponent1Spy = conflictComponent1();
  conflictComponent2Spy = conflictComponent2();
  await GomlLoader.loadForPage();
  global.rootNode = _.values(GrimoireInterface.rootNodes)[0];
  console.log("beforeEach" + _.values(GrimoireInterface.rootNodes).length);
});

test('Root node must not have parent',(t)=>{
  t.truthy(_.isNull(rootNode._parent));
  t.truthy(_.isNull(rootNode.parent));
});

test('Nodes must have companion',(t)=>{
  const companion = rootNode.companion;
  t.truthy(companion);
  rootNode.callRecursively((n)=>{
    t.truthy(companion === n.companion);
  });
});

test('Nodes must have tree',(t)=>{
  const tree = rootNode.tree;
  t.truthy(tree);
  rootNode.callRecursively((n)=>{
    t.truthy(tree === n.tree);
  })
});

test('mount should be called in ideal timing',(t)=>{
  const order = [testComponent3Spy,testComponent2Spy,testComponentOptionalSpy,testComponent1Spy];
  order.forEach(v=>{
    t.truthy(v.getCall(1).args[0] === "mount");
  });
});

test('awake should be called in ideal timing',(t)=>{
  const order = [testComponent3Spy,testComponent2Spy,testComponentOptionalSpy,testComponent1Spy];
  order.forEach(v=>{
    t.truthy(v.getCall(0).args[0] === "awake");
  });
});

test('Nodes should be mounted after loading',(t)=>{
  t.truthy(rootNode.mounted);
  rootNode.callRecursively((n)=>{
    t.truthy(n.mounted);
  });
});

test('Broadcast message should call correct order',(t)=>{
  rootNode.broadcastMessage("onTest");
  sinon.assert.callOrder(testComponent3Spy,testComponent2Spy,testComponentOptionalSpy,testComponent1Spy);
});

test('Broadcast message with range should work correctly',(t)=>{
  resetSpies();
  rootNode.broadcastMessage(1,"onTest");
  sinon.assert.called(testComponent3Spy);
  sinon.assert.notCalled(testComponent2Spy);
  sinon.assert.notCalled(testComponentOptionalSpy);
  sinon.assert.notCalled(testComponent1Spy);
});

test('SendMessage should call correct order',(t)=>{
  const testNode2 = rootNode.children[0].children[0];
  testNode2.sendMessage("onTest");
  sinon.assert.callOrder(testComponent2Spy,testComponentOptionalSpy);
});

test('Detach node should invoke unmount before detaching',(t)=>{
  console.log("detach");
  resetSpies();
  const testNode3 = rootNode.children[0];
  testNode3.detach();
  const called = [testComponent3Spy,testComponent2Spy,testComponentOptionalSpy,testComponent1Spy];
  sinon.assert.callOrder.apply(sinon.assert,called);
  called.forEach((v)=>{
    t.truthy(v.getCall(0).args[0] === "unmount");
  });
});

test('Delete should invoke unmount before deleting',(t)=>{
  console.log("delete");
  resetSpies();
  const testNode3 = rootNode.children[0];
  testNode3.delete();
  const called = [testComponent3Spy,testComponent2Spy,testComponentOptionalSpy,testComponent1Spy];
  sinon.assert.callOrder.apply(sinon.assert,called);
  called.forEach((v)=>{
    t.truthy(v.getCall(0).args[0] === "unmount");
  });
});
