import assert from 'power-assert';
import sinon from 'sinon';
import util from "util"
import ConditionBlock from "../../../../lib/Core/Materials/Base/ConditionBlock";
import TestConditionChecker from "./TestConditionChecker";
import TestConditionRegister from "./TestConditionRegister";
import ConditionInput from './ConditionInput.glsl';
import ShaderParser from "../../../../lib/Core/Materials/Base/ShaderParser";
import _ from "lodash"
import JSON5 from "json5";
import Q from "q";

class TestTransformer1{
      transform(input){
        return Q.when({
          initialSource: input.initialSource,
          transformSource: input.transformSource+"_1",
          description: input.description
        });
      }
}
class TestTransformer2{
      transform(input){
        return Q.when({
          initialSource: input.initialSource,
          transformSource: input.transformSource+"_2",
          description: input.description
        });
      }
}

describe('ShaderParser class test', () => {
  it('Test for transeform', () => {
    var promise = ShaderParser.transform("aaa",[new TestTransformer1(),new TestTransformer2]);
    promise.then(function(res){
      console.log("success!!!");
      console.log("result:"+res.transformSource);
    });
    assert(true);
  });
});

// import assert from 'power-assert';
// import sinon from 'sinon';
// //import ShaderSource from './TestSource.glsl'
// import JThreeContext from '../../../../lib/JThreeContext'
// import ShaderParser from '../../../../lib/Core/Materials/Base/ShaderParser'
// import MaterialManager from '../../../../lib/Core/Materials/Base/MaterialManager'
// import XMLDom from 'xmldom'
// function removeAllSpace(str) {
//   return str.replace(/\s/g, "");
// }
//
// function coreTestInitialize(){
//   global.window = global;
//   global.location = {
//     pathname:"http://localhost:8080/index.html",
//   }
//   global.DOMParser = XMLDom.DOMParser;
//   global.j3 = {};
//   JThreeContext.init();
// }
//
// function assertTransformed(ideal,result){
//   assert(removeAllSpace(ideal) === removeAllSpace(result));
// }
//
//
// const idealParsedVertex = `
// attribute vec3 position;
// uniform mat4 _matPVM;
// //@(register:0,sampler:12)
// uniform sampler2D testTexture;
// uniform mediump sampler2D precTexture;
// varying vec3 test;
// //@vert{
//   void main(void)
//     {
//         gl_Position = vec4(position,1);
//     }
// //}
// `;
//
// const idealParsedFragment = `
// precision mediump float;
// uniform mat4 _matPVM;
// //@(register:0,sampler:12)
// uniform sampler2D testTexture;
// uniform mediump sampler2D precTexture;
// varying vec3 test;
// //@frag{
//   void main(void)
//   {
//     gl_FragColor = vec4(1,0,0,1);
//   }
// //}`;
//
//
// const idealParsedUniforms = {
//     _matPVM:
//     {
//         variableName: '_matPVM',
//         variableType: 'mat4',
//         variablePrecision: undefined,
//         variableAnnotation: {}
//     },
//     testTexture:
//     {
//         variableName: 'testTexture',
//         variableType: 'sampler2D',
//         variablePrecision: undefined,
//         variableAnnotation: { register: '0', sampler: '12' }
//     },
//     precTexture:
//     {
//         variableName: 'precTexture',
//         variableType: 'sampler2D',
//         variablePrecision: 'mediump ',
//         variableAnnotation: {}
//     }
// };
//
// describe('ShaderParser transforming and parsing', () => {
//   // console.log(document)
//   // global.document = document
//   //coreTestInitialize();
//   //JThreeContext.registerContextComponent(new MaterialManager());
//   //const parsedResult = ShaderParser.parseCombined(ShaderSource);
//   it('Transforming vertex shader',()=>{
//     //console.log(document)
//     //assertTransformed(parsedResult.vertex,idealParsedVertex);
//   });
// });
