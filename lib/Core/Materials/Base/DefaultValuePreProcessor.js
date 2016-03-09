import MatrixArray from "../../../Math/MatrixArray";
import VectorArray from "../../../Math/VectorArray";
import Matrix from "../../../Math/Matrix";
import Vector2 from "../../../Math/Vector2";
import Vector3 from "../../../Math/Vector3";
import Vector4 from "../../../Math/Vector4";
import isArray from "lodash.isarray";
class DefaultValuePreProcessor {
    static preprocess(uniforms) {
        for (let variableName in uniforms) {
            const uniform = uniforms[variableName];
            if (!uniform.isArray) {
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
            }
            else {
                // When this uniform is array.
                switch (uniform.variableType) {
                    case "float":
                        DefaultValuePreProcessor._forFloatArray(variableName, uniform);
                        continue;
                    case "vec2":
                        DefaultValuePreProcessor._forVectorarray(variableName, 2, uniform);
                        continue;
                    case "vec3":
                        DefaultValuePreProcessor._forVectorarray(variableName, 3, uniform);
                        continue;
                    case "vec4":
                        DefaultValuePreProcessor._forVectorarray(variableName, 4, uniform);
                        continue;
                    case "mat4":
                        DefaultValuePreProcessor._forMat4Array(variableName, uniform);
                        continue;
                }
            }
        }
    }
    static _forFloat(name, uniform) {
        if (!uniform.variableAnnotation["default"]) {
            uniform.variableAnnotation["default"] = 0;
        }
    }
    static _forFloatArray(name, uniform) {
        if (!uniform.variableAnnotation["default"]) {
            const defaultValue = new Array(uniform.arrayLength);
            for (let i = 0; i < defaultValue.length; i++) {
                defaultValue[i] = 0; // [0,0,0.....0,0] will be used as default
            }
            uniform.variableAnnotation["default"] = defaultValue.slice(0, uniform.arrayLength);
        }
    }
    static _forVectorarray(name, dimension, uniform) {
        const defaultArray = VectorArray.zeroVectorArray(dimension, uniform.arrayLength);
        const defaultValue = uniform.variableAnnotation["default"];
        if (isArray(defaultValue)) {
            if (isArray(defaultValue[0])) {
                for (let i = 0; i < defaultValue.length; i++) {
                    defaultArray.setRawArray(i, defaultValue[i]);
                }
            }
            else {
                for (let i = 0; i < defaultValue.length; i++) {
                    defaultArray.rawElements[i] = defaultValue[i];
                }
            }
        }
        uniform.variableAnnotation["defualt"] = defaultArray;
    }
    static _forVec2(name, uniform) {
        const defaultValue = uniform.variableAnnotation["default"];
        const annotations = uniform.variableAnnotation;
        if (defaultValue) {
            if (Array.isArray(defaultValue)) {
                annotations["default"] = new Vector2(defaultValue[0], defaultValue[1]); // parse array as vector
            }
            else if (typeof defaultValue === "string") {
                annotations["default"] = Vector2.parse(defaultValue); // parse string representation as vector
            }
            else {
                console.error(`Unknown default value ${defaultValue}`);
                annotations["default"] = new Vector2(0, 0);
            }
        }
        else {
            annotations["default"] = new Vector2(0, 0); // use (0,0) as default when the default annotation was not specified
        }
    }
    static _forVec3(name, uniform) {
        const defaultValue = uniform.variableAnnotation["default"];
        const annotations = uniform.variableAnnotation;
        if (defaultValue) {
            if (Array.isArray(defaultValue)) {
                annotations["default"] = new Vector3(defaultValue[0], defaultValue[1], defaultValue[2]); // parse array as vector
            }
            else if (typeof defaultValue === "string") {
                annotations["default"] = Vector3.parse(defaultValue); // parse string representation as vector
            }
            else {
                console.error(`Unknown default value ${defaultValue}`);
                annotations["default"] = new Vector3(0, 0, 0);
            }
        }
        else {
            annotations["default"] = new Vector3(0, 0, 0); // use (0,0,0) as default when the default annotation was not specified
        }
    }
    static _forVec4(name, uniform) {
        const defaultValue = uniform.variableAnnotation["default"];
        const annotations = uniform.variableAnnotation;
        if (defaultValue) {
            if (Array.isArray(defaultValue)) {
                annotations["default"] = new Vector4(defaultValue[0], defaultValue[1], defaultValue[2], defaultValue[3]); // parse array as vector
            }
            else if (typeof defaultValue === "string") {
                annotations["default"] = Vector4.parse(defaultValue); // parse string representation as vector
            }
            else {
                console.error(`Unknown default value ${defaultValue}`);
                annotations["default"] = new Vector4(0, 0, 0, 0);
            }
        }
        else {
            annotations["default"] = new Vector4(0, 0, 0, 0); // use (0,0,0,0) as default when the default annotation was not specified
        }
    }
    static _forMat4(name, uniform) {
        const defaultValue = uniform.variableAnnotation["default"];
        const annotations = uniform.variableAnnotation;
        if (defaultValue) {
            if (Array.isArray(defaultValue)) {
                annotations["default"] = Matrix.fromElements.apply(defaultValue);
            }
            else {
                console.error(`Unknown default value ${defaultValue}`);
                annotations["default"] = Matrix.identity();
            }
        }
        else {
            annotations["default"] = Matrix.identity();
        }
    }
    static _forMat4Array(name, uniform) {
        const defaultValue = uniform.variableAnnotation["default"];
        uniform.variableAnnotation["default"] = MatrixArray.getIdentityMatrixArray(uniform.arrayLength);
        if (defaultValue) {
            if (isArray(defaultValue)) {
                for (let i = 0; i < defaultValue.length; i++) {
                    uniform.variableAnnotation["default"].rawElements[i] = defaultValue[i];
                }
            }
        }
    }
}
export default DefaultValuePreProcessor;
