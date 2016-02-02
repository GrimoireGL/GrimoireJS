import assert from 'power-assert';
import sinon from 'sinon';

import ShaderSource from './TestSource.glsl'
import JThreeContext from '../../../../lib/JThreeContext'
import ShaderParser from '../../../../lib/Core/Materials/Base/ShaderParser'
import MaterialManager from '../../../../lib/Core/Materials/Base/MaterialManager'

function removeAllSpace(str) {
  return str.replace(/\s/g, "");
}

function coreTestInitialize(){
  global.window = global;
  global.j3 = {};
  JThreeContext.init();
}

function assertTransformed(ideal,result){
  assert(removeAllSpace(ideal) === removeAllSpace(result));
}


const idealParsedVertex = `
attribute vec3 position;
uniform mat4 _matPVM;
//@(register:0,sampler:12)
uniform sampler2D testTexture;
uniform mediump sampler2D precTexture;
varying vec3 test;
//@vertonly{
  void main(void)
    {
        gl_Position = vec4(position,1);
    }
//}
`;

const idealParsedFragment = `
precision mediump float;
uniform mat4 _matPVM;
//@(register:0,sampler:12)
uniform sampler2D testTexture;
uniform mediump sampler2D precTexture;
varying vec3 test;
//@fragonly{
  void main(void)
  {
    gl_FragColor = vec4(1,0,0,1);
  }
//}`;


const idealParsedUniforms = {
    _matPVM:
    {
        variableName: '_matPVM',
        variableType: 'mat4',
        variablePrecision: undefined,
        variableAnnotation: {}
    },
    testTexture:
    {
        variableName: 'testTexture',
        variableType: 'sampler2D',
        variablePrecision: undefined,
        variableAnnotation: { register: '0', sampler: '12' }
    },
    precTexture:
    {
        variableName: 'precTexture',
        variableType: 'sampler2D',
        variablePrecision: 'mediump ',
        variableAnnotation: {}
    }
};

describe('ShaderParser transforming and parsing', () => {
  coreTestInitialize();
  //JThreeContext.registerContextComponent(new MaterialManager());
  //const parsedResult = ShaderParser.parseCombined(ShaderSource);
  // it('Transforming vertex shader',()=>{
  //   assertTransformed(parsedResult.vertex,idealParsedVertex);
  // });
});
