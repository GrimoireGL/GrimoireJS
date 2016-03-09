import test from 'ava';
import jsdom from 'jsdom';
import _ from 'lodash';
import fs from 'fs';
import XMLRenderConfigUtility from '../../lib/Core/Materials/Base/XMLRenderConfigUtility';

function readText(path) {
  return fs.readFileSync(path, {
    encoding: "utf-8"
  });
}

function readDom(path) {
  return jsdom.jsdom(readText(path));
}

function parseTest(func, path, def, ideal) {
  const result = {};
  func(readDom(path), def, result);
  return _.isEqual(ideal, result);
}

test('_parseBoolean works well', (t) => {
  t.ok(XMLRenderConfigUtility._parseBoolean(undefined, true));
  t.ok(!XMLRenderConfigUtility._parseBoolean(undefined, false));
  t.ok(XMLRenderConfigUtility._parseBoolean("true", true));
  t.ok(!XMLRenderConfigUtility._parseBoolean("false", false));
});

test('_parseCullConfigure should works when cull element is not existing', (t) => {
  t.ok(parseTest(XMLRenderConfigUtility._parseCullConfigure, "./Resources/Empty.xml", {
    cullOrientation: "BACK"
  }, {
    cullOrientation: "BACK"
  }));
});

test('_parseCullConfigure should works when empty cull element was specified', (t) => {
  t.ok(parseTest(XMLRenderConfigUtility._parseCullConfigure, "./Resources/CullConfig1.xml", {
    cullOrientation: "BACK"
  }, {
    cullOrientation: "BACK"
  }));
});

test('_parseCullConfigure should works when mode was specified', (t) => {
  t.ok(parseTest(XMLRenderConfigUtility._parseCullConfigure, "./Resources/CullConfig2.xml", {
    cullOrientation: "BACK"
  }, {
    cullOrientation: "FRONT"
  }));
});

test('_parseBlendConfigure should works when blend element was not existing', (t) => {
  t.ok(parseTest(XMLRenderConfigUtility._parseBlendConfigure, "./Resources/Empty.xml", {
    blendEnabled: true,
    blendSrcFactor: "ONE",
    blendDstFactor: "ONE"
  }, {
    blendEnabled: true,
    blendSrcFactor: "ONE",
    blendDstFactor: "ONE"
  }));
});

test('_parseBlendConfigure should works when empty blend tag was specified', (t) => {
  t.ok(parseTest(XMLRenderConfigUtility._parseBlendConfigure, "./Resources/BlendConfig1.xml", {
    blendEnabled: true,
    blendSrcFactor: "ONE",
    blendDstFactor: "ONE"
  }, {
    blendEnabled: true,
    blendSrcFactor: "ONE",
    blendDstFactor: "ONE"
  }));
});

test('_parseBlendConfigure should works when empty blend tag was specified', (t) => {
  t.ok(parseTest(XMLRenderConfigUtility._parseBlendConfigure, "./Resources/BlendConfig2.xml", {
    blendEnabled: true,
    blendSrcFactor: "ONE",
    blendDstFactor: "ONE"
  }, {
    blendEnabled: true,
    blendSrcFactor: "SRC_COLOR",
    blendDstFactor: "DST_COLOR"
  }));
});
