import test from 'ava';
import jsdom from 'jsdom';
import _ from 'lodash';
import fs from 'fs';
import XMLRenderConfigUtility from '../../lib-es5/Core/Pass/XMLRenderConfigUtility';

function readDom(path) {
  return jsdom.jsdom(require(path));
}

function parseTest(func, path, ideal) {
  const result = {};
  func(readDom(path), result);
  return _.isEqual(ideal, result);
}

test('_parseBoolean works well', (t) => {
  t.truthy(XMLRenderConfigUtility._parseBoolean(undefined, true));
  t.truthy(!XMLRenderConfigUtility._parseBoolean(undefined, false));
  t.truthy(XMLRenderConfigUtility._parseBoolean("true", true));
  t.truthy(!XMLRenderConfigUtility._parseBoolean("false", false));
});

test('_parseCullConfigure should works when cull element is not existing', (t) => {
  t.truthy(parseTest(XMLRenderConfigUtility._parseCullConfigure, "./Resources/Empty.xml", {}));
});

test('_parseCullConfigure should works when empty cull element was specified', (t) => {
  t.truthy(parseTest(XMLRenderConfigUtility._parseCullConfigure, "./Resources/CullConfig1.xml", {
    cullOrientation: "BACK"
  }));
});

test('_parseCullConfigure should works when mode was specified', (t) => {
  t.truthy(parseTest(XMLRenderConfigUtility._parseCullConfigure, "./Resources/CullConfig2.xml", {
    cullOrientation: "FRONT"
  }));
});

test('_parseBlendConfigure should works when blend element was not existing', (t) => {
  t.truthy(parseTest(XMLRenderConfigUtility._parseBlendConfigure, "./Resources/Empty.xml", {}));
});

test('_parseBlendConfigure should works when empty blend tag was specified', (t) => {
  t.truthy(parseTest(XMLRenderConfigUtility._parseBlendConfigure, "./Resources/BlendConfig1.xml", {
    blendEnabled: true,
    blendSrcFactor: undefined,
    blendDstFactor: undefined
  }));
});

test('_parseBlendConfigure should works when valid blend tag was specified', (t) => {
  t.truthy(parseTest(XMLRenderConfigUtility._parseBlendConfigure, "./Resources/BlendConfig2.xml", {
    blendEnabled: true,
    blendSrcFactor: "SRC_COLOR",
    blendDstFactor: "DST_COLOR"
  }));
});

test('_depthConfigure should works when depth tag was not specified', (t) => {
  t.truthy(parseTest(XMLRenderConfigUtility._parseDepthConfigure, "./Resources/Empty.xml", {}));
});

test('_depthConfigure should works when empty depth tag was specified', (t) => {
  t.truthy(parseTest(XMLRenderConfigUtility._parseDepthConfigure, "./Resources/DepthConfig1.xml", {
    depthEnabled: true,
    depthMode: undefined
  }));
});

test('_depthConfigure should works when valid depth tag was specified', (t) => {
  t.truthy(parseTest(XMLRenderConfigUtility._parseDepthConfigure, "./Resources/DepthConfig2.xml", {
    depthEnabled: false,
    depthMode: "GREATER"
  }));
});

test('_parseMaskConfigure should works when mask tag was not specified', (t) => {
  t.truthy(parseTest(XMLRenderConfigUtility._parseMaskConfigure, "./Resources/Empty.xml", {}));
});

test('_parseMaskConfigure should works when empty mask tag was specified', (t) => {
  t.truthy(parseTest(XMLRenderConfigUtility._parseMaskConfigure, "./Resources/MaskConfig1.xml", {
    redMask: undefined,
    blueMask: undefined,
    greenMask: undefined,
    alphaMask: undefined,
    depthMask: undefined
  }));
});

test('_parseMaskConfigure should works when valid mask tag was specified', (t) => {
  t.truthy(parseTest(XMLRenderConfigUtility._parseMaskConfigure, "./Resources/MaskConfig2.xml", {
    redMask: true,
    blueMask: false,
    greenMask: true,
    alphaMask: true,
    depthMask: true
  }));
});
