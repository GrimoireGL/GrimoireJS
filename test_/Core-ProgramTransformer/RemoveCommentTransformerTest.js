import test from 'ava';
import fs from 'fs';
import _ from 'lodash';
import RemoveCommentTransformer from '../../lib-es5/Core/ProgramTransformer/Transformer/RemoveCommentTransformer';

test('RemoveCommentTransformer works properly', async(t) => {
  const source = require("./Resources/RemoveCommentTest.glsl");
  const result = await (new RemoveCommentTransformer()).transform({
    initialSource: source,
    transformSource: source,
    description: null
  });
  t.truthy(_.isEqual(result, {
    initialSource: source,
    transformSource: '\n\nuniform float power;\n\n\nuniform vec2 coef;\n\n\nuniform  vec3  comment;\n',
    description: null
  }));
});
