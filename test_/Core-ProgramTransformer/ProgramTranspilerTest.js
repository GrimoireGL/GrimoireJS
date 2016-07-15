import test from 'ava';
import _ from 'lodash';
import ProgramTranspiler from '../../lib-es5/Core/ProgramTransformer/ProgramTranspiler';
import ProgramTransformer from '../../lib-es5/Core/ProgramTransformer/Transformer/Base/ProgramTransformer';
ProgramTranspiler.transformerGenerator = function() {
  return [
    new ProgramTransformer((t) => Promise.resolve(t)),
    new ProgramTransformer((t) => Promise.resolve({
      initialSource: t.initialSource,
      transformSource: "TEST2 SOURCE",
      description: {
        fragment: 0,
        vertex: 1,
        uniforms: 2,
        attributes: 3,
        fragmentPrecisions: 4,
        vertexPrecisions: 5,
        functions: 6
      }
    })),
    new ProgramTransformer((t) => Promise.resolve(t)),
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
    transformSource: "TEST2 SOURCE",
    description: {
      fragment: 0,
      vertex: 1,
      uniforms: 2,
      attributes: 3,
      fragmentPrecisions: 4,
      vertexPrecisions: 5,
      functions: 6
    }
  }));
});

test('parseCombined should work', async(t) => {
  const result = await ProgramTranspiler.parseCombined("TEST SOURCE");
  t.ok(_.isEqual(result, {
      fragment: 0,
      vertex: 1,
      uniforms: 2,
      attributes: 3,
      fragmentPrecisions: 4,
      vertexPrecisions: 5,
      functions: 6
    }));
});
