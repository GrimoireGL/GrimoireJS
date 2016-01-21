/// <reference path="../../src/refs/bundle.ts" />
import PA = require("power-assert");
const assert = PA.default;

import sinon = require("sinon");
import XmmlShaderParser = require("../../src/Core/Materials/Base/ShaderParser");
import JThreeContext = require("../../src/JThreeContext");
import _ = require("underscore");
import difflet = require("difflet");

const idealParsedVertex = `
attribute vec3 position;

uniform mat4 _matPVM;

uniform sampler2D testTexture;

uniform mediump sampler2D precTexture ;

uniform mediump sampler2D precTexture2 [120];

varying vec3 test;

  void main(void)
    {
        gl_Position = vec4(position,1);
    }
`;

const idealParsedFragment = `
precision mediump float;


uniform mat4 _matPVM;

uniform sampler2D testTexture;

uniform mediump sampler2D precTexture ;

uniform mediump sampler2D precTexture2 [120];

varying vec3 test;




  void main(void)
  {
    gl_FragColor = vec4(1,0,0,1);
  }
`;

const idealParsedUniforms = {
  _matPVM:
  {
    variableName: "_matPVM",
    variableType: "mat4",
    variablePrecision: undefined,
    variableAnnotation: {},
    isArray: false,
    arrayLength: undefined
  },
  testTexture:
  {
    variableName: "testTexture",
    variableType: "sampler2D",
    variablePrecision: undefined,
    variableAnnotation: { register: 0, sampler: 12 },
    isArray: false,
    arrayLength: undefined
  },
  precTexture2:
  {
    variableName: "precTexture2",
    variableType: "sampler2D",
    variablePrecision: "mediump",
    variableAnnotation: {},
    isArray: true,
    arrayLength: 120
  },
  precTexture:
  {
    variableName: "precTexture",
    variableType: "sampler2D",
    variablePrecision: "mediump",
    variableAnnotation: {},
    isArray: false,
    arrayLength: undefined
  }
};

function removeAllSpace(source: string): string {
  return source.replace(/\s/g, "");
}

describe("Xmml shader parsing", () => {
  global.window = global;
  global.j3 = {};
  JThreeContext.init();
  const shaderSource = require("./TestShader");
  const parsedResult = XmmlShaderParser.parseCombined(shaderSource);
  process.stdout.write(difflet.compare(parsedResult.uniforms, idealParsedUniforms));
  it("Parsing vertex", () => {
    console.log(parsedResult.vertex);
    assert(removeAllSpace(parsedResult.vertex) === removeAllSpace(idealParsedVertex));
  });
  it("Parsing fragment", () => {
    console.log(parsedResult.fragment);
    assert(removeAllSpace(parsedResult.fragment) === removeAllSpace(idealParsedFragment));
  });
  it("Parsing uniform", () => {
    const correct = _.isEqual(parsedResult.uniforms, idealParsedUniforms);
    if (!correct) {
      process.stdout.write(difflet.compare(parsedResult.uniforms, idealParsedUniforms));
    }
    assert(correct);
  });
});
