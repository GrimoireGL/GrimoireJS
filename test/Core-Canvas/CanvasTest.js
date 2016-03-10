import test from 'ava';

import Canvas from '../../lib/Core/Canvas/Canvas';
import sinon from 'sinon';

import gl from '../glTestInitializer';


test('Canvas should initialized with valid context', (t) => {
  const canvasMock = {
    width: 512,
    height: 512,
    getContext: function() {},
    addEventListener: function() {}
  };
  const mock = sinon.mock(canvasMock);
  mock.expects("getContext").once().returns(gl);
  const canvas = new Canvas(canvasMock);
  t.ok(canvas.canvasElement === canvasMock);
  t.ok(canvas.gl === gl);
  mock.verify();
});

test('Canvas should initialized with experimental-webgl context', (t) => {
  const canvasMock = {
    width: 512,
    height: 512,
    getContext: function(context) {
      if (context === "experimental-webgl") return gl;
      else {
        return null;
      }
    },
    addEventListener: function() {}
  };
  const mock = sinon.mock(canvasMock);
  const canvas = new Canvas(canvasMock);
  t.ok(canvas.canvasElement === canvasMock);
  t.ok(canvas.gl === gl);
  mock.verify();
});
