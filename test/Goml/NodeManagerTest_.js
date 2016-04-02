import test from 'ava';
import sinon from 'sinon';
import xmldom from 'xmldom';

import NodeManager from '../../lib/Goml/NodeManager';

global.DOMParser = xmldom.DOMParser;

const ContextComponentsMock = {
  LoopManager: void 0,
};

const LoopManagerMock = {
  addAction: () => {
    return void 0;
  },
};

const JThreeContextMock = {
  getContextComponent: () => {
    return LoopManagerMock;
  },
};

NodeManager.__Rewire__('ContextComponents', ContextComponentsMock);
NodeManager.__Rewire__('JThreeContext', JThreeContextMock);

test('setNodeToRootByString', (t) => {
  const insertGomlString = '<goml><resources></resources></goml>';
  const nodeManager = new NodeManager();
  nodeManager.setNodeToRootByString(insertGomlString);
  console.log(nodeManager.gomlRoot);
  t.pass();
});
