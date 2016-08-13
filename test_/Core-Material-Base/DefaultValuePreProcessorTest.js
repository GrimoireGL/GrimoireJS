import test from 'ava';
import _ from 'lodash';
import DefaultValuePreProcessor from '../../lib-es5/Core/Pass/DefaultValuePreProcessor';

import Vector2 from '../../lib-es5/Core/Math/Vector2';
import Vector3 from '../../lib-es5/Core/Math/Vector3';
import Vector4 from '../../lib-es5/Core/Math/Vector4';
import Matrix from '../../lib-es5/Core/Math/Matrix';
import VectorArray from '../../lib-es5/Core/Math/VectorArray';

test('should resolve when there was no uniform variable', async(t) => {
  const arg = {};
  await DefaultValuePreProcessor.preprocess(arg);
  t.truthy(_.isEqual(arg, {}));
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
      arrayLength: undefined,
      value: 0
    }
  };
  await DefaultValuePreProcessor.preprocess(arg);
  t.truthy(_.isEqual(arg, ideal));
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
      arrayLength: undefined,
      value: 2
    }
  };
  await DefaultValuePreProcessor.preprocess(arg);
  t.truthy(_.isEqual(arg, ideal));
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
      arrayLength: undefined,
      value: new Vector2(0, 0)
    }
  };
  await DefaultValuePreProcessor.preprocess(arg);
  t.truthy(arg.testVariable.variableAnnotation.default.equalWith(ideal.testVariable.variableAnnotation.default));
  arg.testVariable.variableAnnotation = ideal.testVariable.variableAnnotation = null;
  t.truthy(arg.testVariable.value.equalWith(ideal.testVariable.value));
  delete ideal.testVariable.value;
  delete arg.testVariable.value;
  t.truthy(_.isEqual(arg, ideal));
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
      arrayLength: undefined,
      value: new Vector2(1, 2)
    }
  };
  await DefaultValuePreProcessor.preprocess(arg);
  t.truthy(arg.testVariable.variableAnnotation.default.equalWith(ideal.testVariable.variableAnnotation.default));
  arg.testVariable.variableAnnotation = ideal.testVariable.variableAnnotation = null;
  t.truthy(arg.testVariable.value.equalWith(ideal.testVariable.value));
  delete arg.testVariable.value;
  delete ideal.testVariable.value;
  t.truthy(_.isEqual(arg, ideal));
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
      arrayLength: undefined,
      value: new Vector2(1, 2)
    }
  };
  await DefaultValuePreProcessor.preprocess(arg);
  t.truthy(arg.testVariable.variableAnnotation.default.equalWith(ideal.testVariable.variableAnnotation.default));
  arg.testVariable.variableAnnotation = ideal.testVariable.variableAnnotation = null;
  t.truthy(arg.testVariable.value.equalWith(ideal.testVariable.value));
  delete arg.testVariable.value;
  delete ideal.testVariable.value;
  t.truthy(_.isEqual(arg, ideal));
});

test('default value of vec2 with invalid value should throw error', (t) => {
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
      arrayLength: undefined,
      value: new Vector3(0, 0, 0)
    }
  };
  await DefaultValuePreProcessor.preprocess(arg);
  t.truthy(arg.testVariable.variableAnnotation.default.equalWith(ideal.testVariable.variableAnnotation.default));
  arg.testVariable.variableAnnotation = ideal.testVariable.variableAnnotation = null;
  t.truthy(arg.testVariable.value.equalWith(ideal.testVariable.value));
  delete arg.testVariable.value;
  delete ideal.testVariable.value;
  t.truthy(_.isEqual(arg, ideal));
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
      arrayLength: undefined,
      value: new Vector3(1, 2, 3)
    }
  };
  await DefaultValuePreProcessor.preprocess(arg);
  t.truthy(arg.testVariable.variableAnnotation.default.equalWith(ideal.testVariable.variableAnnotation.default));
  arg.testVariable.variableAnnotation = ideal.testVariable.variableAnnotation = null;
  t.truthy(arg.testVariable.value.equalWith(ideal.testVariable.value));
  delete arg.testVariable.value;
  delete ideal.testVariable.value;
  t.truthy(_.isEqual(arg, ideal));
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
      arrayLength: undefined,
      value: new Vector3(1, 2, 3)
    }
  };
  await DefaultValuePreProcessor.preprocess(arg);
  t.truthy(arg.testVariable.variableAnnotation.default.equalWith(ideal.testVariable.variableAnnotation.default));
  arg.testVariable.variableAnnotation = ideal.testVariable.variableAnnotation = null;
  t.truthy(arg.testVariable.value.equalWith(ideal.testVariable.value));
  delete arg.testVariable.value;
  delete ideal.testVariable.value;
  t.truthy(_.isEqual(arg, ideal));
});

test('default value of vec3 with invalid value should throw error', (t) => {
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
      arrayLength: undefined,
      value: new Vector4(0, 0, 0, 0)
    }
  };
  await DefaultValuePreProcessor.preprocess(arg);
  t.truthy(arg.testVariable.variableAnnotation.default.equalWith(ideal.testVariable.variableAnnotation.default));
  arg.testVariable.variableAnnotation = ideal.testVariable.variableAnnotation = null;
  t.truthy(arg.testVariable.value.equalWith(ideal.testVariable.value));
  delete arg.testVariable.value;
  delete ideal.testVariable.value;
  t.truthy(_.isEqual(arg, ideal));
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
      arrayLength: undefined,
      value: new Vector4(1, 2, 3, 4)
    }
  };
  await DefaultValuePreProcessor.preprocess(arg);
  t.truthy(arg.testVariable.variableAnnotation.default.equalWith(ideal.testVariable.variableAnnotation.default));
  arg.testVariable.variableAnnotation = ideal.testVariable.variableAnnotation = null;
  t.truthy(arg.testVariable.value.equalWith(ideal.testVariable.value));
  delete arg.testVariable.value;
  delete ideal.testVariable.value;
  t.truthy(_.isEqual(arg, ideal));
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
      arrayLength: undefined,
      value: new Vector4(1, 2, 3, 4)
    }
  };
  await DefaultValuePreProcessor.preprocess(arg);
  t.truthy(arg.testVariable.variableAnnotation.default.equalWith(ideal.testVariable.variableAnnotation.default));
  arg.testVariable.variableAnnotation = ideal.testVariable.variableAnnotation = null;
  t.truthy(arg.testVariable.value.equalWith(ideal.testVariable.value));
  delete arg.testVariable.value; delete ideal.testVariable.value;
  t.truthy(_.isEqual(arg, ideal));
});

test('default value of vec4 with invalid value should throw error', (t) => {
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

test('default value of mat4 should be identical matrix when default attribute was not specified', async(t) => {
  const arg = {
    "testVariable": {
      variableName: "testVariable",
      variableType: "mat4",
      variablePrecision: undefined,
      variableAnnotation: {},
      isArray: false,
      arrayLength: undefined
    }
  };
  const ideal = {
    "testVariable": {
      variableName: "testVariable",
      variableType: "mat4",
      variablePrecision: undefined,
      variableAnnotation: {
        default: Matrix.identity()
      },
      isArray: false,
      arrayLength: undefined,
      value:Matrix.identity()
    }
  };
  await DefaultValuePreProcessor.preprocess(arg);
  t.truthy(arg.testVariable.variableAnnotation.default.equalWith(ideal.testVariable.variableAnnotation.default));
  arg.testVariable.variableAnnotation = ideal.testVariable.variableAnnotation = null;
  t.truthy(arg.testVariable.value.equalWith(ideal.testVariable.value));
  delete arg.testVariable.value;delete ideal.testVariable.value;
  t.truthy(_.isEqual(arg, ideal));
});

test('default value of mat4 should be initialized with array', async(t) => {
  const arg = {
    "testVariable": {
      variableName: "testVariable",
      variableType: "mat4",
      variablePrecision: undefined,
      variableAnnotation: {
        default: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
      },
      isArray: false,
      arrayLength: undefined
    }
  };
  const ideal = {
    "testVariable": {
      variableName: "testVariable",
      variableType: "mat4",
      variablePrecision: undefined,
      variableAnnotation: {
        default: Matrix.transpose(new Matrix([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]))
      },
      isArray: false,
      arrayLength: undefined,
      value: Matrix.transpose(new Matrix([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]))
    }
  };
  await DefaultValuePreProcessor.preprocess(arg);
  t.truthy(arg.testVariable.variableAnnotation.default.equalWith(ideal.testVariable.variableAnnotation.default));
  arg.testVariable.variableAnnotation = ideal.testVariable.variableAnnotation = null;
  t.truthy(arg.testVariable.value.equalWith(ideal.testVariable.value));
  delete arg.testVariable.value;delete ideal.testVariable.value;
  t.truthy(_.isEqual(arg, ideal));
});

test('mat4 default value preprocess should throw error when the length was invalid', (t) => {
  const arg = {
    "testVariable": {
      variableName: "testVariable",
      variableType: "mat4",
      variablePrecision: undefined,
      variableAnnotation: {
        default: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]
      },
      isArray: false,
      arrayLength: undefined
    }
  };
  t.throws(DefaultValuePreProcessor.preprocess(arg));
});

test('default value of float array should be 0 when default attribute was not specified', async(t) => {
  const arg = {
    "testVariable": {
      variableName: "testVariable",
      variableType: "float",
      variablePrecision: undefined,
      variableAnnotation: {},
      isArray: true,
      arrayLength: 3
    }
  };
  const ideal = {
    "testVariable": {
      variableName: "testVariable",
      variableType: "float",
      variablePrecision: undefined,
      variableAnnotation: {
        default: [0, 0, 0]
      },
      isArray: true,
      arrayLength: 3
    }
  };
  await DefaultValuePreProcessor.preprocess(arg);
  delete arg.testVariable.value; delete ideal.testVariable.value;
  t.truthy(_.isEqual(arg, ideal));
});

test('default value of float array should be initialized properly', async(t) => {
  const arg = {
    "testVariable": {
      variableName: "testVariable",
      variableType: "float",
      variablePrecision: undefined,
      variableAnnotation: {
        default: [1, 2, 3]
      },
      isArray: true,
      arrayLength: 3
    }
  };
  const ideal = {
    "testVariable": {
      variableName: "testVariable",
      variableType: "float",
      variablePrecision: undefined,
      variableAnnotation: {
        default: [1, 2, 3]
      },
      isArray: true,
      arrayLength: 3
    }
  };
  await DefaultValuePreProcessor.preprocess(arg);
  delete arg.testVariable.value; delete ideal.testVariable.value;
  t.truthy(_.isEqual(arg, ideal));
});

test('default value of float array must throw an error when array with unmatch length was specified', (t) => {
  const arg = {
    "testVariable": {
      variableName: "testVariable",
      variableType: "float",
      variablePrecision: undefined,
      variableAnnotation: {
        default: [1, 2, 3, 4]
      },
      isArray: true,
      arrayLength: 3
    }
  };
  t.throws(DefaultValuePreProcessor.preprocess(arg));
});

test('default value of vec2 array must throw an error when unknown type default value was specified', (t) => {
  const arg = {
    "testVariable": {
      variableName: "testVariable",
      variableType: "vec2",
      variablePrecision: undefined,
      variableAnnotation: {
        default: ""
      },
      isArray: true,
      arrayLength: 3
    }
  };
  t.throws(DefaultValuePreProcessor.preprocess(arg));
});

test('default value of vec3 array must throw an error when unknown type default value was specified', (t) => {
  const arg = {
    "testVariable": {
      variableName: "testVariable",
      variableType: "vec3",
      variablePrecision: undefined,
      variableAnnotation: {
        default: ""
      },
      isArray: true,
      arrayLength: 3
    }
  };
  t.throws(DefaultValuePreProcessor.preprocess(arg));
});

test('default value of vec4 array must throw an error when unknown type default value was specified', (t) => {
  const arg = {
    "testVariable": {
      variableName: "testVariable",
      variableType: "vec4",
      variablePrecision: undefined,
      variableAnnotation: {
        default: ""
      },
      isArray: true,
      arrayLength: 3
    }
  };
  t.throws(DefaultValuePreProcessor.preprocess(arg));
});

test('default value of vec2 array should be initialized with array', async(t) => {
  const arg = {
    "testVariable": {
      variableName: "testVariable",
      variableType: "vec2",
      variablePrecision: undefined,
      variableAnnotation: {
        default: [1, 1, 2, 2, 3, 3]
      },
      isArray: true,
      arrayLength: 3
    }
  };
  const ideal = {
    "testVariable": {
      variableName: "testVariable",
      variableType: "vec2",
      variablePrecision: undefined,
      variableAnnotation: {
        default: VectorArray.fromArray(2, [1, 1, 2, 2, 3, 3])
      },
      isArray: true,
      arrayLength: 3
    }
  };
  await DefaultValuePreProcessor.preprocess(arg);
  t.truthy(arg.testVariable.variableAnnotation.default.equalWith(ideal.testVariable.variableAnnotation.default));
  arg.testVariable.variableAnnotation = ideal.testVariable.variableAnnotation = null;
  delete arg.testVariable.value; delete ideal.testVariable.value;
  t.truthy(_.isEqual(arg, ideal));
});

test('default value of vec2 array should be initialized with squared array', async(t) => {
  const arg = {
    "testVariable": {
      variableName: "testVariable",
      variableType: "vec2",
      variablePrecision: undefined,
      variableAnnotation: {
        default: [
          [1, 1],
          [2, 2],
          [3, 3]
        ]
      },
      isArray: true,
      arrayLength: 3
    }
  };
  const ideal = {
    "testVariable": {
      variableName: "testVariable",
      variableType: "vec2",
      variablePrecision: undefined,
      variableAnnotation: {
        default: VectorArray.fromArray(2, [1, 1, 2, 2, 3, 3])
      },
      isArray: true,
      arrayLength: 3
    }
  };
  await DefaultValuePreProcessor.preprocess(arg);
  t.truthy(arg.testVariable.variableAnnotation.default.equalWith(ideal.testVariable.variableAnnotation.default));
  arg.testVariable.variableAnnotation = ideal.testVariable.variableAnnotation = null;
  delete arg.testVariable.value; delete ideal.testVariable.value;
  t.truthy(_.isEqual(arg, ideal));
});

test('default value of vec3 array should be initialized with array', async(t) => {
  const arg = {
    "testVariable": {
      variableName: "testVariable",
      variableType: "vec3",
      variablePrecision: undefined,
      variableAnnotation: {
        default: [1, 1, 1, 2, 2, 2, 3, 3, 3]
      },
      isArray: true,
      arrayLength: 3
    }
  };
  const ideal = {
    "testVariable": {
      variableName: "testVariable",
      variableType: "vec3",
      variablePrecision: undefined,
      variableAnnotation: {
        default: VectorArray.fromArray(3, [1, 1, 1, 2, 2, 2, 3, 3, 3])
      },
      isArray: true,
      arrayLength: 3
    }
  };
  await DefaultValuePreProcessor.preprocess(arg);
  t.truthy(arg.testVariable.variableAnnotation.default.equalWith(ideal.testVariable.variableAnnotation.default));
  arg.testVariable.variableAnnotation = ideal.testVariable.variableAnnotation = null;
  delete arg.testVariable.value; delete ideal.testVariable.value;
  t.truthy(_.isEqual(arg, ideal));
});

test('default value of vec3 array should be initialized with squared array', async(t) => {
  const arg = {
    "testVariable": {
      variableName: "testVariable",
      variableType: "vec3",
      variablePrecision: undefined,
      variableAnnotation: {
        default: [
          [1, 1, 1],
          [2, 2, 2],
          [3, 3, 3]
        ]
      },
      isArray: true,
      arrayLength: 3
    }
  };
  const ideal = {
    "testVariable": {
      variableName: "testVariable",
      variableType: "vec3",
      variablePrecision: undefined,
      variableAnnotation: {
        default: VectorArray.fromArray(3, [1, 1, 1, 2, 2, 2, 3, 3, 3])
      },
      isArray: true,
      arrayLength: 3
    }
  };
  await DefaultValuePreProcessor.preprocess(arg);
  t.truthy(arg.testVariable.variableAnnotation.default.equalWith(ideal.testVariable.variableAnnotation.default));
  arg.testVariable.variableAnnotation = ideal.testVariable.variableAnnotation = null;
  delete arg.testVariable.value; delete ideal.testVariable.value;
  t.truthy(_.isEqual(arg, ideal));
});

test('default value of vec4 array should be initialized with array', async(t) => {
  const arg = {
    "testVariable": {
      variableName: "testVariable",
      variableType: "vec4",
      variablePrecision: undefined,
      variableAnnotation: {
        default: [1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3]
      },
      isArray: true,
      arrayLength: 3
    }
  };
  const ideal = {
    "testVariable": {
      variableName: "testVariable",
      variableType: "vec4",
      variablePrecision: undefined,
      variableAnnotation: {
        default: VectorArray.fromArray(4, [1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3])
      },
      isArray: true,
      arrayLength: 3
    }
  };
  await DefaultValuePreProcessor.preprocess(arg);
  t.truthy(arg.testVariable.variableAnnotation.default.equalWith(ideal.testVariable.variableAnnotation.default));
  arg.testVariable.variableAnnotation = ideal.testVariable.variableAnnotation = null;
  delete arg.testVariable.value; delete ideal.testVariable.value;
  t.truthy(_.isEqual(arg, ideal));
});

test('default value of vec4 array should be initialized with squared array', async(t) => {
  const arg = {
    "testVariable": {
      variableName: "testVariable",
      variableType: "vec4",
      variablePrecision: undefined,
      variableAnnotation: {
        default: [
          [1, 1, 1, 1],
          [2, 2, 2, 2],
          [3, 3, 3, 3]
        ]
      },
      isArray: true,
      arrayLength: 3
    }
  };
  const ideal = {
    "testVariable": {
      variableName: "testVariable",
      variableType: "vec4",
      variablePrecision: undefined,
      variableAnnotation: {
        default: VectorArray.fromArray(4, [1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3])
      },
      isArray: true,
      arrayLength: 3
    }
  };
  await DefaultValuePreProcessor.preprocess(arg);
  t.truthy(arg.testVariable.variableAnnotation.default.equalWith(ideal.testVariable.variableAnnotation.default));
  arg.testVariable.variableAnnotation = ideal.testVariable.variableAnnotation = null;
  delete arg.testVariable.value; delete ideal.testVariable.value;
  t.truthy(_.isEqual(arg, ideal));
});
