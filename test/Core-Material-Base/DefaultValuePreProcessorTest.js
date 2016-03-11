import test from 'ava';
import _ from 'lodash';
import DefaultValuePreProcessor from '../../lib/Core/Materials/Base/DefaultValuePreProcessor';

import Vector2 from '../../lib/Math/Vector2';
import Vector3 from '../../lib/Math/Vector3';
import Vector4 from '../../lib/Math/Vector4';

test('should resolve when there was no uniform variable', async(t) => {
  const arg = {};
  await DefaultValuePreProcessor.preprocess(arg);
  t.ok(_.isEqual(arg, {}));
});

test('default value of float should be 0 when default attribute was not specified', async(t) => {
  const arg = {
    "testVariable": {
      variableName: "testVariable",
      variableType: "float",
      variablePrecision: undefined,
      variableAnnotation: {},
      isArray: false,
      arrayLength: undefined
    }
  };
  const ideal = {
    "testVariable": {
      variableName: "testVariable",
      variableType: "float",
      variablePrecision: undefined,
      variableAnnotation: {
        default: 0
      },
      isArray: false,
      arrayLength: undefined
    }
  };
  await DefaultValuePreProcessor.preprocess(arg);
  t.ok(_.isEqual(arg, ideal));
});

test('default value of float should be initialized properly', async(t) => {
  const arg = {
    "testVariable": {
      variableName: "testVariable",
      variableType: "float",
      variablePrecision: undefined,
      variableAnnotation: {
        default: 2
      },
      isArray: false,
      arrayLength: undefined
    }
  };
  const ideal = {
    "testVariable": {
      variableName: "testVariable",
      variableType: "float",
      variablePrecision: undefined,
      variableAnnotation: {
        default: 2
      },
      isArray: false,
      arrayLength: undefined
    }
  };
  await DefaultValuePreProcessor.preprocess(arg);
  t.ok(_.isEqual(arg, ideal));
});

test('default value of vec2 should be (0,0) when default attribute was not specified', async(t) => {
  const arg = {
    "testVariable": {
      variableName: "testVariable",
      variableType: "vec2",
      variablePrecision: undefined,
      variableAnnotation: {},
      isArray: false,
      arrayLength: undefined
    }
  };
  const ideal = {
    "testVariable": {
      variableName: "testVariable",
      variableType: "vec2",
      variablePrecision: undefined,
      variableAnnotation: {
        default: new Vector2(0, 0)
      },
      isArray: false,
      arrayLength: undefined
    }
  };
  await DefaultValuePreProcessor.preprocess(arg);
  t.ok(arg.testVariable.variableAnnotation.default.equalWith(ideal.testVariable.variableAnnotation.default));
  arg.testVariable.variableAnnotation = ideal.testVariable.variableAnnotation = null;
  t.ok(_.isEqual(arg, ideal));
});

test('default value of vec2 should be initialized with array', async(t) => {
  const arg = {
    "testVariable": {
      variableName: "testVariable",
      variableType: "vec2",
      variablePrecision: undefined,
      variableAnnotation: {
        default: [1, 2]
      },
      isArray: false,
      arrayLength: undefined
    }
  };
  const ideal = {
    "testVariable": {
      variableName: "testVariable",
      variableType: "vec2",
      variablePrecision: undefined,
      variableAnnotation: {
        default: new Vector2(1, 2)
      },
      isArray: false,
      arrayLength: undefined
    }
  };
  await DefaultValuePreProcessor.preprocess(arg);
  t.ok(arg.testVariable.variableAnnotation.default.equalWith(ideal.testVariable.variableAnnotation.default));
  arg.testVariable.variableAnnotation = ideal.testVariable.variableAnnotation = null;
  t.ok(_.isEqual(arg, ideal));
});

test('default value of vec2 should be initialized with string', async(t) => {
  const arg = {
    "testVariable": {
      variableName: "testVariable",
      variableType: "vec2",
      variablePrecision: undefined,
      variableAnnotation: {
        default: "(1,2)"
      },
      isArray: false,
      arrayLength: undefined
    }
  };
  const ideal = {
    "testVariable": {
      variableName: "testVariable",
      variableType: "vec2",
      variablePrecision: undefined,
      variableAnnotation: {
        default: new Vector2(1, 2)
      },
      isArray: false,
      arrayLength: undefined
    }
  };
  await DefaultValuePreProcessor.preprocess(arg);
  t.ok(arg.testVariable.variableAnnotation.default.equalWith(ideal.testVariable.variableAnnotation.default));
  arg.testVariable.variableAnnotation = ideal.testVariable.variableAnnotation = null;
  t.ok(_.isEqual(arg, ideal));
});

test('default value of invalid value should throw error', (t) => {
  const arg = {
    "testVariable": {
      variableName: "testVariable",
      variableType: "vec2",
      variablePrecision: undefined,
      variableAnnotation: {
        default: "(1,HELLO)"
      },
      isArray: false,
      arrayLength: undefined
    }
  };
  t.throws(DefaultValuePreProcessor.preprocess(arg));
});

test('default value of vec3 should be Zero vector when default attribute was not specified', async(t) => {
  const arg = {
    "testVariable": {
      variableName: "testVariable",
      variableType: "vec3",
      variablePrecision: undefined,
      variableAnnotation: {},
      isArray: false,
      arrayLength: undefined
    }
  };
  const ideal = {
    "testVariable": {
      variableName: "testVariable",
      variableType: "vec3",
      variablePrecision: undefined,
      variableAnnotation: {
        default: new Vector3(0, 0, 0)
      },
      isArray: false,
      arrayLength: undefined
    }
  };
  await DefaultValuePreProcessor.preprocess(arg);
  t.ok(arg.testVariable.variableAnnotation.default.equalWith(ideal.testVariable.variableAnnotation.default));
  arg.testVariable.variableAnnotation = ideal.testVariable.variableAnnotation = null;
  t.ok(_.isEqual(arg, ideal));
});

test('default value of vec3 should be initialized with array', async(t) => {
  const arg = {
    "testVariable": {
      variableName: "testVariable",
      variableType: "vec3",
      variablePrecision: undefined,
      variableAnnotation: {
        default: [1, 2, 3]
      },
      isArray: false,
      arrayLength: undefined
    }
  };
  const ideal = {
    "testVariable": {
      variableName: "testVariable",
      variableType: "vec3",
      variablePrecision: undefined,
      variableAnnotation: {
        default: new Vector3(1, 2, 3)
      },
      isArray: false,
      arrayLength: undefined
    }
  };
  await DefaultValuePreProcessor.preprocess(arg);
  t.ok(arg.testVariable.variableAnnotation.default.equalWith(ideal.testVariable.variableAnnotation.default));
  arg.testVariable.variableAnnotation = ideal.testVariable.variableAnnotation = null;
  t.ok(_.isEqual(arg, ideal));
});

test('default value of vec3 should be initialized with string', async(t) => {
  const arg = {
    "testVariable": {
      variableName: "testVariable",
      variableType: "vec3",
      variablePrecision: undefined,
      variableAnnotation: {
        default: "(1,2,3)"
      },
      isArray: false,
      arrayLength: undefined
    }
  };
  const ideal = {
    "testVariable": {
      variableName: "testVariable",
      variableType: "vec3",
      variablePrecision: undefined,
      variableAnnotation: {
        default: new Vector3(1, 2, 3)
      },
      isArray: false,
      arrayLength: undefined
    }
  };
  await DefaultValuePreProcessor.preprocess(arg);
  t.ok(arg.testVariable.variableAnnotation.default.equalWith(ideal.testVariable.variableAnnotation.default));
  arg.testVariable.variableAnnotation = ideal.testVariable.variableAnnotation = null;
  t.ok(_.isEqual(arg, ideal));
});

test('default value of invalid value should throw error', (t) => {
  const arg = {
    "testVariable": {
      variableName: "testVariable",
      variableType: "vec3",
      variablePrecision: undefined,
      variableAnnotation: {
        default: "(1,2,HELLO)"
      },
      isArray: false,
      arrayLength: undefined
    }
  };
  t.throws(DefaultValuePreProcessor.preprocess(arg));
});

test('default value of vec4 should be Zero vector when default attribute was not specified', async(t) => {
  const arg = {
    "testVariable": {
      variableName: "testVariable",
      variableType: "vec4",
      variablePrecision: undefined,
      variableAnnotation: {},
      isArray: false,
      arrayLength: undefined
    }
  };
  const ideal = {
    "testVariable": {
      variableName: "testVariable",
      variableType: "vec4",
      variablePrecision: undefined,
      variableAnnotation: {
        default: new Vector4(0, 0, 0, 0)
      },
      isArray: false,
      arrayLength: undefined
    }
  };
  await DefaultValuePreProcessor.preprocess(arg);
  t.ok(arg.testVariable.variableAnnotation.default.equalWith(ideal.testVariable.variableAnnotation.default));
  arg.testVariable.variableAnnotation = ideal.testVariable.variableAnnotation = null;
  t.ok(_.isEqual(arg, ideal));
});

test('default value of vec4 should be initialized with array', async(t) => {
  const arg = {
    "testVariable": {
      variableName: "testVariable",
      variableType: "vec4",
      variablePrecision: undefined,
      variableAnnotation: {
        default: [1, 2, 3, 4]
      },
      isArray: false,
      arrayLength: undefined
    }
  };
  const ideal = {
    "testVariable": {
      variableName: "testVariable",
      variableType: "vec4",
      variablePrecision: undefined,
      variableAnnotation: {
        default: new Vector4(1, 2, 3, 4)
      },
      isArray: false,
      arrayLength: undefined
    }
  };
  await DefaultValuePreProcessor.preprocess(arg);
  t.ok(arg.testVariable.variableAnnotation.default.equalWith(ideal.testVariable.variableAnnotation.default));
  arg.testVariable.variableAnnotation = ideal.testVariable.variableAnnotation = null;
  t.ok(_.isEqual(arg, ideal));
});

test('default value of vec4 should be initialized with string', async(t) => {
  const arg = {
    "testVariable": {
      variableName: "testVariable",
      variableType: "vec4",
      variablePrecision: undefined,
      variableAnnotation: {
        default: "(1,2,3,4)"
      },
      isArray: false,
      arrayLength: undefined
    }
  };
  const ideal = {
    "testVariable": {
      variableName: "testVariable",
      variableType: "vec4",
      variablePrecision: undefined,
      variableAnnotation: {
        default: new Vector4(1, 2, 3, 4)
      },
      isArray: false,
      arrayLength: undefined
    }
  };
  await DefaultValuePreProcessor.preprocess(arg);
  t.ok(arg.testVariable.variableAnnotation.default.equalWith(ideal.testVariable.variableAnnotation.default));
  arg.testVariable.variableAnnotation = ideal.testVariable.variableAnnotation = null;
  t.ok(_.isEqual(arg, ideal));
});

test('default value of invalid value should throw error', (t) => {
  const arg = {
    "testVariable": {
      variableName: "testVariable",
      variableType: "vec4",
      variablePrecision: undefined,
      variableAnnotation: {
        default: "(1,2,3,HELLO)"
      },
      isArray: false,
      arrayLength: undefined
    }
  };
  t.throws(DefaultValuePreProcessor.preprocess(arg));
});
