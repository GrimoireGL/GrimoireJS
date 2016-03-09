import test from 'ava';
import fs from 'fs';

import ConditionBlock from '../../../../lib/Core/Materials/Base/ConditionBlock';
import TestConditionChecker from './TestConditionChecker';
import TestConditionRegister from './TestConditionRegister';

const ConditionInput = fs.readFileSync('./ConditionInput.glsl').toString();

test('Test for parseCondition', (t) => {
  let tcc = new TestConditionChecker('t123');
  let tcc2 = new TestConditionChecker('tt1');
  let tcc3 = new TestConditionChecker('tt2');
  let tcr = new TestConditionRegister();
  tcr.registerCondition('t123', tcc);

  let cb = ConditionBlock.parseCondition(ConditionInput);
  // console.log("result1: "+cb.resolve(tcr))
  t.ok(cb.resolve(tcr) === 'test1test5\n');
  tcr.registerCondition('tt1', tcc2);
  t.ok(cb.resolve(tcr) === 'test1test2test4test5\n');
  // console.log("result2: "+cb.resolve(tcr))
  tcr.registerCondition('tt2', tcc3);
  t.ok(cb.resolve(tcr) === 'test1test2test3test4test5\n');
  // console.log("result3: "+cb.resolve(tcr))
});
