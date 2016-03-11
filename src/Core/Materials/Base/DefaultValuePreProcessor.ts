import ResourceManager from "../../ResourceManager";
import JThreeContext from "../../../JThreeContext";
import ContextComponents from "../../../ContextComponents";
import MatrixArray from "../../../Math/MatrixArray";
import VectorArray from "../../../Math/VectorArray";
import Matrix from "../../../Math/Matrix";
import Vector2 from "../../../Math/Vector2";
import Vector3 from "../../../Math/Vector3";
import Vector4 from "../../../Math/Vector4";
import IVariableDescription from "./IVariableDescription";
import isArray from "lodash.isarray";
import Q from "q";
class DefaultValuePreProcessor {
  public static preprocess(uniforms: { [name: string]: IVariableDescription }): Q.IPromise<void[]> {
    const tasks: Q.IPromise<void>[] = [];
    for (let variableName in uniforms) {
      const uniform = uniforms[variableName];
      if (!uniform.isArray) { // When this uniform is not array , just a element.
        switch (uniform.variableType) {
          case "float":
            tasks.push(DefaultValuePreProcessor._syncPromise(() => { DefaultValuePreProcessor._forFloat(uniform); }));
            break;
          case "vec2":
            tasks.push(DefaultValuePreProcessor._syncPromise(() => { DefaultValuePreProcessor._forVec2(uniform); }));
            break;
          case "vec3":
            tasks.push(DefaultValuePreProcessor._syncPromise(() => { DefaultValuePreProcessor._forVec3(uniform); }));
            break;
          case "vec4":
            tasks.push(DefaultValuePreProcessor._syncPromise(() => { DefaultValuePreProcessor._forVec4(uniform); }));
            break;
          case "mat4":
            tasks.push(DefaultValuePreProcessor._syncPromise(() => { DefaultValuePreProcessor._forMat4(uniform); }));
            break;
          case "sampler2D":
            tasks.push(DefaultValuePreProcessor._forSampler2D(uniform));
        }
      } else {
        // When this uniform is array.
        switch (uniform.variableType) {
          case "float":
            tasks.push(DefaultValuePreProcessor._syncPromise(() => { DefaultValuePreProcessor._forFloatArray(uniform); }));
            break;
          case "vec2":
            tasks.push(DefaultValuePreProcessor._syncPromise(() => { DefaultValuePreProcessor._forVectorarray(2, uniform); }));
            break;
          case "vec3":
            tasks.push(DefaultValuePreProcessor._syncPromise(() => { DefaultValuePreProcessor._forVectorarray(3, uniform); }));
            break;
          case "vec4":
            tasks.push(DefaultValuePreProcessor._syncPromise(() => { DefaultValuePreProcessor._forVectorarray(4, uniform); }));
            break;
          case "mat4":
            tasks.push(DefaultValuePreProcessor._syncPromise(() => { DefaultValuePreProcessor._forMat4Array(uniform); }));
            break;
        }
      }
    }
    return Q.all<void>(tasks);
  }

  private static _syncPromise(fn: any): Q.IPromise<void> {
    const defer = Q.defer<void>();
    process.nextTick(() => {
      try {
        fn();
      } catch (e) {
        defer.reject(e);
      }
      defer.resolve(null);
    });
    return defer.promise;
  }

  private static _forFloat(uniform: IVariableDescription): void {
    if (!uniform.variableAnnotation.default) {
      uniform.variableAnnotation.default = 0;
    }
  }

  private static _forFloatArray(uniform: IVariableDescription): void {
    const defaultArray = uniform.variableAnnotation.default;
    if (defaultArray) {
      if (defaultArray.length !== uniform.arrayLength) {
        throw new Error("specified array length is unmatch!");
      }
      uniform.variableAnnotation.default = defaultArray;
    } else {
      uniform.variableAnnotation.default = new Array(uniform.arrayLength);
      for (let i = 0; i < uniform.arrayLength; i++) {
        uniform.variableAnnotation.default[i] = 0; // [0,0,0.....0,0] will be used as default
      }
    }
  }

  private static _forVectorarray(dimension: number, uniform: IVariableDescription): void {
    const defaultArray = VectorArray.zeroVectorArray(dimension, uniform.arrayLength);
    const defaultValue = uniform.variableAnnotation.default;
    if (defaultArray) {
      if (isArray(defaultValue)) {
        if (isArray(defaultValue[0])) {
          for (let i = 0; i < defaultValue.length; i++) {
            defaultArray.setRawArray(i, defaultValue[i]);
          }
        } else {
          for (let i = 0; i < defaultValue.length; i++) {
            defaultArray.rawElements[i] = defaultValue[i];
          }
        }
      } else {
        throw new Error(`Unknown default value '${defaultValue}' was specified for variable '${uniform.variableType}[] ${uniform.variableName}'`);
      }
    }
    uniform.variableAnnotation.default = defaultArray;
  }

  private static _forVec2(uniform: IVariableDescription): void {
    const defaultValue = uniform.variableAnnotation.default;
    const annotations = uniform.variableAnnotation;
    if (defaultValue) {
      if (Array.isArray(defaultValue)) {
        annotations.default = new Vector2(defaultValue[0], defaultValue[1]); // parse array as vector
      } else if (typeof defaultValue === "string") {
        annotations.default = Vector2.parse(defaultValue); // parse string representation as vector
      } else {
        throw new Error(`Unknown default value '${defaultValue}' was specified for variable '${uniform.variableType} ${uniform.variableName}'`);
      }
    } else {
      annotations.default = new Vector2(0, 0); // use (0,0) as default when the default annotation was not specified
    }
  }

  private static _forVec3(uniform: IVariableDescription): void {
    const defaultValue = uniform.variableAnnotation.default;
    const annotations = uniform.variableAnnotation;
    if (defaultValue) {
      if (Array.isArray(defaultValue)) {
        annotations.default = new Vector3(defaultValue[0], defaultValue[1], defaultValue[2]); // parse array as vector
      } else if (typeof defaultValue === "string") {
        annotations.default = Vector3.parse(defaultValue); // parse string representation as vector
      } else {
        throw new Error(`Unknown default value '${defaultValue}' was specified for variable '${uniform.variableType} ${uniform.variableName}'`);
      }
    } else {
      annotations.default = new Vector3(0, 0, 0); // use (0,0,0) as default when the default annotation was not specified
    }
  }

  private static _forVec4(uniform: IVariableDescription): void {
    const defaultValue = uniform.variableAnnotation.default;
    const annotations = uniform.variableAnnotation;
    if (defaultValue) {
      if (Array.isArray(defaultValue)) {
        annotations.default = new Vector4(defaultValue[0], defaultValue[1], defaultValue[2], defaultValue[3]); // parse array as vector
      } else if (typeof defaultValue === "string") {
        annotations.default = Vector4.parse(defaultValue); // parse string representation as vector
      } else {
        throw new Error(`Unknown default value '${defaultValue}' was specified for variable '${uniform.variableType} ${uniform.variableName}'`);
      }
    } else {
      annotations.default = new Vector4(0, 0, 0, 0); // use (0,0,0,0) as default when the default annotation was not specified
    }
  }

  private static _forMat4(uniform: IVariableDescription): void {
    const defaultValue = uniform.variableAnnotation.default;
    const annotations = uniform.variableAnnotation;
    if (defaultValue) {
      if (Array.isArray(defaultValue)) {
        if (defaultValue.length !== 16) {
          throw new Error(`Default value for mat4 must have 16 elements`);
        }
        annotations.default = Matrix.fromElements.apply(Matrix, defaultValue);
      } else {
        throw new Error(`Unknown default value '${defaultValue}' was specified for variable '${uniform.variableType} ${uniform.variableName}'`);
      }
    } else {
      annotations.default = Matrix.identity();
    }
  }

  private static _forMat4Array(uniform: IVariableDescription): void {
    const defaultValue = uniform.variableAnnotation.default;
    uniform.variableAnnotation.default = MatrixArray.getIdentityMatrixArray(uniform.arrayLength);
    if (defaultValue) {
      if (isArray(defaultValue)) {
        for (let i = 0; i < defaultValue.length; i++) {
          uniform.variableAnnotation.default.rawElements[i] = defaultValue[i];
        }
      }
    }
  }

  private static _forSampler2D(uniform: IVariableDescription): Q.IPromise<void> {
    const defaultValue = uniform.variableAnnotation.default;
    if (defaultValue) {
      return DefaultValuePreProcessor._resourceManager.loadTexture(defaultValue).then((texture) => {
        uniform.variableAnnotation.default = texture;
      });
    } else {
      return DefaultValuePreProcessor._syncPromise(() => {
        uniform.variableAnnotation.default = null;
      });
    }
  }

  private static get _resourceManager(): ResourceManager {
    return JThreeContext.getContextComponent<ResourceManager>(ContextComponents.ResourceManager);
  }
}

export default DefaultValuePreProcessor;
