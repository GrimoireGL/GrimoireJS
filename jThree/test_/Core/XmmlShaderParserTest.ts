/// <reference path="../../src/refs/bundle.ts" />
import PA = require('power-assert');
const assert = PA.default;

import sinon = require('sinon');
import XmmlShaderParser = require("../../src/Core/Materials/Base/XMMLShaderParser");
import JThreeContext = require("../../src/JThreeContext");
import _ = require("underscore");

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

function removeAllSpace(source: string): string {
    return source.replace(/\s/g, '');
}

describe('Xmml shader parsing', () => {
    global.window = global;
    global.j3 = {};
    JThreeContext.init();
    const shaderSource = require("./TestShader");
    const parsedResult = XmmlShaderParser.parseCombined(shaderSource);
    it('Parsing vertex', () => {
        assert(removeAllSpace(parsedResult.vertex) === removeAllSpace(idealParsedVertex));
    });
    it('Parsing fragment', () => {
        assert(removeAllSpace(parsedResult.fragment) === removeAllSpace(idealParsedFragment));
    });
    it('Parsing uniform', () => {
        assert(_.isEqual(parsedResult.uniforms, idealParsedUniforms));
    });
});
