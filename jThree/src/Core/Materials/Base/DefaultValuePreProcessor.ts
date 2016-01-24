import Matrix = require("../../../Math/Matrix");
import Vector2 = require("../../../Math/Vector2");
import Vector3 = require("../../../Math/Vector3");
import Vector4 = require("../../../Math/Vector4");
import IVariableInfo = require("./IVariableInfo");
class DefaultValuePreProcessor {
  public static preprocess(uniforms: { [name: string]: IVariableInfo }): void {
    for (let variableName in uniforms) {
      const uniform = uniforms[variableName];
      if (!uniform.isArray) { // When this uniform is not array , just a element.
        switch (uniform.variableType) {
          case "float":
            DefaultValuePreProcessor._forFloat(variableName, uniform);
            continue;
          case "vec2":
            DefaultValuePreProcessor._forVec2(variableName, uniform);
            continue;
          case "vec3":
            DefaultValuePreProcessor._forVec3(variableName, uniform);
            continue;
          case "vec4":
            DefaultValuePreProcessor._forVec4(variableName, uniform);
            continue;
          case "mat4":
            DefaultValuePreProcessor._forMat4(variableName, uniform);
            continue;
        }
      } else {
        // When this uniform is array.
        switch (uniform.variableType) {
          case "float":
            DefaultValuePreProcessor._forFloatArray(variableName, uniform);
            continue;
        }
      }
    }
  }

  private static _forFloat(name: string, uniform: IVariableInfo): void {
    if (!uniform["default"]) {
      uniform.variableAnnotation["default"] = 0;
    }
  }

  private static _forFloatArray(name: string, uniform: IVariableInfo): void {
    if (!uniform["default"]) {
      const defaultValue = new Array(uniform.arrayLength);
      for (let i = 0; i < defaultValue.length; i++) {
        defaultValue[i] = 0; // [0,0,0.....0,0] will be used as default
      }
      uniform.variableAnnotation["default"] = defaultValue;
    }
  }

  private static _forVec2(name: string, uniform: IVariableInfo): void {
    const defaultValue = uniform.variableAnnotation["default"];
    const annotations = uniform.variableAnnotation;
    if (defaultValue) {
      if (Array.isArray(defaultValue)) {
        annotations["default"] = new Vector2(defaultValue[0], defaultValue[1]); // parse array as vector
      } else if (typeof defaultValue === "string") {
        annotations["default"] = Vector2.parse(defaultValue); // parse string representation as vector
      } else {
        console.error(`Unknown default value ${defaultValue}`);
        annotations["default"] = new Vector2(0, 0);
      }
    } else {
      annotations["default"] = new Vector2(0, 0); // use (0,0) as default when the default annotation was not specified
    }
  }

  private static _forVec3(name: string, uniform: IVariableInfo): void {
    const defaultValue = uniform.variableAnnotation["default"];
    const annotations = uniform.variableAnnotation;
    if (defaultValue) {
      if (Array.isArray(defaultValue)) {
        annotations["default"] = new Vector3(defaultValue[0], defaultValue[1], defaultValue[2]); // parse array as vector
      } else if (typeof defaultValue === "string") {
        annotations["default"] = Vector3.parse(defaultValue); // parse string representation as vector
      } else {
        console.error(`Unknown default value ${defaultValue}`);
        annotations["default"] = new Vector3(0, 0, 0);
      }
    } else {
      annotations["default"] = new Vector3(0, 0, 0); // use (0,0,0) as default when the default annotation was not specified
    }
  }

  private static _forVec4(name: string, uniform: IVariableInfo): void {
    const defaultValue = uniform.variableAnnotation["default"];
    const annotations = uniform.variableAnnotation;
    if (defaultValue) {
      if (Array.isArray(defaultValue)) {
        annotations["default"] = new Vector4(defaultValue[0], defaultValue[1], defaultValue[2], defaultValue[3]); // parse array as vector
      } else if (typeof defaultValue === "string") {
        annotations["default"] = Vector4.parse(defaultValue); // parse string representation as vector
      } else {
        console.error(`Unknown default value ${defaultValue}`);
        annotations["default"] = new Vector4(0, 0, 0, 0);
      }
    } else {
      annotations["default"] = new Vector4(0, 0, 0, 0); // use (0,0,0,0) as default when the default annotation was not specified
    }
  }

  private static _forMat4(name: string, uniform: IVariableInfo): void {
    const defaultValue = uniform.variableAnnotation["default"];
    const annotations = uniform.variableAnnotation;
    if (defaultValue) {
      if (Array.isArray(defaultValue)) {
        annotations["default"] = Matrix.fromElements.apply(defaultValue);
      } else {
        console.error(`Unknown default value ${defaultValue}`);
        annotations["default"] = Matrix.identity();
      }
    } else {
      annotations["default"] = Matrix.identity();
    }
  }
}

export = DefaultValuePreProcessor;
