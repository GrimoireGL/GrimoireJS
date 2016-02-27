import assert from 'power-assert';
import sinon from 'sinon';
import util from "util"
import ConditionBlock from "../../../../lib/Core/Materials/Base/ConditionBlock";
import TestConditionChecker from "./TestConditionChecker";
import TestConditionRegister from "./TestConditionRegister";
import ConditionInput from './ConditionInput.glsl'
import _ from "lodash"
import JSON5 from "json5";
import Q from "q";

describe('Condition block class test', () => {
  it('Test for parseCondition', () => {
    console.log("input: "+ConditionInput)
    let tcc = new TestConditionChecker("t123")
    let tcc2 = new TestConditionChecker("tt1")
    let tcc3 = new TestConditionChecker("tt2")
    let tcr=new TestConditionRegister()
    tcr.registerCondition("t123",tcc)

    let cb = ConditionBlock.parseCondition(ConditionInput)
    // console.log("result1: "+cb.resolve(tcr))
    assert(cb.resolve(tcr)=="test1test5\n")
    tcr.registerCondition("tt1",tcc2)
    assert(cb.resolve(tcr)=="test1test2test4test5\n")
    // console.log("result2: "+cb.resolve(tcr))
    tcr.registerCondition("tt2",tcc3)
    assert(cb.resolve(tcr)=="test1test2test3test4test5\n")
    // console.log("result3: "+cb.resolve(tcr))
  });
});
