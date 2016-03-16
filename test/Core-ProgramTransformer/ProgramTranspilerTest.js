import test from 'ava';
import _ from 'lodash';
import ProgramTranspiler from '../../lib/Core/ProgramTransformer/ProgramTranspiler';
import ProgramTransformer from '../../lib/Core/ProgramTransformer/Transformer/Base/ProgramTransformer';
ProgramTranspiler.transformerGenerator = function() {
  return [
    new ProgramTransformer((t) => Promise.resolve(t)),
    new ProgramTransformer((t) => Promise.resolve(t))
  ];
}
test('should transform link completed even if the transformer was empty', async(t) => {
  const result = await ProgramTranspiler.transform("TEST SOURCE", []);
  t.ok(_.isEqual(result, {
    initialSource: "TEST SOURCE",
    transformSource: "TEST SOURCE",
    description: {
      fragment: null,
      vertex: null,
      uniforms: null,
      attributes: null,
      fragmentPrecisions: null,
      vertexPrecisions: null,
      functions: null
    }
  }));
});

test('should transform link completed even if the transformer was specified', async(t) => {
  const result = await ProgramTranspiler.transform("TEST SOURCE", ProgramTranspiler.transformerGenerator());
  t.ok(_.isEqual(result, {
    initialSource: "TEST SOURCE",
    transformSource: "TEST SOURCE",
    description: {
      fragment: null,
      vertex: null,
      uniforms: null,
      attributes: null,
      fragmentPrecisions: null,
      vertexPrecisions: null,
      functions: null
    }
  }));
});

test('parseCombined should work', async(t) => {
  const result = await ProgramTranspiler.parseCombined("TEST SOURCE");
  t.ok(_.isEqual(result, {
      fragment: null,
      vertex: null,
      uniforms: null,
      attributes: null,
      fragmentPrecisions: null,
      vertexPrecisions: null,
      functions: null
    }));
});
